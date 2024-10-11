import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Warning from '../lib/Warning.js'; // Ensure the correct path to your Warning model

dotenv.config();

const mongoUri = 'mongodb+srv://itachi3mk:mypassis1199@cluster0.zzyxjo3.mongodb.net/?retryWrites=true&w=majority';

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
}

connectToMongoDB();

// Command handler functions
async function checkBotAdmin(medoContext) {
    const groupMetadata = await medoContext.conn.groupMetadata(medoContext.chat);
    return groupMetadata.participants.some(participant => participant.id === medoContext.conn.user.jid && participant.admin !== null);
}

async function notifyAdminRequired(medoContext) {
    await medoContext.conn.sendMessage(medoContext.chat, {
        text: '⚠️ يجب أن يكون للبوت صلاحيات إدارية لطرد الأعضاء بعد 3 إنذارات.',
    });
}

async function removeUserIfNeeded(medoContext, userId, userName) {
    const userWarnings = await Warning.findOne({ userId, groupId: medoContext.chat });

    if (userWarnings && userWarnings.warnings.length >= 3) {
        const isBotAdmin = await checkBotAdmin(medoContext);
        if (isBotAdmin) {
            await medoContext.conn.sendMessage(medoContext.chat, {
                text: `⚠️ @${userName} تلقى 3 إنذارات! سيتم طرده من المجموعة 🚫`,
                mentions: [`${userId}@s.whatsapp.net`],
            });
            await medoContext.conn.groupRemove(medoContext.chat, [`${userId}@s.whatsapp.net`]);
        } else {
            await notifyAdminRequired(medoContext);
        }
    }
}

export async function handleAddWarningCommand(medoContext, cause) {
    if (!medoContext.isGroup) {
        return medoContext.reply('🚫 هذا الأمر يعمل فقط في المجموعات');
    }

    try {
        const groupMetadata = await medoContext.conn.groupMetadata(medoContext.chat);
        const groupAdmins = groupMetadata.participants.filter(participant => participant.admin !== null).map(admin => admin.id);

        if (!groupAdmins.includes(medoContext.sender)) {
            return medoContext.reply('⚠️ هذا الأمر خاص بالإداريين فقط');
        }

        let userId;
        let userName;

        if (medoContext.quoted) {
            userId = medoContext.quoted.sender.replace('@s.whatsapp.net', '');
            userName = medoContext.quoted.sender.replace('@s.whatsapp.net', '');
        } else if (medoContext.mentionedJid && medoContext.mentionedJid.length > 0) {
            userId = medoContext.mentionedJid[0].replace('@s.whatsapp.net', '');
            userName = medoContext.mentionedJid[0].replace('@s.whatsapp.net', '');
        } else {
            return medoContext.reply('⚠️ قم بمنشن شخص أو الرد على رسالة لإضافة إنذار 🔔');
        }

        cause = cause && cause.trim() ? cause : '❌ لم يتم تقديم سبب';

        const updatedWarning = await Warning.findOneAndUpdate(
            { userId, groupId: medoContext.chat },
            { $push: { warnings: { cause, date: new Date() } } },
            { new: true, upsert: true }
        );

        if (updatedWarning && updatedWarning.warnings && updatedWarning.warnings.length > 0) {
            const latestWarning = updatedWarning.warnings[updatedWarning.warnings.length - 1];
            const warningTime = new Date(latestWarning.date).toLocaleString('en-EG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });

            await medoContext.conn.sendMessage(medoContext.chat, {
                text: `🔔 *إنذار مضاف ل @${userName}!* 

📋 *عدد الإنذارات:* ${updatedWarning.warnings.length} / 3

*سبب الإنذار:*
- إنذار: _${latestWarning.cause}_


🕒 *تاريخ الإنذار:* ${warningTime}


🚨 *تحذير:* إذا وصلت إلى 3 إنذارات، سيتم إزالتك من المجموعة.`,
                mentions: [`${userId}@s.whatsapp.net`]
            });

            await removeUserIfNeeded(medoContext, userId, userName);
        }
    } catch (error) {
        console.error('Error in handleAddWarningCommand:', error.message);
        medoContext.reply('❌ حدث خطأ أثناء إضافة الإنذار.');
    }
}
export async function handleCheckUserWarningsCommand(medoContext) {
    let userId;
    let userName = '';

    if (medoContext.quoted) {
        userId = medoContext.quoted.sender.replace('@s.whatsapp.net', '');
    } else if (medoContext.mentionedJid && medoContext.mentionedJid.length > 0) {
        userId = medoContext.mentionedJid[0].replace('@s.whatsapp.net', '');
    } else {
        return medoContext.reply('⚠️ منشن شخص أو رد على رسالة شخص لرؤية إنذاراته.');
    }

    try {
        const groupMetadata = await medoContext.conn.groupMetadata(medoContext.chat);
        const user = groupMetadata.participants.find(p => p.id === `${userId}@s.whatsapp.net`);
        userName = user ? user.notify || user.id.split('@')[0] : userId;

        const userWarnings = await Warning.findOne({ userId, groupId: medoContext.chat });

        if (userWarnings && userWarnings.warnings.length > 0) {
            let response = `╭─🚨 إنذارات @${userName} 🚨─╮\n`;
            userWarnings.warnings.forEach((warning, index) => {
                response += `\n${index + 1}. ⚠️ السبب: ${warning.cause}\n   📅 التاريخ: ${new Date(warning.date).toLocaleString()}\n`;
            });
            response += `╰──────────╯`;
            await medoContext.conn.sendMessage(medoContext.chat, {
                text: response,
                mentions: [`${userId}@s.whatsapp.net`]
            });
        } else {
            await medoContext.conn.sendMessage(medoContext.chat, {
                text: `✔️ @${userName} ليس لديه أي إنذارات.`,
                mentions: [`${userId}@s.whatsapp.net`]
            });
        }
    } catch (error) {
        console.error('Error in handleCheckUserWarningsCommand:', error.message);
        medoContext.reply('❌ حدث خطأ أثناء جلب الإنذارات.');
    }
}

export async function handleCheckOwnWarningsCommand(medoContext) {
    if (!medoContext.isGroup) {
        return medoContext.reply('🚫 هذا الأمر يعمل فقط في المجموعات');
    }

    try {
        const userId = medoContext.sender.replace('@s.whatsapp.net', '');
        const userWarnings = await Warning.findOne({ userId, groupId: medoContext.chat });

        if (userWarnings && userWarnings.warnings.length > 0) {
            let response = `╭─🚨 إنذاراتك 🚨─╮\n`;
            userWarnings.warnings.forEach((warning, index) => {
                response += `\n${index + 1}. ⚠️ السبب: ${warning.cause}\n   📅 التاريخ: ${new Date(warning.date).toLocaleString()}\n`;
            });
            response += `╰──────────╯`;
            await medoContext.conn.sendMessage(medoContext.chat, {
                text: response,
                mentions: [medoContext.sender]
            });
        } else {
            await medoContext.conn.sendMessage(medoContext.chat, {
                text: `✔️ ليس لديك أي إنذارات.`,
                mentions: [medoContext.sender]
            });
        }
    } catch (error) {
        console.error('Error in handleCheckOwnWarningsCommand:', error.message);
        medoContext.reply('❌ حدث خطأ أثناء جلب الإنذارات.');
    }
}

export async function handleClearUserWarningsCommand(medoContext) {
    if (!medoContext.isGroup) {
        return medoContext.reply('🚫 هذا الأمر يعمل فقط في المجموعات');
    }

    try {
        const groupMetadata = await medoContext.conn.groupMetadata(medoContext.chat);
        const groupAdmins = groupMetadata.participants.filter(participant => participant.admin !== null).map(admin => admin.id);

        if (!groupAdmins.includes(medoContext.sender)) {
            return medoContext.reply('⚠️ هذا الأمر خاص بالإداريين فقط');
        }

        let userId;

        if (medoContext.quoted) {
            userId = medoContext.quoted.sender.replace('@s.whatsapp.net', '');
        } else if (medoContext.mentionedJid && medoContext.mentionedJid.length > 0) {
            userId = medoContext.mentionedJid[0].replace('@s.whatsapp.net', '');
        } else {
            return medoContext.reply('⚠️ قم بمنشن شخص أو الرد على رسالة لإزالة الإنذارات 🔔');
        }

        await Warning.deleteMany({ userId, groupId: medoContext.chat });
        await medoContext.conn.sendMessage(medoContext.chat, {
            text: `✔️ تم إزالة جميع الإنذارات لـ @${userId}!`,
            mentions: [`${userId}@s.whatsapp.net`]
        });
    } catch (error) {
        console.error('Error in handleClearUserWarningsCommand:', error.message);
        medoContext.reply('❌ حدث خطأ أثناء إزالة الإنذارات.');
    }
}
// Main handler function
const medoWarningsHandler = async function (medoContext, { conn: medoConn, text: medoText, command: medoCommand }) {
    try {
      switch (medoCommand) {
        case 'انذار':
          await handleAddWarningCommand(medoContext, medoText.split(' ').slice(1).join(' '));
          break;
        case 'انذاراتي':
          await handleCheckOwnWarningsCommand(medoContext);
          break;
        case 'انذاراته':
          await handleCheckUserWarningsCommand(medoContext);
          break;
        case 'حذف-انذار':
          await handleRemoveWarningCommand(medoContext, medoText.split(' ').slice(1).join(' '));
          break;
        case 'حذف-انذاراته':
          await handleClearUserWarningsCommand(medoContext);
          break;
        default:
          await medoContext.reply('⚠️ أمر غير معروف');
      }
    } catch (error) {
      console.error('Error handling command:', error);
      medoContext.reply('❌ حدث خطأ أثناء معالجة الأمر.');
    }
  };
  
  // Attach command and tag info
  medoWarningsHandler.command = ['انذار', 'انذاراتي', 'انذاراته', 'حذف-انذار', 'حذف-انذاراته'];
  medoWarningsHandler.tags = ['Warnings'];
  
  export default medoWarningsHandler;