import { webp2png } from '../lib/webp2mp4.js';

let handler = async (m, { conn, usedPrefix, command }) => {
    const notStickerMessage = `*رد على الملصق الذي تريد تحويله لصورة باستخدام ${usedPrefix + command}*`;

    // Check if there is a quoted message
    if (!m.quoted) {
        return conn.reply(m.chat, notStickerMessage, m);
    }

    const q = m.quoted || m;

    // Check the MIME type to ensure it's a sticker
    let mime = q.mediaType || '';
    if (!/sticker/.test(mime)) {
        return conn.reply(m.chat, notStickerMessage, m);
    }

    // Try to download the media
    let media;
    try {
        media = await q.download();
        console.log("Downloaded media buffer length:", media.length);
    } catch (error) {
        console.error("Failed to download media:", error);
        return conn.reply(m.chat, 'فشل في تنزيل الملصق', m);
    }

    // Try to convert the media to PNG
    let out;
    try {
        out = await webp2png(media);
        console.log("Converted image buffer length:", out.length);
    } catch (error) {
        console.error("Failed to convert WEBP to PNG:", error);
        out = Buffer.alloc(0);
    }

    // Check if the conversion was successful
    if (out.length === 0) {
        return conn.reply(m.chat, 'فشل في تحويل الملصق إلى صورة', m);
    }

    // Send the converted image
    try {
        await conn.sendFile(m.chat, out, 'converted.png', null, m);
    } catch (error) {
        console.error("Failed to send the file:", error);
        return conn.reply(m.chat, 'فشل في إرسال الصورة', m);
    }
};

handler.help = ['toimg (reply)'];
handler.tags = ['sticker'];
handler.command = ['لصوره', 'صورة', 'لصورة'];

export default handler;
