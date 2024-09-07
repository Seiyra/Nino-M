import { UserProfile, UserMessage } from './models.js';
import { medoBK9 } from './profiles.js'; // Import the model from the appropriate file
import mongoose from 'mongoose';

// MongoDB URI and Schema setup
const medoUri = 'mongodb+srv://itachi3mk:mypassis1199@cluster0.zzyxjo3.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(medoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(medoError => console.error('Error connecting to MongoDB:', medoError));

// Define the schema and model
const medoBk9Schema = new mongoose.Schema({
    groupId: String,
    userId: String,
    bk9: String
});
const medoBK9 = mongoose.model('BK9', medoBk9Schema);

// Combined command handler function
let combinedHandler = async function (context, { conn, text, command, isAdmin }) {
    try {
        // Profile commands
        if (command === 'بروفايل') {
            if (!context.isGroup) {
                context.reply('هذا الأمر يعمل فقط في المجموعات');
                return;
            }

            const userId = context.sender.split('@')[0];
            const profile = await UserProfile.findOne({ groupId: context.chat, userId });
            const messageCountDoc = await UserMessage.findOne({ groupId: context.chat, userId });
            const titleDoc = await medoBK9.findOne({ userId, groupId: context.chat });

            if (profile) {
                const title = titleDoc ? titleDoc.bk9 : 'لم يتم تعيين لقب';
                const messageCount = messageCountDoc ? messageCountDoc.messageCount : 0;
                context.reply(`┇ لقبك: ${title}\n┇ عدد الرسائل: ${messageCount}`);
            } else {
                context.reply('┇ لم يتم إنشاء ملفك الشخصي بعد.');
            }
        } else if (command === 'ملف_الاعضاء') {
            if (!context.isGroup) {
                context.reply('هذا الأمر يعمل فقط في المجموعات');
                return;
            }

            if (!isAdmin) {
                context.reply('هذا الأمر متاح فقط للإداريين');
                return;
            }

            const profiles = await UserProfile.find({ groupId: context.chat });
            const messageCounts = await UserMessage.find({ groupId: context.chat });
            const titles = await medoBK9.find({ groupId: context.chat });

            let profileList = '';
            profiles.forEach(profile => {
                const messageCount = messageCounts.find(count => count.userId === profile.userId)?.messageCount || 0;
                const title = titles.find(t => t.userId === profile.userId)?.bk9 || 'بدون لقب';
                profileList += `┇ ${title} - عدد الرسائل: ${messageCount}\n`;
            });

            context.reply(`┇ ملفات الأعضاء:\n\n${profileList || 'لا توجد بيانات للأعضاء.'}`);
        } else if (command === 'إنشاء_ملف') {
            if (!context.isGroup) {
                context.reply('هذا الأمر يعمل فقط في المجموعات');
                return;
            }

            const [_, ...titleParts] = text.split(' ');
            const title = titleParts.join(' ');
            const userId = context.sender.split('@')[0];

            let profile = await UserProfile.findOne({ groupId: context.chat, userId });

            if (profile) {
                profile.لقب = title;
                await profile.save();
                context.reply('تم تحديث ملفك الشخصي بنجاح.');
            } else {
                profile = new UserProfile({ groupId: context.chat, userId, لقب: title });
                await profile.save();
                context.reply('تم إنشاء ملفك الشخصي بنجاح.');
            }
        }
        // BK9 commands
        else if (command === 'الألقاب') {
            if (!context.isGroup) {
                context.reply('هذا الأمر يعمل فقط في المجموعات');
                return;
            }
            if (!isAdmin) {
                context.reply('هذا الأمر يعمل فقط مع الإداريين');
                return;
            }
            const titles = await medoBK9.find({ groupId: context.chat });
            if (titles.length === 0) {
                context.reply('لا يوجد ألقاب مسجلة حاليا ┇');
            } else {
                let titleList = '';
                titles.forEach((title, index) => {
                    titleList += `${index + 1} ┇ اللقب ${title.bk9}\n`;
                });
                context.reply(`┇ عدد الألقاب المسجلة: ${titles.length}\n\n ┇الألقاب المسجلة:\n\n${titleList}`);
            }
        } else if (command === 'تسجيل') {
            if (!context.isGroup) {
                context.reply('هذا الأمر يعمل فقط في المجموعات');
                return;
            }
            if (!isAdmin) {
                context.reply('هذا الأمر يعمل فقط مع الإداريين');
                return;
            }
            if (!context.quoted && (!context.mentionedJid || context.mentionedJid.length === 0)) {
                context.reply('منشن احد او رد على رسالته واكتب اللقب الذي تريد تسجيله');
                return;
            }

            let userId;
            if (context.quoted) {
                userId = context.quoted.sender.replace('@s.whatsapp.net', '');
            } else {
                userId = context.mentionedJid[0].replace('@s.whatsapp.net', '');
            }

            const title = text.trim().split(' ').slice(1).join(' ');

            if (!/\S/.test(title)) {
                context.reply('مثال:\n .تسجيل @العضو جيرايا');
                return;
            }

            const existingTitle = await medoBK9.findOne({ bk9: title, groupId: context.chat });
            if (existingTitle) {
                const existingUser = await conn.getName(existingTitle.userId + '@s.whatsapp.net');
                context.reply(`اللقب ${title} مأخوذ من طرف @${existingUser}`);
            } else {
                await medoBK9.findOneAndUpdate(
                    { userId, groupId: context.chat },
                    { bk9: title },
                    { upsert: true }
                );
                context.reply(`┇ تم تسجيله بلقب ${title} بنجاح`);
            }
        } else if (command === 'حذف_لقب') {
            if (!context.isGroup) {
                context.reply('هذا الأمر يعمل فقط في المجموعات');
                return;
            }
            if (!isAdmin) {
                context.reply('هذا الأمر يعمل فقط مع الإداريين');
                return;
            }
            if (!text || text.trim() === '') {
                context.reply('اكتب اللقب الذي تريد حذفه');
                return;
            }
            const deleteTitle = text.trim();
            const deleteResult = await medoBK9.deleteOne({ bk9: deleteTitle, groupId: context.chat });
            deleteResult.deletedCount > 0
                ? context.reply(`┇ تم حذف اللقب ${deleteTitle} بنجاح`)
                : context.reply(`اللقب ${deleteTitle} غير مسجل لاحد اساسا`);
        } else if (command === 'لقبي') {
            const senderId = context.sender.split('@')[0];
            const userTitle = await medoBK9.findOne({ userId: senderId, groupId: context.chat });
            userTitle && userTitle.bk9
                ? context.reply(`┇ لقبك هو : ${userTitle.bk9}`)
                : context.reply('┇ لم يتم تسجيلك بعد');
        } else if (command === 'لقبه' && context.mentionedJid && context.mentionedJid.length > 0) {
            const mentionedUserId = context.mentionedJid[0].replace('@s.whatsapp.net', '');
            const mentionedUserTitle = await medoBK9.findOne({ userId: mentionedUserId, groupId: context.chat });
            if (mentionedUserTitle) {
                const mentionedUserName = await conn.getName(mentionedUserId + '@s.whatsapp.net');
                context.reply(`┇ لقبه هو : ${mentionedUserTitle.bk9}`);
            } else {
                context.reply('┇ لم يتم تسجيله بعد');
            }
        } else if (command === 'لقب') {
            if (!text || text.trim() === '') {
                context.reply('اكتب لقب للتحقق منه');
                return;
            }
            const checkTitle = text.trim();
            const checkResult = await medoBK9.findOne({ bk9: checkTitle, groupId: context.chat });
            if (checkResult) {
                const checkUser = await conn.getName(checkResult.userId + '@s.whatsapp.net');
                context.reply(`اللقب ${checkTitle} ماخوذ من طرف ${checkUser}`);
            } else {
                context.reply(`اللقب ${checkTitle} متوفر`);
            }
        }
    } catch (error) {
        console.error('خطأ:', error);
    }
};

// Attach command and tag info
combinedHandler.command = ['بروفايل', 'ملف_الاعضاء', 'إنشاء_ملف', 'الألقاب', 'تسجيل', 'لقبي', 'لقبه', 'حذف_لقب', 'لقب'];
combinedHandler.tags = ['profile', 'BK9'];

export default combinedHandler;
