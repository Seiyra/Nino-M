import pkg from '@whiskeysockets/baileys';
const { proto } = pkg;

let handler = async (m, { conn, participants, usedPrefix, command }) => {
    // Check if a user is mentioned or quoted
    if (!m.mentionedJid[0] && !m.quoted) {
        // Send a message asking the user to mention someone, write their number, or tag their message
        return m.reply('منشن حد او اكتب رقمه او منشن رسالته', m.chat);
    }

    let kickMessage = `*دزمها ${m.mentionedJid[0] ? conn.getName(m.mentionedJid[0]) : conn.getName(m.quoted.sender)}!*`;

    // Determine the user to be kicked
    let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;

    // Send the message before kicking
    await conn.reply(m.chat, kickMessage, m);

    // Remove the user from the group
    await conn.groupParticipantsUpdate(m.chat, [user], 'remove');

    // Confirm the action
    m.reply(`*تـــم الــطرد !*`);
}

handler.help = ['kick @user'];
handler.tags = ['group'];
handler.command =/^(طرد|بكعبي|دز|انقلع|بنعالي)$/i
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
