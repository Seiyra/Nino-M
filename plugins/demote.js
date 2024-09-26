let handler = async (m, { conn, usedPrefix, command, text }) => {
  let number;

  // Check if the text is a number, a tag, or empty
  if (isNaN(text)) {
    if (text && text.includes('@')) {
      number = text.split`@`[1]; // Extract number from tag
    }
  } else {
    number = text; // Number input
  }

  // If no text and no quoted message
  if (!number && !m.quoted)
    return conn.reply(m.chat, `✳️ Usage: \n *${usedPrefix + command}* @tag or reply to a user`, m);

  // If number length is invalid
  if (number && (number.length > 13 || number.length < 11))
    return conn.reply(m.chat, `✳️ Invalid number`, m);

  try {
    let user;
    if (number) {
      user = number + '@s.whatsapp.net'; // Set the user based on the number
    } else if (m.quoted) {
      user = m.quoted.sender; // Use quoted message sender
    } else if (m.mentionedJid) {
      user = m.mentionedJid[0]; // Use mentioned user
    }

    // Proceed to demote the user without sending any confirmation
    await conn.groupParticipantsUpdate(m.chat, [user], 'demote');

  } catch (e) {
    console.error(e);
    m.reply(`❌ Failed to demote the user.`);
  }
}

handler.help = ['demote (@tag)']
handler.tags = ['group']
handler.command = ['تخفيض'] // Arabic for "demote"
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler;
