import 'node-fetch';
import { addExif } from '../lib/sticker.js';
import { Sticker, StickerTypes } from 'wa-sticker-formatter';
let handler = async (_0x5dc100, {
  conn: _0x464e25,
  args: _0x46aa1b,
  usedPrefix: _0x3e1b6c,
  command: _0x2d7333
}) => {
  let _0x28bc43 = false;
  try {
    console.log("Handler invoked with args:", _0x46aa1b);
    let [_0x50df29, ..._0x512085] = _0x46aa1b.join(" ").split(/!|\|/);
    _0x512085 = (_0x512085 || []).join('|');
    let _0x1f2a37 = _0x5dc100.quoted ? _0x5dc100.quoted : _0x5dc100;
    let _0x4e0aed = (_0x1f2a37.msg || _0x1f2a37).mimetype || _0x1f2a37.mediaType || '';
    console.log("Detected MIME type:", _0x4e0aed);
    if (/webp/g.test(_0x4e0aed)) {
      console.log("Processing WEBP image");
      let _0xe2e207 = await _0x1f2a37.download?.();
      if (!_0xe2e207) {
        console.error("Failed to download WEBP image");
        throw new Error("Failed to download WEBP image");
      }
      console.log("Downloaded WEBP image successfully");
      _0x28bc43 = await addExif(_0xe2e207, _0x50df29 || global.packname, _0x512085 || global.author);
      console.log("Sticker created with addExif");
    } else {
      if (/image/g.test(_0x4e0aed)) {
        console.log("Processing static image");
        let _0x306725 = await _0x1f2a37.download?.();
        if (!_0x306725) {
          console.error("Failed to download image");
          throw new Error("Failed to download image");
        }
        console.log("Downloaded image successfully");
        _0x28bc43 = await createSticker(_0x306725, null, _0x50df29 || global.packname, _0x512085 || global.author);
        console.log("Sticker created from image");
      } else {
        if (/video/g.test(_0x4e0aed) || /gif/g.test(_0x4e0aed)) {
          console.log("Processing video/gif");
          let _0x2a9610 = await _0x1f2a37.download?.();
          if (!_0x2a9610) {
            console.error("Failed to download video/gif");
            throw new Error("Failed to download video/gif");
          }
          console.log("Downloaded video/gif successfully");
          if ((_0x1f2a37.msg || _0x1f2a37).seconds > 0x7) {
            console.log("Video/GIF longer than 7 seconds");
            return _0x5dc100.reply("*Video or GIF cannot be longer than 7 seconds*");
          }
          _0x28bc43 = await createSticker(_0x2a9610, null, _0x50df29 || global.packname, _0x512085 || global.author, true);
          console.log("Animated sticker created from video/gif");
        } else {
          if (_0x46aa1b[0x0] && /https?:\/\/\S+\.(jpg|jpeg|png|gif)/i.test(_0x46aa1b[0x0])) {
            console.log("Processing sticker from URL:", _0x46aa1b[0x0]);
            _0x28bc43 = await createSticker(null, _0x46aa1b[0x0], _0x50df29 || global.packname, _0x512085 || global.author);
            console.log("Sticker created from URL");
          } else {
            console.log("Invalid media type or no media provided");
            throw new Error("*RESPOND TO AN IMAGE, VIDEO, OR GIF WITH " + (_0x3e1b6c + _0x2d7333) + '*');
          }
        }
      }
    }
  } catch (_0xa4df9b) {
    console.error("Error in sticker creation:", _0xa4df9b);
    _0x28bc43 = "*Failed to create sticker: " + (_0xa4df9b.message || _0xa4df9b) + '*';
  } finally {
    if (_0x28bc43 instanceof Buffer) {
      console.log("Sending sticker to chat");
      await _0x464e25.sendMessage(_0x5dc100.chat, {
        'sticker': _0x28bc43
      }, {
        'quoted': _0x5dc100
      });
    } else {
      console.log("Sending error message to user");
      _0x5dc100.reply(_0x28bc43);
    }
  }
};
handler.help = ['sfull'];
handler.tags = ["sticker"];
handler.command = ["ملصق", "ملصقي"];
export default handler;
async function createSticker(_0x35c32e, _0xd94800, _0x56d1df, _0x4737ac, _0x1f532c = false) {
  try {
    console.log("Creating sticker with:", {
      'img': !!_0x35c32e,
      'url': !!_0xd94800,
      'packName': _0x56d1df,
      'authorName': _0x4737ac,
      'animated': _0x1f532c
    });
    let _0x3527b7 = {
      'type': _0x1f532c ? StickerTypes.FULL : StickerTypes.DEFAULT,
      'pack': _0x56d1df,
      'author': _0x4737ac,
      'quality': 0x64
    };
    const _0x188f57 = new Sticker(_0x35c32e || _0xd94800, _0x3527b7);
    const _0x3e1b8d = await _0x188f57.toBuffer();
    console.log("Sticker buffer created successfully, length:", _0x3e1b8d.length);
    return _0x3e1b8d;
  } catch (_0xbeaa1e) {
    console.error("Error in createSticker function:", _0xbeaa1e);
    throw _0xbeaa1e;
  }
}