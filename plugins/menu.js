import { promises as fsPromises, readFileSync } from "fs";
import { join } from "path";
import { xpRange } from "../lib/levelling.js";
import moment from "moment-timezone";
import os from "os";

// Define menus
const menus = {
    'adminsmenu': "✦ ───『 *المشرفين* 』─── 👾\n    👑 *.ترقية* (ترقية مستخدم)\n    ❌ *.طرد* (طرد مستخدم)\n    🗑️ *.حذف* (إزالة أو حذف)\n    🔗 *.رابط* (عرض رابط المجموعة)\n    🖊️ *.مكت* (بدء مسابقة الكتابة)\n    🏁 *.سكت* (إنهاء مسابقة الكتابة)\n    🔒 *.مخفي* (إرسال رسالة مخفية)\n    ❭↜ 〚.تخفيض〛 (تخفيض الرتبة)\n    📝 *.تسجيل* (تسجيل مستخدم جديد)\n    📜 *.الألقاب* (عرض الألقاب)\n    🗑️ *.حذف لقب* (حذف لقب مستخدم)\n    ╰──────────⳹",
    'gamemenu': "✦ ───『 *العاب* 』─── ⚝\n    🎴 *.ملصق* <اسم|صانع>\n    📊 *.توب* \n    ❌ *.اكس-او* (لعبة XO)\n    ╰──────────⳹",
    'groupmenu': "✦ ───『 *قائمة القروب* 』─── ⚝\n    🔒 *.قفل* (قفل المجموعة)\n    🔓 *.فتح* (فتح المجموعة)\n    🖼️ *.تغيير صورة* (تغيير صورة المجموعة)\n    ╰──────────⳹",
    'usermenu': "✦ ───『 *قائمة المستخدمين* 』─── 🎭\n    👤 *.لقبي* (عرض لقبك)\n    🎉 *.تحسين* (تحسين)\n    🖼️ *.لصورة* (لصورة)\n    📹 *.لفيد* (لفيديو)\n    📜 *.لقبه* (عرض لقب المستخدم)\n    ╰──────────⳹"
};

// Define bot name
const botname = "Ｎｉｎｏ－Ｂｏｔ";

// Main handler function
const handler = async (m, { conn, command, text, args, usedPrefix }) => {
    try {
        let glb = global.db.data.users;
        let tag = `@${m.sender.split("@")[0]}`;
        let name = await conn.getName(m.sender);
        let ucpn = `${ucapan()}`;

        const infoText = `
${botname} 
Hi ${name}, Senpai!

*${ucpn}* 

乂───『 *U S E R*』───乂
⛥ *Rank:* User
⛥ *Owner:* Elta/+96176337375
╰──────────⳹

╭───────⳹
│ *1.* 👾 قائمة المشرفين
│ *2.* ⚝ قائمة الألعاب
│ *3.* ⚝ قائمة القروب
│ *4.* 🎭 قائمة المستخدمين
╰───────⳹

Reply with a number to view the corresponding menu.
`;

        // React to the message
        await conn.sendMessage(m.chat, { react: { text: '🌀', key: m.key } });

        const { result, key, timeout } = await conn.sendMessage(
            m.chat,
            { text: infoText.trim() },
            { quoted: m }
        );

        conn.gurumenu = conn.gurumenu || {};
        conn.gurumenu[m.sender] = {
            result,
            key,
            timeout: setTimeout(() => {
                conn.sendMessage(m.chat, { delete: key });
                delete conn.gurumenu[m.sender];
            }, 150 * 1000),
        };
    } catch (err) {
        console.error(err);
        m.reply('An error occurred while processing your request.');
    }
};

// Before handler function to catch user responses
handler.before = async (m, { conn }) => {
    try {
        conn.gurumenu = conn.gurumenu || {};
        if (m.isBaileys || !(m.sender in conn.gurumenu)) return;
        const { result, key, timeout } = conn.gurumenu[m.sender];
        if (!m.quoted || m.quoted.id !== key.id || !m.text) return;

        const choice = m.text.trim();
        const menuOptions = {
            "1": "adminsmenu",
            "2": "gamemenu",
            "3": "groupmenu",
            "4": "usermenu"
        };

        const sendMenu = async (menuName) => {
            await conn.sendMessage(m.chat, {
                text: menus[menuName]
            }, { quoted: m });
        };

        if (menuOptions[choice]) {
            await sendMenu(menuOptions[choice]);
            await conn.sendMessage(m.chat, { react: { text: '👍', key: m.key } });
        } else {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            m.reply('❌ Invalid choice. Please reply with a valid number.');
        }
    } catch (err) {
        console.error(err);
        m.reply('An error occurred while processing your request.');
    }
};

// Register the handler
handler.help = ["menu"];
handler.tags = ["main"];
handler.command = ['menu', 'اوامر'];
handler.limit = true;

export default handler;

// Utility functions
function clockString(ms) {
    let h = isNaN(ms) ? "--" : Math.floor(ms / 3600000);
    let m = isNaN(ms) ? "--" : Math.floor(ms / 60000) % 60;
    let s = isNaN(ms) ? "--" : Math.floor(ms / 1000) % 60;
    return [h, " H ", m, " M ", s, " S "].map(v => v.toString().padStart(2, 0)).join("");
}

function ucapan() {
    const time = moment.tz("Asia/Kolkata").format("HH");
    if (time >= 4 && time < 10) return "Good Morning 🌄";
    if (time >= 10 && time < 15) return "Good Afternoon ☀️";
    if (time >= 15 && time < 18) return "Good Afternoon 🌇";
    return "Good Night 🌙";
}
