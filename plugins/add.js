import fetch from 'node-fetch';
import pkg from '@whiskeysockets/baileys';
const { proto, jidDecode } = pkg;

let handler = async (m, { conn, text, participants }) => {
    let isAdmin = participants.find(participant => participant.id === m.sender)?.admin;
    if (!isAdmin) {
        return m.reply('فقط المشرفين يمكنهم استخدام هذا الأمر.');
    }

    let botIsAdmin = participants.find(participant => participant.id === conn.user.jid)?.admin;
    if (!botIsAdmin) {
        return m.reply('يجب أن يكون البوت مشرفًا لاستخدام هذا الأمر.');
    }

    let _participants = participants.map(user => user.id);
    let users = (await Promise.all(
        text.split(',')
            .map(v => v.trim())
            .filter(v => /^\+\d{1,3}\d{7,15}$/.test(v))
            .filter(v => !_participants.includes(v.replace('+', '') + '@s.whatsapp.net'))
            .map(async v => [
                v,
                await conn.onWhatsApp(v.replace('+', '') + '@s.whatsapp.net')
            ])
    )).filter(v => v[1][0]?.exists).map(v => v[0].replace('+', '') + '@c.us');

    if (users.length === 0) {
        return m.reply('لم يتم العثور على أي مستخدمين صالحين.');
    }

    try {
        const response = await conn.groupParticipantsUpdate(m.chat, users, 'add');
        console.log('Response from WhatsApp:', response);  // Log the raw response

        // Handle users who couldn't be added (status 403)
        for (const user of response.filter(item => item.status === '403')) {
            const jid = user.jid;
            const groupInviteCode = await conn.groupInviteCode(m.chat); // Get group invite link code
            const groupInviteLink = `https://chat.whatsapp.com/${groupInviteCode}`;

            let teks = `يمكن أن تضاف فقط من قبل جهات الاتصال الخاصة بك. يمكن الانضمام إلى المجموعة من خلال هذا الرابط: ${groupInviteLink}`;

            // Send the invite link in a private message
            await conn.sendMessage(jid, { text: teks });
        }
    } catch (error) {
        console.error('Error adding participant or generating invite link:', error);
        m.reply('حدث خطأ أثناء محاولة إضافة المستخدم أو إنشاء رابط الدعوة. حاول مرة أخرى.');
    }
}

handler.help = ['add'];
handler.tags = ['group'];
handler.command = ['ضيف'];
handler.admin = true;
handler.group = true;

export default handler;
