let handler = m => m;

handler.all = async function(m) {
  // Access the chat object in the global database
  let chat = global.db.data.chats[m.chat];

  // Define the responses
  let responses;
  if (/^اول$/i.test(m.text)) {
    responses = [
      '*حرف ا*', '*حرف ب*', '*حرف ت*', '*حرف ث*', '*حرف ج*', '*حرف ح*', '*حرف خ*', '*حرف د*', '*حرف ذ*', '*حرف ر*', '*حرف ز*', '*حرف س*', '*حرف ش*', '*حرف ص*', '*حرف ع*', '*حرف غ*', '*حرف ف*', '*حرف ق*', '*حرف ك*', '*حرف ل*', '*حرف م*', '*حرف ن*', '*حرف ه*', '*حرف و*', '*حرف ي*'
    ];
  }

  // Send a random response if the condition is met
  if (responses) {
    let randomIndex = Math.floor(Math.random() * responses.length);
    let randomResponse = responses[randomIndex];
    await conn.reply(m.chat, randomResponse, m);
  }

  return !0;
};

export default handler;
