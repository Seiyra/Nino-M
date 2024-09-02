import { canLevelUp, xpRange } from '../lib/levelling.js';
import { levelup } from '../lib/levelup.js'; // Assuming levelup function exists

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let handler = async (m, { conn }) => {
    try {
        // Initialize user data if not present
        if (!global.db.data.users[m.sender]) {
            global.db.data.users[m.sender] = { messages: 0, level: 0, exp: 0, role: '' }; // Add other fields if needed
        }
        let user = global.db.data.users[m.sender];

        // Increment message count
        user.messages += 1;

        // Check if the user can level up
        if (!canLevelUp(user.level, user.exp, global.multiplier)) {
            let { min, xp, max } = xpRange(user.level, global.multiplier);
            let levelText = `
┓━━━━【 *الـتصـنـيف* 】━━━━┏
┇ *🚒 الفل :* *${user.level}*
┇ *♟️ مصنف :* ${user.role}
┇ *📊 عدد الرسائل :* *${user.messages}*
┇ *♨️ نقاط الخبرة :* *${user.exp - min}/${xp}*
┛━━━⊰ بـــــــوت ⊱━━━┗

*تحتاج ${max - user.exp} من نقاط الخبرة للوصول إلى مستوى جديد*`.trim();

            let pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => './src/moyt.jpg');
            conn.sendFile(m.chat, pp, 'levelup.jpg', levelText, m);
        }

        // Handle leveling up
        let beforeLevel = user.level;
        while (canLevelUp(user.level, user.exp, global.multiplier)) {
            user.level++;
        }

        if (beforeLevel !== user.level) {
            let levelUpText = `
┓━━━━【 *الـتصـنـيف* 】━━━━┏
┇♨️ *المستوي السابق :* *${beforeLevel}*
┇🎉 *المستوي الحالي :* *${user.level}*
┇♟️ *التصنيف :* ${user.role}
┇📊 *عدد الرسائل :* *${user.messages}*
┛━━━⊰ بـــــوت ⊱━━━┗`.trim();

            try {
                // Create and send level-up image (assuming `levelup` function exists)
                const img = await levelup(await conn.getName(m.sender), user.level); // Ensure levelup function returns a buffer
                if (img && img instanceof Buffer) {
                    conn.sendFile(m.chat, img, 'levelup.jpg', levelUpText, m);
                } else {
                    m.reply(levelUpText);
                }
            } catch (e) {
                console.error('Error generating level-up image:', e);
                m.reply(levelUpText);
            }
        }

        await delay(5 * 5000); // Delay to avoid flooding

    } catch (error) {
        console.error('Error in levelup handler:', error);
        m.reply('حدث خطأ أثناء معالجة طلبك.');
    }
}

handler.help = ['levelup'];
handler.tags = ['xp'];
handler.command = ['nivel', 'lvl', 'رانك', 'لفل','بروفايل'];

export default handler;
