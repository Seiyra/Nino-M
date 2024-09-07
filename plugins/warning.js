import { mongoDB } from '../lib/mongoDB.js';

const mongoInstance = new mongoDB('mongodb://username:password@cluster.mongodb.net/dbname');

let giveWarning = async function (context, { conn, isAdmin }) {
  try {
    if (!context.isGroup) {
      context.reply('هذا الأمر يعمل فقط في المجموعات');
      return;
    } 
    if (!isAdmin) {
      context.reply('هذا الأمر متاح فقط للمشرفين');
      return;
    }
    if (!context.mentionedJid || context.mentionedJid.length === 0) {
      context.reply('منشن احد لاعطائه انذار');
      return;
    }

    const userId = context.mentionedJid[0].replace('@s.whatsapp.net', '');
    const groupId = context.chat;

    // Add a warning
    const warningRecord = await mongoInstance.addWarning(groupId, userId);

    // Inform the group about the warning
    const warningCount = warningRecord.warnings;
    context.reply(`تم اعطاء انذار الى @${userId}\nعدد الانذارات: ${warningCount}`, null, { mentions: [context.mentionedJid[0]] });

    // Remove user from group if they reach 3 warnings
    if (warningCount >= 3) {
      context.reply(`@${userId} حصل على 3 انذارات وسيتم طرده من المجموعة.`, null, { mentions: [context.mentionedJid[0]] });
      await conn.groupParticipantsUpdate(context.chat, [context.mentionedJid[0]], 'remove');
    }
  } catch (error) {
    console.error('Error in giveWarning command:', error);
    context.reply('حدث خطأ أثناء إعطاء الانذار.');
  }
};

export default giveWarning;
  