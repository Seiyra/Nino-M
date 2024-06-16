import axios from 'axios';

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    let res = (await axios.get(`https://raw.githubusercontent.com/Ellie43242/Nino-Bot/main/images.js`)).data;

    let url = res[Math.floor(Math.random() * res.length)];
    
    await conn.sendFile(m.chat, url, 'image.jpg', '', m);

  } catch (error) {
    console.error(error);
    await conn.sendMessage(m.chat, { text: `❌ *Error:* ${error.message}` }, { quoted: m });
  }
};

handler.help = ['messi'];
handler.tags = ['img'];
handler.command = /^(ص)$/i;

export default handler;
