import fs from 'fs';

const handler = async (m, { conn, usedPrefix, command }) => {
  // Check if the user has a language file in the database
  const datas = global;
  const idioma = datas.db.data.users[m.sender]?.language || 'en'; // Default to English if language is not set
  const _translate = JSON.parse(fs.readFileSync(`./language/${idioma}.json`));
  const tradutor = _translate.plugins.gc_delete;

  // Ensure the user has replied to a message to delete it
  if (!m.quoted) throw tradutor.texto1;

  try {
    // Attempt to delete the quoted message
    const delet = m.quoted.participant || m.message.extendedTextMessage.contextInfo.participant;
    const bang = m.quoted.id || m.message.extendedTextMessage.contextInfo.stanzaId;

    return conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet } });
  } catch (e) {
    // Handle errors by using the message key instead
    console.error(e);
    return conn.sendMessage(m.chat, { delete: m.quoted.vM.key });
  }
};

// Metadata and settings for the command
handler.help = ['حذف'];
handler.tags = ['group'];
handler.command = ['حذف'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true; // The bot itself must be an admin to delete messages

export default handler;
 