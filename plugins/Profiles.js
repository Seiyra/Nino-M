import mongoose from 'mongoose';

// MongoDB URI and Schema setup
const medoUri = 'mongodb+srv://itachi3mk:mypassis1199@cluster0.zzyxjo3.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(medoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(medoError => console.error('Error connecting to MongoDB:', medoError));

// Define the BK9 model
const medoBk9Schema = new mongoose.Schema({
    groupId: String,
    userId: String,
    bk9: String
});
const medoBK9 = mongoose.model('BK9', medoBk9Schema);

// Command handler functions
async function handleTitlesCommand(medoContext) {
    if (!medoContext.isGroup) {
        medoContext.reply('هذا الأمر يعمل فقط في المجموعات');
        return;
    }

    const groupMetadata = await medoContext.conn.groupMetadata(medoContext.chat);
    const groupAdmins = groupMetadata.participants.filter(participant => participant.admin !== null).map(admin => admin.id);

    if (!groupAdmins.includes(medoContext.sender)) {
        medoContext.reply('هذا الأمر يعمل فقط مع الإداريين');
        return;
    }

    const medoTitles = await medoBK9.find({ groupId: medoContext.chat });
    if (medoTitles.length === 0) {
        medoContext.reply('لا يوجد ألقاب مسجلة حاليا ┇');
    } else {
        const titleCounts = medoTitles.reduce((acc, medoTitle) => {
            acc[medoTitle.bk9] = (acc[medoTitle.bk9] || 0) + 1;
            return acc;
        }, {});

        let medoTitleList = '';
        Object.entries(titleCounts).forEach(([medoTitle, medoCount], medoIndex) => {
            medoTitleList += `${medoIndex + 1} ┇ اللقب: ${medoTitle} ┇ عدد الأشخاص: ${medoCount}\n`;
        });

        medoContext.reply(`┇ عدد الألقاب المسجلة: ${Object.keys(titleCounts).length}\n\n ┇الألقاب المسجلة:\n\n${medoTitleList}`);
    }
}

async function handleRegisterCommand(medoContext) {
    if (!medoContext.isGroup) {
        medoContext.reply('هذا الأمر يعمل فقط في المجموعات');
        return;
    }

    const groupMetadata = await medoContext.conn.groupMetadata(medoContext.chat);
    const groupAdmins = groupMetadata.participants.filter(participant => participant.admin !== null).map(admin => admin.id);

    if (!groupAdmins.includes(medoContext.sender)) {
        medoContext.reply('هذا الأمر يعمل فقط مع الإداريين');
        return;
    }

    if (!medoContext.quoted && (!medoContext.mentionedJid || medoContext.mentionedJid.length === 0)) {
        medoContext.reply('منشن احد او رد على رسالته واكتب اللقب الذي تريد تسجيله');
        return;
    }

    let medoUserId;
    if (medoContext.quoted) {
        medoUserId = medoContext.quoted.sender.replace('@s.whatsapp.net', '');
    } else {
        medoUserId = medoContext.mentionedJid[0].replace('@s.whatsapp.net', '');
    }

    const medoTextParts = medoContext.text.trim().split(' ').filter(medoPart => medoPart.trim() !== '');
    const medoTitle = medoTextParts.slice(1).join(' ');

    if (!/\S/.test(medoTitle)) {
        medoContext.reply('مثال:\n .تسجيل @العضو جيرايا');
        return;
    }

    const medoExistingTitle = await medoBK9.findOne({ bk9: medoTitle, groupId: medoContext.chat });
    if (medoExistingTitle) {
        const medoExistingUser = await medoContext.conn.getName(medoExistingTitle.userId + '@s.whatsapp.net');
        medoContext.reply(`اللقب ${medoTitle} مأخوذ من طرف @${medoExistingUser}`);
    } else {
        await medoBK9.findOneAndUpdate(
            { userId: medoUserId, groupId: medoContext.chat },
            { bk9: medoTitle },
            { upsert: true }
        );
        medoContext.reply(`┇ تم تسجيله بلقب ${medoTitle} بنجاح`);
    }
}

async function handleDeleteTitleCommand(medoContext) {
    if (!medoContext.isGroup) {
        medoContext.reply('هذا الأمر يعمل فقط في المجموعات');
        return;
    }

    const groupMetadata = await medoContext.conn.groupMetadata(medoContext.chat);
    const groupAdmins = groupMetadata.participants.filter(participant => participant.admin !== null).map(admin => admin.id);

    if (!groupAdmins.includes(medoContext.sender)) {
        medoContext.reply('هذا الأمر يعمل فقط مع الإداريين');
        return;
    }

    const medoTextParts = medoContext.text.trim().split(' ').filter(medoPart => medoPart.trim() !== '');
    const medoDeleteTitle = medoTextParts.slice(1).join(' ');

    if (!/\S/.test(medoDeleteTitle)) {
        medoContext.reply('اكتب اللقب الذي تريد حذفه');
        return;
    }

    const medoDeleteResult = await medoBK9.deleteOne({ bk9: medoDeleteTitle, groupId: medoContext.chat });

    if (medoDeleteResult.deletedCount > 0) {
        medoContext.reply(`┇ تم حذف اللقب ${medoDeleteTitle} بنجاح`);
    } else {
        medoContext.reply(`اللقب ${medoDeleteTitle} غير مسجل لاحد اساسا`);
    }
}

async function handleMyTitleCommand(medoContext) {
    const medoSenderId = medoContext.sender.replace('@s.whatsapp.net', '');
    const medoUserTitle = await medoBK9.findOne({ userId: medoSenderId, groupId: medoContext.chat });

    medoUserTitle && medoUserTitle.bk9
        ? medoContext.reply(`┇ لقبك هو : ${medoUserTitle.bk9}`)
        : medoContext.reply('┇ لم يتم تسجيلك بعد');
}

async function handleGetTitleCommand(medoContext) {
    let medoUserId;

    if (medoContext.quoted) {
        // If the message is a reply, get the sender of the quoted message
        medoUserId = medoContext.quoted.sender.replace('@s.whatsapp.net', '');
    } else if (medoContext.mentionedJid && medoContext.mentionedJid.length > 0) {
        // If someone is tagged, use the first mentioned user
        medoUserId = medoContext.mentionedJid[0].replace('@s.whatsapp.net', '');
    } else {
        medoContext.reply('منشن احد او رد على رسالته لمعرفة لقبه');
        return;
    }

    const medoQuotedUserTitle = await medoBK9.findOne({ userId: medoUserId, groupId: medoContext.chat });

    if (medoQuotedUserTitle) {
        const medoQuotedUserName = await medoContext.conn.getName(medoUserId + '@s.whatsapp.net');
        medoContext.reply(`┇ لقب ${medoQuotedUserName} هو : ${medoQuotedUserTitle.bk9}`);
    } else {
        medoContext.reply('┇ لم يتم تسجيله بعد');
    }
}

async function handleCheckTitleCommand(medoContext) {
    const medoTextParts = medoContext.text.trim().split(' ').filter(medoPart => medoPart.trim() !== '');

    // Ensure there is a title provided after the command
    if (medoTextParts.length < 2) {
        medoContext.reply('اكتب لقب للتحقق منه');
        return;
    }

    const medoCheckTitle = medoTextParts.slice(1).join(' ').trim(); // Extract the title from the command text
    const medoCheckResult = await medoBK9.findOne({ bk9: medoCheckTitle, groupId: medoContext.chat });

    if (medoCheckResult) {
        const medoCheckUser = await medoContext.conn.getName(medoCheckResult.userId + '@s.whatsapp.net');
        medoContext.reply(`اللقب ${medoCheckTitle} مأخوذ من طرف @${medoCheckUser}`);
    } else {
        medoContext.reply(`اللقب ${medoCheckTitle} متوفر`);
    }
}

// Main handler function
let medoHandler = async function (medoContext, { conn: medoConn, text: medoText, command: medoCommand }) {
    try {
        const groupMetadata = await medoConn.groupMetadata(medoContext.chat);
        const groupAdmins = groupMetadata.participants.filter(participant => participant.admin !== null).map(admin => admin.id);
        const isAdmin = groupAdmins.includes(medoContext.sender);
        medoContext.isAdmin = isAdmin;

        switch (medoCommand) {
            case 'الألقاب':
                await handleTitlesCommand(medoContext);
                break;
            case 'تسجيل':
                await handleRegisterCommand(medoContext);
                break;
            case 'حذف_لقب':
                await handleDeleteTitleCommand(medoContext);
                break;
            case 'لقبي':
                await handleMyTitleCommand(medoContext);
                break;
            case 'لقبه':
                await handleGetTitleCommand(medoContext);
                break;
            case 'لقب':
                await handleCheckTitleCommand(medoContext);
                break;
            default:
                medoContext.reply('أمر غير معروف');
        }
    } catch (error) {
        console.error('Error handling command:', error);
        medoContext.reply('حدث خطأ اثناء معالجة الأمر');
    }
};

// Attach command and tag info
medoHandler.command = ['الألقاب', 'تسجيل', 'لقبي', 'لقبه', 'حذف_لقب', 'لقب'];
medoHandler.tags = ['BK9'];

export default medoHandler;
