import { areJidsSameUser } from '@whiskeysockets/baileys';

let handler = async (m, { conn, text, participants }) => {
    // Check if the sender is an admin
    const isAdmin = participants.find(p => areJidsSameUser(p.id, m.sender) && p.admin);
    if (!isAdmin) {
        return m.reply('فقط المشرفين يمكنهم استخدام هذا الأمر');
    }

    let users;
    if (m.quoted) {
        users = [m.quoted.sender];
    } else if (m.mentionedJid[0]) {
        users = m.mentionedJid.filter(u => !areJidsSameUser(u, conn.user.id));
    } else if (!text) {
        return m.reply('الرجاء الرد/الإشارة إلى عضو');
    } else {
        users = text.split(/\s+/); // Assumes text is a space-separated list of user IDs
    }

    let kickedUser = [];
    if (m.quoted) {
        await conn.groupParticipantsUpdate(m.chat, users, 'remove');
        kickedUser = users;
    } else {
        for (let user of users) {
            if (user.endsWith('@s.whatsapp.net') && !(participants.find(v => areJidsSameUser(v.id, user) && v.admin))) {
                try {
                    const res = await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
                    kickedUser.push(user);
                    await delay(1 * 1000);
                } catch (err) {
                    console.error('Error removing user:', err);
                }
            }
        }
    }

    m.reply(`*نجاح في إخراج* ${kickedUser.length > 0 ? kickedUser.map(v => '@' + v.split('@')[0]).join(', ') : 'لم يتم العثور على مستخدمين'}`, null, { mentions: kickedUser });
};

handler.help = ['kick', '-'];
handler.tags = ['owner']; // Adjust if necessary
handler.command = /^(طرد|دزمها|انقلع|بنعالي)$/i;
handler.admin = true;  // Ensures that this command can only be used by admins
handler.group = true;  // Ensures that this command can only be used in groups
handler.botAdmin = true; // Ensures that the bot itself is an admin

export default handler;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
