    const handler = async (m) => {
        const message = m.text; // Keep the message as it is

        // List of characters with their corresponding symbols
        const characters = {
            "ا": "ايس",
            "ب": "بي",
            "ت": "تو",
            "ث": "ثيو",
            "ج": "جين",
            "د": "ديو",
            "ر": "راي",
            "ز": "زينو",
            "س": "ساي",
            "غ": "غيو",
            "ف": "فاي",
            "ق": "قاي",
            "ك": "كين",
            "ل": "لو",
            "م": "ميو",
            "ن": "ني",
            "ه": "هيو",
            "و": "ويس",
            "ي": "يو",
            "=": "اول"
        };

        // List of names to detect and respond to
         const names = [
            "راينر", "اثي", "لوكاس", "زاك", "كيلوا", "الوكا", "ماها", "زينو", "سيلفا",
            "رينغوكو", "تينغن", "ميتسوري", "تنغن", "هولمز", "فريزا", "فريزر", "غيومي",
            "غيو", "كينق", "عبدول", "علي بابا", "عبدالله", "اللحية البيضاء", "ترانكس",
            "تشوبر", "فرانكي", "دوفلامينغو", "كروكودايل", "ايانوكوجي", "موراساكيبارا",
            "فيلو", "فو", "هان", "ثورز", "ثورفين", "ساي", "ساسكي", "سابيتو", "ساسوري",
            "كوراما", "كابوتو", "ناروتو", "لي", "غاي", "شيغاراكي", "اول فور ون", "اول مايت",
            "تشيساكي", "كيسامي", "كيساكي", "ايتاتشي", "ايتاشي", "موتين روشي", "بيل", "نير",
            "لوغ", "لوفي", "زورو", "نامي", "ماكي", "ماي", "شوكو", "شيزوكو", "ويس", "بو", "بان",
            "بولا", "غوكو", "غوتين", "غوهان", "مورو", "سيل", "فيجيتا", "بيروس", "ديو", "جوتارو",
            "كيرا", "لايت", "غاتس", "غارب", "هيماواري", "بوروتو", "غاجيل", "جيغن", "ليو", "هيكي",
            "هاتشيمان", "ثوركيل", "اشيلاد", "صوفيا", "ميدوريما", "ميدوريا", "ديكو", "داكي", "دابي",
            "ليفاي", "ايرين", "ارمين", "ايروين", "ميكاسا", "هانجي", "غابي", "غابيمارو", "هيتش",
            "ريتش", "ايلتا", "توكا", "كانيكي", "ليوريو", "كورابيكا", "نيترو", "ميرويم", "ماتشي",
            "جيلال", "ميستوغان", "غون", "هيسوكا", "شالنارك", "بولنارف", "كاكيوين", "فيتان", "كينشيرو",
            "نوبوناغا", "ريم", "رايلي", "زينيتسو", "ويليام", "ويندي", "هوري", "هيوري", "هوريكيتا",
            "اوروتشيمارو", "جيرايا", "شادو", "تسونادي", "هاشيراما", "شويو", "توبيراما", "هيروزين",
            "ميناتو", "هيناتا", "لولوش", "نانالي", "سوزاكو", "ميامورا", "روبين", "جيمبي", "ايتشيغو",
            "اوريهيمي", "روكيا", "ماش", "لانس", "ريوك", "ال", "ميسا", "نير", "لايت", "كونان", "ران",
            "توغوموري", "غريمجو", "رينجي"
        ];


        // Regular expression to find characters after "حرف" and names within parentheses
        const characterRegex = /حرف\s*([ا-ي=])/g;
        const nameRegex = /\(([^)]+)\)/g;

        // Find all matches for characters after "حرف"
        const characterMatches = [...message.matchAll(characterRegex)];
        const characterCounts = {};
        for (const match of characterMatches) {
            const char = match[1];
            if (characters[char]) {
                characterCounts[char] = (characterCounts[char] || 0) + 1;
            }
        }

        // Find all matches for names within parentheses
        const nameMatches = [...message.matchAll(nameRegex)];
        const foundNames = [];
        for (const match of nameMatches) {
            const name = match[1];
            if (names.includes(name)) {
                foundNames.push(name);
            }
        }

        // If any character or name is found, calculate the delay and send the response
        if (Object.keys(characterCounts).length > 0 || foundNames.length > 0) {
            // Calculate delay time for characters (set to zero for instant response)
            const characterDelayTime = 0;

            // Calculate a random delay time for names within a shorter range (0.5 to 2 seconds)
            const minDelay = 0; // 0.5 seconds in milliseconds
            const maxDelay = 0; // 2 seconds in milliseconds
            const nameDelayTime = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

            // Combine delays if both types of matches are found
            const delayTime = Math.max(characterDelayTime, nameDelayTime);

            // Prepare the response
            let response = "";

            // Immediate response for characters
            if (Object.keys(characterCounts).length > 0) {
                const characterNames = Object.entries(characterCounts).map(([char, count]) => characters[char]).join(" ");
                response += characterNames + " ";
            }

            // Delayed response for names
            if (foundNames.length > 0) {
                setTimeout(() => {
                    // Send the response for names without mentioning the original message
                    m.reply(foundNames.join(" "));
                }, nameDelayTime);
            }

            // Send the immediate response for characters if any
            if (response.trim().length > 0) {
                m.reply(response.trim());
            }
        }
    };

    handler.command = /^(.*?)$/i;

    export default handler;
