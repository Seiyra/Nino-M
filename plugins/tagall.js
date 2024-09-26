let handler = async (m, { conn, participants }) => {
    // Filter out the bot's own ID from participants and create a list of user JIDs
    let users = participants.map(u => u.id).filter(v => v !== conn.user.jid);

    if (!m.quoted) throw `Reply to a message to mention everyone!`;

    // Create a message string with each user's @username on a new line
    let message = 'Mentions:\n';
    users.forEach(user => {
        message += `@${user.split('@')[0]}\n`;  // Extract the part before @ and list it
    });

    // Send the message with mentions
    await conn.sendMessage(
        m.chat,
        { text: message.trim(), mentions: users },  // Send the message and include mentions
        { quoted: m.quoted }  // Forward the quoted message
    );
};

handler.help = ['tag'];
handler.tags = ['owner'];
handler.command = /^(totag|منشن)$/i;
handler.admin = true;  // Only admins can use this command
handler.group = true;  // Only in groups

export default handler;