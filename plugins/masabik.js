import { canLevelUp, xpRange } from '../lib/levelling.js';

let handler = m => m;

let currentCount = 1; 
let gameState = {
    active: false,
    currentName: '',
    responses: {} // { jid: points }
};


    const names = [
        'لوفي', 'ناروتو', 'سابو', 'ايس', 'رايلي', 'جيرايا', 'ايتاتشي', 'ساسكي', 'شيسوي', 'يوهان',
        'غوهان', 'آيزن', 'فايوليت', 'نامي', 'هانكوك', 'روبين', 'كاكاشي', 'ريومو', 'ريمورو',
        'غوكو', 'غوغو', 'كيلوا', 'غون', 'كورابيكا', 'يوسكي', 'ايشيدا', 'ايتيشغو', 'ميناتو', 'رينجي',
        'جيمبي', 'انوس', 'سايتاما', 'نيزيكو', 'اوراهارا', 'تانجيرو', 'نويل', 'استا', 'يونو', 'لايت',
        'راينر', 'اثي', 'لوكاس', 'زاك', 'الوكا', 'ماها', 'زينو', 'سيلفا', 'رينغوكو', 'تينغن', 'ميتسوري',
        'تنغن', 'هولمز', 'فريزا', 'فريزر', 'غيومي', 'غيو', 'كينق', 'عبدول', 'علي بابا', 'عبدالله', 'اللحية البيضاء',
        'ترانكس', 'تشوبر', 'فرانكي', 'دوفلامينغو', 'كروكودايل', 'ايانوكوجي', 'موراساكيبارا', 'فيلو', 'فو',
        'هان', 'ثورز', 'ثورفين', 'ساي', 'ساسكي', 'سابيتو', 'ساسوري', 'كوراما', 'كابوتو', 'ناروتو', 'لي',
        'غاي', 'شيغاراكي', 'اول فور ون', 'اول مايت', 'تشيساكي', 'كيسامي', 'كيساكي', 'موتين روشي', 'بيل', 'نير',
        'لوغ', 'زورو', 'ماكي', 'ماي', 'شوكو', 'شيزوكو', 'ويس', 'بو', 'بان', 'بولا', 'غوتين', 'مورو', 'سيل',
        'فيجيتا', 'بيروس', 'ديو', 'جوتارو', 'كيرا', 'غاتس', 'غارب', 'هيماواري', 'بوروتو', 'غاجيل', 'جيغن', 'ليو',
        'هيكي', 'هاتشيمان', 'ثوركيل', 'اشيلاد', 'صوفيا', 'ميدوريما', 'ميدوريا', 'ديكو', 'داكي', 'دابي', 'ليفاي',
        'ايرين', 'ارمين', 'ايروين', 'ميكاسا', 'هانجي', 'غابي', 'غابيمارو', 'هيتش', 'ريتش', 'ايلتا', 'توكا', 'كانيكي',
        'ليوريو', 'نيترو', 'ميرويم', 'ماتشي', 'جيلال', 'ميستوغان', 'هيسوكا', 'شالنارك', 'بولنارف', 'كاكيوين', 'فيتان',
        'كينشيرو', 'نوبوناغا', 'ريم', 'رين', 'رايلي', 'زينيتسو', 'ويليام', 'ويندي', 'هوري', 'هيوري', 'هوريكيتا',
        'اوروتشيمارو', 'شادو', 'تسونادي', 'هاشيراما', 'شويو', 'توبيراما', 'هيروزين', 'لولوش', 'نانالي', 'سوزاكو',
        'ميامورا', 'جيمبي', 'اوريهيمي', 'روكيا', 'ماش', 'لانس', 'رينجي', 'استا', 'ايس', 'ايما', 'راي', 'نير', 'ري',
        'كي', 'كيو', 'كو', 'رين', 'ريم', 'شين', 'غوكو', 'هيناتا', 'هاشيراما', 'توبيراما', 'ناروتو', 'بوروتو', 'شيكامارو',
        'شانكس', 'يوريتشي', 'غابيمارو', 'تشوبر', 'زينيتسو', 'ويليام', 'ويس', 'ويل', 'نيل', 'ساتورو', 'غيتو', 'علي',
        'سانغورو', 'نيزوكو', 'ايلومي', 'ميغومي', 'مي مي', 'ماكي', 'ماي', 'ناخت', 'ليخت', 'لاك', 'يامي', 'يوري', 'يور',
        'يو', 'ساسكي', 'ساسوري', 'كانيكي', 'ساساكي', 'البرت', 'ساكورا', 'لاو', 'كيو', 'شوت', 'ابي', 'روز', 'لوف', 'كاتاكوري',
        'رم', 'ابي ابو ايس', 'شوكو', 'ماي ماكي شوكو', 'كونان', 'كايتو', 'توغوموري', 'شينرا', 'بينيمارو', 'هيسوكا', 'فيتان',
        'ماتشي', 'كرولو', 'ساي', 'سابو', 'ثورز', 'ثورفين', 'ثوركيل', 'ثورغيل', 'كنوت', 'ثور', 'ثيو', 'مورا', 'ساكي', 'بارا',
        'يوليوس', 'لوسيوس', 'لامي', 'ميامورا', 'هوري', 'كوروكو', 'كاغامي', 'شيسوي', 'غين', 'ترانكس', 'ايزن', 'دابي', 'دازاي',
        'ايانوكوجي', 'ايتادوري', 'جين', 'يوجي', 'دراغون', 'دازاي', 'ديكو', 'جينوس', 'جيرو', 'جود', 'كود', 'كيد', 'يوميكو'
];

async function isAdmin(m, conn) {
    if (!m.isGroup) return false;
    try {
        let groupMetadata = await conn.groupMetadata(m.chat);
        let participants = groupMetadata.participants;
        let admins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
        return admins.some(admin => admin.id === m.sender);
    } catch (error) {
        console.error('Error fetching group metadata:', error);
        return false;
    }
}

handler.all = async function(m, { conn }) {
    if (/^\.مكت$/i.test(m.text)) {
        if (gameState.active) {
            return m.reply('اللعبة قيد التشغيل بالفعل.');
        }

        gameState.active = true;
        gameState.responses = {}; // Reset responses
        let randomIndex = Math.floor(Math.random() * names.length);
        gameState.currentName = names[randomIndex];
        await m.reply(`*${gameState.currentName}*`);
    } else if (/^\.سكت$/i.test(m.text)) {
        if (!gameState.active) {
            return m.reply('لا توجد لعبة قيد التشغيل حالياً.');
        }

        gameState.active = false;

        if (Object.keys(gameState.responses).length === 0) {
            await m.reply('لم يربح أحد نقاطاً في هذه اللعبة.');
        } else {
            let result = Object.entries(gameState.responses).map(([jid, points]) => {
                return `@${jid.split('@')[0]}: ${points} نقطة`;
            }).join('\n');

            await m.reply(`اللعبة انتهت!\n\nالنقاط:\n${result}`, null, {
                mentions: Object.keys(gameState.responses)
            });
        }

        gameState.currentName = ''; // Clear the current name
    } else if (gameState.active && gameState.currentName && new RegExp(`^${gameState.currentName}$`, 'i').test(m.text)) {
        if (!gameState.responses[m.sender]) {
            gameState.responses[m.sender] = 1;
        } else {
            gameState.responses[m.sender] += 1;
        }

        let randomIndex = Math.floor(Math.random() * names.length);
        gameState.currentName = names[randomIndex];
        await m.reply(`*${gameState.currentName}*`); // Only give the next name
    }
};

export default handler;