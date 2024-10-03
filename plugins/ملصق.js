import fetch from 'node-fetch';
import { addExif } from '../lib/sticker.js';
import { Sticker, StickerTypes } from 'wa-sticker-formatter'; // Import Sticker

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let stiker = false;
  try {
    console.log('Handler invoked with args:', args); // Log arguments

    let [packname, ...author] = args.join(' ').split(/!|\|/);
    author = (author || []).join('|');
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || '';

    console.log('Detected MIME type:', mime);

    if (/webp/g.test(mime)) {
      console.log('Processing WEBP image');
      let img = await q.download?.();
      if (!img) {
        console.error('Failed to download WEBP image');
        throw new Error('Failed to download WEBP image');
      }
      console.log('Downloaded WEBP image successfully');
      stiker = await addExif(img, packname || global.packname, author || global.author);
      console.log('Sticker created with addExif');
    } else if (/image/g.test(mime)) {
      console.log('Processing static image');
      let img = await q.download?.();
      if (!img) {
        console.error('Failed to download image');
        throw new Error('Failed to download image');
      }
      console.log('Downloaded image successfully');
      stiker = await createSticker(img, null, packname || global.packname, author || global.author);
      console.log('Sticker created from image');
    } else if (/video/g.test(mime) || /gif/g.test(mime)) {
      console.log('Processing video/gif');
      let img = await q.download?.();
      if (!img) {
        console.error('Failed to download video/gif');
        throw new Error('Failed to download video/gif');
      }
      console.log('Downloaded video/gif successfully');
      if ((q.msg || q).seconds > 7) {
        console.log('Video/GIF longer than 7 seconds');
        return m.reply('*Video or GIF cannot be longer than 7 seconds*');
      }
      stiker = await createSticker(img, null, packname || global.packname, author || global.author, true);
      console.log('Animated sticker created from video/gif');
    } else if (args[0] && isUrl(args[0])) {
      console.log('Processing sticker from URL:', args[0]);
      stiker = await createSticker(null, args[0], packname || global.packname, author || global.author);
      console.log('Sticker created from URL');
    } else {
      console.log('Invalid media type or no media provided');
      throw new Error(`*RESPOND TO AN IMAGE, VIDEO, OR GIF WITH ${usedPrefix + command}*`);
    }
  } catch (e) {
    console.error('Error in sticker creation:', e);
    stiker = `*Failed to create sticker: ${e.message || e}*`;
  } finally {
    if (stiker instanceof Buffer) {
      console.log('Sending sticker to chat');
      await conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m });
    } else {
      console.log('Sending error message to user');
      m.reply(stiker);
    }
  }
};

handler.help = ['sfull'];
handler.tags = ['sticker'];
handler.command = ['ملصق','ملصقي'];
export default handler;

const isUrl = (text) => {
  return /https?:\/\/\S+\.(jpg|jpeg|png|gif)/i.test(text);
};

async function createSticker(img, url, packName, authorName, animated = false) {
  try {
    console.log('Creating sticker with:', { img: !!img, url: !!url, packName, authorName, animated });
    let stickerMetadata = { 
      type: animated ? StickerTypes.FULL : StickerTypes.DEFAULT, 
      pack: packName, 
      author: authorName, 
      quality: 100 // Set quality to 100 to maintain original quality without compression
    };
    const sticker = new Sticker(img || url, stickerMetadata);
    const buffer = await sticker.toBuffer();
    console.log('Sticker buffer created successfully, length:', buffer.length);
    return buffer;
  } catch (error) {
    console.error('Error in createSticker function:', error);
    throw error;
  }
}
