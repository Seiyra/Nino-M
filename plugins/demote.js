import fs from 'fs';

const handler = async (m, { conn, usedPrefix, text }) => {
  const datas = global;

  // Set the language, defaulting to 'en' if undefined
  const idioma = datas.db.data.users[m.sender].language || 'en';

  let _translate;
  try {
    _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`));
  } catch (e) {
    console.error(`Language file not found for ${idioma}, defaulting to English.`);
    _translate = JSON.parse(fs.readFileSync(`./src/languages/en.json`));  // Fallback to English
  }

  const tradutor = _translate.plugins.gc_demote;

  let number;
  if (isNaN(text)) {
    if (text.includes('@')) {
      number = text.split('@')[1]; // Extract number from @mention
    }
  } else {
    number = text;
  }

  if (!text && !m.quoted) {
    return conn.reply(
      m.chat,
      `${tradutor.texto1[0]} ${usedPrefix}quitaradmin @tag*\n*┠≽ ${usedPrefix}quitaradmin ${tradutor.texto1[1]}`,
      m
    );
  }

  if (!number || number.length > 13 || number.length < 11) {
    return conn.reply(m.chat, tradutor.texto2, m); // Invalid number length message
  }

  let user;
  try {
    if (text) {
      user = `${number}@s.whatsapp.net`;
    } else if (m.quoted && m.quoted.sender) {
      user = m.quoted.sender;
    } else if (m.mentionedJid && m.mentionedJid.length > 0) {
      user = m.mentionedJid[0];
    }
  } catch (e) {
    console.error(e);
    return conn.reply(m.chat, tradutor.texto2, m); // Fallback in case of error
  }

  if (user) {
    await conn.groupParticipantsUpdate(m.chat, [user], 'demote');
    conn.reply(m.chat, tradutor.texto3, m); // Successfully demoted
  }
};

handler.help = ['*593xxx*', '*@usuario*', '*responder chat*'].map((v) => 'demote ' + v);
handler.tags = ['group'];
handler.command = /^(demote|quitarpoder|quitaradmin)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
handler.fail = null;

export default handler;
