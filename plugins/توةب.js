import util from 'util';
import path from 'path';
let user = a => '@' + a.split('@')[0];

// Helper function to get a random element from an array
function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function handler(m, { groupMetadata, command, conn, text, usedPrefix }) {
    if (!text) throw `لاستخدام هذا الامر اكتب مثل هذا الشيئ:\n.توب *اساطير*`;

    let ps = groupMetadata.participants.map(v => v.id);

    // Pick 10 random participants from the group
    let a = getRandom(ps);
    let b = getRandom(ps);
    let c = getRandom(ps);
    let d = getRandom(ps);
    let e = getRandom(ps);
    let f = getRandom(ps);
    let g = getRandom(ps);
    let h = getRandom(ps);
    let i = getRandom(ps);
    let j = getRandom(ps);

    // Random emoji and random sound
    let x = pickRandom(['🤓', '😅', '😂', '😳', '😎', '🥵', '😱', '🤑', '🙄', '💩', '🍑', '🤨', '🥴', '🔥', '👇🏻', '😔', '👀', '🌚']);
    let k = Math.floor(Math.random() * 70);
    let vn = `https://hansxd.nasihosting.com/sound/sound${k}.mp3`;

    let top = `*${x} توب 10 ${text} ${x}*\n\n` +
        `*1. ${user(a)}*\n` +
        `*2. ${user(b)}*\n` +
        `*3. ${user(c)}*\n` +
        `*4. ${user(d)}*\n` +
        `*5. ${user(e)}*\n` +
        `*6. ${user(f)}*\n` +
        `*7. ${user(g)}*\n` +
        `*8. ${user(h)}*\n` +
        `*9. ${user(i)}*\n` +
        `*10. ${user(j)}*`;

    // Reply with top 10 list and mention the users
    m.reply(top, null, { mentions: [a, b, c, d, e, f, g, h, i, j] });

    // Send random audio
    conn.sendMessage(m.chat, { audio: { url: vn }, mimetype: 'audio/mpeg', ptt: true });
}

handler.help = ['توب'];
handler.command = ['توب'];
handler.tags = ['fun'];
handler.group = true;
handler.limit = 2;

export default handler;

// Helper function to pick random element from an array
function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}
