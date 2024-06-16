import fetch from 'node-fetch';
import { addExif } from '../lib/sticker.js';
import { Sticker } from 'wa-sticker-formatter';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let stiker = false;
  try {
    let [packname, ...author] = args.join(' ').split(/!|\|/);
    author = (author || []).join('|');
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || '';

    if (/webp/g.test(mime)) {
      let img = await q.download?.();
      stiker = await addExif(img, packname || global.packname, author || global.author);
    } else if (/image/g.test(mime)) {
      let img = await q.download?.();
      stiker = await createSticker(img, false, packname || global.packname, author || global.author);
    } else if (/video/g.test(mime)) {
      let img = await q.download?.();
      if ((q.msg || q).seconds > 7) return m.reply('*Video cannot be longer than 7 seconds*');
      stiker = await mp4ToWebp(img, { pack: packname || global.packname, author: author || global.author });
    } else if (args[0] && isUrl(args[0])) {
      stiker = await createSticker(false, args[0], packname || global.packname, author);
    } else {
      throw `*RESPOND TO AN IMAGE OR VIDEO OR GIF WITH ${usedPrefix + command}*`;
    }
  } catch (e) {
    console.error(e);
    stiker = '*Failed to create sticker*';
  } finally {
    if (stiker instanceof Buffer) {
      await conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m });
    } else {
      m.reply(stiker);
    }
  }
};

handler.help = ['sfull'];
handler.tags = ['sticker'];
handler.command = /^s(tic?ker)?(gif)?(wm)?$/i;
export default handler;

const isUrl = (text) => {
  return /https?:\/\/\S+\.(jpg|jpeg|png|gif)/i.test(text);
};

async function createSticker(img, url, packName, authorName, quality = 20) {
  let stickerMetadata = { type: 'full', pack: packName, author: authorName, quality };
  return new Sticker(img ? img : url, stickerMetadata).toBuffer();
}

async function mp4ToWebp(file, stickerMetadata) {
  let getBase64 = file.toString('base64');
  const Format = {
    file: `data:video/mp4;base64,${getBase64}`,
    processOptions: {
      crop: stickerMetadata?.crop,
      startTime: '00:00:00.0',
      endTime: '00:00:07.0',
      loop: 0,
    },
    stickerMetadata: { ...stickerMetadata },
    sessionInfo: {
      WA_VERSION: '2.2106.5',
      PAGE_UA: 'WhatsApp/2.2037.6 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36',
      WA_AUTOMATE_VERSION: '3.6.10 UPDATE AVAILABLE: 3.6.11',
      BROWSER_VERSION: 'HeadlessChrome/88.0.4324.190',
      OS: 'Windows Server 2016',
      START_TS: 1614310326309,
      NUM: '6247',
      LAUNCH_TIME_MS: 7934,
      PHONE_VERSION: '2.20.205.16',
    },
    config: {
      sessionId: 'session',
      headless: true,
      qrTimeout: 20,
      authTimeout: 0,
      cacheEnabled: false,
      useChrome: true,
      killProcessOnBrowserClose: true,
      throwErrorOnTosBlock: false,
      chromiumArgs: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--aggressive-cache-discard',
        '--disable-cache',
        '--disable-application-cache',
        '--disable-offline-load-stale-cache',
        '--disk-cache-size=0',
      ],
      executablePath: 'C:\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
      skipBrokenMethodsCheck: true,
      stickerServerEndpoint: true,
    },
  };

  let res = await fetch('https://sticker-api.openwa.dev/convertMp4BufferToWebpDataUrl', {
    method: 'post',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(Format),
  });

  return Buffer.from((await res.text()).split(';base64,')[1], 'base64');
}
