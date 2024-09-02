import { canLevelUp, xpRange } from '../lib/levelling.js';

// Helper function to convert phone number to JID
const phoneToJid = (phone) => {
    if (!phone.startsWith('+')) phone = `+${phone}`;
    return `${phone.replace('+', '')}@s.whatsapp.net`;
};

// Helper function to get user ID from mentions or phone numbers
const getUserIdFromInput = async (conn, input) => {
    let mentionedJid = conn.parseMention(input); // Extract mentioned JIDs
    if (mentionedJid.length > 0) {
        return mentionedJid[0]; // Use the first mentioned JID
    } else {
        let phone = input.trim();
        let jid = phoneToJid(phone);
        let result = await conn.onWhatsApp(jid);
        if (result[0]?.exists) {
            return jid; // Return the JID if the number exists
        } else {
            return null; // Return null if the number does not exist
        }
    }
};

let handler = async (m, { conn, text }) => {
    try {
        // Check if the sender is an admin
        let metadata = await conn.groupMetadata(m.chat);
        let participants = metadata.participants;
        let isAdmin = participants.find(participant => participant.id === m.sender)?.admin;

        if (!isAdmin) {
            return m.reply('فقط المشرفين يمكنهم تعيين العناوين.');
        }

        // Check if the command format is correct
        let parts = text.split(' ');
        if (parts.length < 2) {
            return m.reply('📜 *كيفية استخدام الأمر:* \n\n.سجل [رقم الهاتف أو @المستخدم] [العنوان]\n\nيرجى تقديم رقم الهاتف أو ذكر المستخدم بالإضافة إلى العنوان.');
        }

        // Extract the user and title from the command text
        let [input, ...titleParts] = text.split(' ');
        let title = titleParts.join(' ').trim();
        if (!title) {
            return m.reply('يرجى توفير عنوان.');
        }

        // Get user ID from mentions or phone numbers
        let userId = await getUserIdFromInput(conn, input);
        if (!userId) {
            return m.reply('لم يتم العثور على المستخدم. يرجى التحقق من الرقم أو الإشارة.');
        }

        // Ensure user's data exists
        if (!global.db.data.users[userId]) {
            global.db.data.users[userId] = {};
        }

        // Save the title in the user's data
        global.db.data.users[userId].title = title;
        m.reply(`تم تسجيل المستخدم بنجاح. عنوانه هو: ${title}`);

    } catch (error) {
        console.error('Error in settitle handler:', error);
        m.reply('حدث خطأ أثناء تعيين العنوان.');
    }
}

handler.help = ['settitle'];
handler.tags = ['admin'];
handler.command = ['سجل'];

export default handler;
