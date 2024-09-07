import pkg from '@whiskeysockets/baileys';
const { proto, generateWAMessageFromContent } = pkg;

let handler = async (m, { conn, text, participants }) => {
    // Check if the sender is an admin
    if (!participants.find(p => p.id === m.sender && p.admin)) {
        return conn.reply(m.chat, 'This command can only be used by group admins.', m);
    }

    // If the message is a reply, use the content of the replied message
    let messageText = text; // Default to the user's input
    if (m.quoted) { // Check if the command is used as a reply to another message
        messageText = m.quoted.text || 'ضع رسالة'; // Use the replied message's text, or default to 'ضع رسالة' if none
    } else {
        messageText = text || 'ضع رسالة'; // If no reply, use the provided text or default
    }

    // Create mentions array for all participants
    let mentions = participants.map(p => p.id);

    // Create the message content
    const messageContent = {
        extendedTextMessage: {
            text: messageText,
            contextInfo: {
                mentionedJid: mentions
            }
        }
    };

    // Generate the WhatsApp message
    const waMessage = generateWAMessageFromContent(m.chat, proto.Message.fromObject(messageContent), {
        quoted: m,
        userJid: conn.user.id,
    });

    // Relay the message to the group
    await conn.relayMessage(m.chat, waMessage.message, { messageId: waMessage.key.id });
};

handler.help = ['broadcast'];
handler.tags = ['group'];
handler.command = ['مخفي'];
handler.group = true; // Restrict to group chats
handler.admin = true; // Restrict to admins only

export default handler;