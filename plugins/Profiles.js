import _0x3cdd22 from 'mongoose';
_0x3cdd22.connect("mongodb+srv://itachi3mk:mypassis1199@cluster0.zzyxjo3.mongodb.net/?retryWrites=true&w=majority", {
  'useNewUrlParser': true,
  'useUnifiedTopology': true
}).then(() => console.log("Connected to MongoDB"))["catch"](_0x205601 => console.error("Error connecting to MongoDB:", _0x205601));
const medoBk9Schema = new _0x3cdd22.Schema({
  'groupId': String,
  'userId': String,
  'bk9': String
});
const medoBK9 = _0x3cdd22.model("BK9", medoBk9Schema);
async function handleTitlesCommand(_0xb26ad7) {
  if (!_0xb26ad7.isGroup) {
    _0xb26ad7.reply("هذا الأمر يعمل فقط في المجموعات");
    return;
  }
  const _0x5e4545 = await _0xb26ad7.conn.groupMetadata(_0xb26ad7.chat);
  const _0x2d9043 = _0x5e4545.participants.filter(_0x2adecf => _0x2adecf.admin !== null).map(_0x54281f => _0x54281f.id);
  if (!_0x2d9043.includes(_0xb26ad7.sender)) {
    _0xb26ad7.reply("هذا الأمر يعمل فقط مع المشرفين");
    return;
  }
  const _0x2afad5 = await medoBK9.find({
    'groupId': _0xb26ad7.chat
  });
  if (_0x2afad5.length === 0x0) {
    _0xb26ad7.reply("لا يوجد ألقاب مسجلة حاليا ┇");
  } else {
    const _0x18e212 = _0x2afad5.reduce((_0x4898e9, _0x1460bf) => {
      _0x4898e9[_0x1460bf.bk9] = (_0x4898e9[_0x1460bf.bk9] || 0x0) + 0x1;
      return _0x4898e9;
    }, {});
    let _0x23f771 = '';
    Object.entries(_0x18e212).forEach(([_0x2c8ef0, _0x414b1a], _0xb41e56) => {
      _0x23f771 += _0xb41e56 + 0x1 + " ┇ اللقب: " + _0x2c8ef0 + " ┇ عدد الأشخاص: " + _0x414b1a + "\n";
    });
    _0xb26ad7.reply("┇ عدد الألقاب المسجلة: " + Object.keys(_0x18e212).length + "\n\n ┇الألقاب المسجلة:\n\n" + _0x23f771);
  }
}
async function handleRegisterCommand(_0x226a95) {
  if (!_0x226a95.isGroup) {
    _0x226a95.reply("هذا الأمر يعمل فقط في المجموعات");
    return;
  }
  const _0x279fcc = await _0x226a95.conn.groupMetadata(_0x226a95.chat);
  const _0xdb67cd = _0x279fcc.participants.filter(_0x26dfa5 => _0x26dfa5.admin !== null).map(_0x7fa58b => _0x7fa58b.id);
  if (!_0xdb67cd.includes(_0x226a95.sender)) {
    _0x226a95.reply("هذا الأمر يعمل فقط مع المشرفين");
    return;
  }
  if (!_0x226a95.quoted && (!_0x226a95.mentionedJid || _0x226a95.mentionedJid.length === 0x0)) {
    _0x226a95.reply("منشن احد او رد على رسالته واكتب اللقب الذي تريد تسجيله");
    return;
  }
  let _0x3763ca;
  if (_0x226a95.quoted) {
    _0x3763ca = _0x226a95.quoted.sender.replace('@s.whatsapp.net', '');
  } else {
    _0x3763ca = _0x226a95.mentionedJid[0x0].replace('@s.whatsapp.net', '');
  }
  const _0x3c014f = _0x226a95.text.trim().split(" ").filter(_0xea8ff => _0xea8ff.trim() !== '');
  const _0x26c816 = _0x3c014f.slice(0x1).join(" ");
  if (!/\S/.test(_0x26c816)) {
    _0x226a95.reply("مثال:\n .تسجيل @العضو ايلتا");
    return;
  }
  const _0x2db4cb = await medoBK9.findOne({
    'bk9': _0x26c816,
    'groupId': _0x226a95.chat
  });
  if (_0x2db4cb) {
    const _0x3c757d = await _0x226a95.conn.getName(_0x2db4cb.userId + "@s.whatsapp.net");
    _0x226a95.reply("اللقب " + _0x26c816 + " مأخوذ من طرف @" + _0x3c757d);
  } else {
    await medoBK9.findOneAndUpdate({
      'userId': _0x3763ca,
      'groupId': _0x226a95.chat
    }, {
      'bk9': _0x26c816
    }, {
      'upsert': true
    });
    _0x226a95.reply("┇ تم تسجيله بلقب " + _0x26c816 + " بنجاح");
  }
}
async function handleDeleteTitleCommand(_0x27e6aa) {
  if (!_0x27e6aa.isGroup) {
    _0x27e6aa.reply("هذا الأمر يعمل فقط في المجموعات");
    return;
  }
  const _0x2f7818 = await _0x27e6aa.conn.groupMetadata(_0x27e6aa.chat);
  const _0x3108a2 = _0x2f7818.participants.filter(_0x16701c => _0x16701c.admin !== null).map(_0x1fae8f => _0x1fae8f.id);
  if (!_0x3108a2.includes(_0x27e6aa.sender)) {
    _0x27e6aa.reply("هذا الأمر يعمل فقط مع الإداريين");
    return;
  }
  const _0x4705ff = _0x27e6aa.text.trim().split(" ").filter(_0x70bd2f => _0x70bd2f.trim() !== '');
  const _0x1cc42f = _0x4705ff.slice(0x1).join(" ");
  if (!/\S/.test(_0x1cc42f)) {
    _0x27e6aa.reply("اكتب اللقب الذي تريد حذفه");
    return;
  }
  const _0x20573a = await medoBK9.deleteOne({
    'bk9': _0x1cc42f,
    'groupId': _0x27e6aa.chat
  });
  if (_0x20573a.deletedCount > 0x0) {
    _0x27e6aa.reply("┇ تم حذف اللقب " + _0x1cc42f + " بنجاح");
  } else {
    _0x27e6aa.reply("اللقب " + _0x1cc42f + " غير مسجل لاحد اساسا");
  }
}
async function handleMyTitleCommand(_0x12aa35) {
  const _0x5cd610 = _0x12aa35.sender.replace("@s.whatsapp.net", '');
  console.log("Sender ID:", _0x5cd610);
  console.log("Chat ID:", _0x12aa35.chat);
  const _0x1946d6 = await medoBK9.findOne({
    'userId': _0x5cd610,
    'groupId': _0x12aa35.chat
  });
  console.log("User Title:", _0x1946d6);
  if (_0x1946d6 && _0x1946d6.bk9) {
    _0x12aa35.reply("┇ لقبك هو : " + _0x1946d6.bk9);
  } else {
    _0x12aa35.reply("┇ لم يتم تسجيلك بعد");
  }
}
async function handleGetTitleCommand(_0x2f1445) {
  let _0x293386;
  if (_0x2f1445.quoted) {
    _0x293386 = _0x2f1445.quoted.sender.replace("@s.whatsapp.net", '');
  } else {
    if (_0x2f1445.mentionedJid && _0x2f1445.mentionedJid.length > 0x0) {
      _0x293386 = _0x2f1445.mentionedJid[0x0].replace("@s.whatsapp.net", '');
    } else {
      _0x2f1445.reply("منشن احد او رد على رسالته لمعرفة لقبه");
      return;
    }
  }
  const _0x4e98ac = await medoBK9.findOne({
    'userId': _0x293386,
    'groupId': _0x2f1445.chat
  });
  if (_0x4e98ac) {
    const _0x9abf9a = await _0x2f1445.conn.getName(_0x293386 + '@s.whatsapp.net');
    _0x2f1445.reply("┇ لقب " + _0x9abf9a + " هو : " + _0x4e98ac.bk9);
  } else {
    _0x2f1445.reply("┇ لم يتم تسجيله بعد");
  }
}
async function handleCheckTitleCommand(_0x4c97a3) {
  const _0x1664f2 = _0x4c97a3.text.trim().split(" ").filter(_0x542a21 => _0x542a21.trim() !== '');
  if (_0x1664f2.length < 0x2) {
    _0x4c97a3.reply("اكتب لقب للتحقق منه");
    return;
  }
  const _0x5e73b8 = _0x1664f2.slice(0x1).join(" ").trim();
  const _0x5b38fd = await medoBK9.findOne({
    'bk9': _0x5e73b8,
    'groupId': _0x4c97a3.chat
  });
  if (_0x5b38fd) {
    const _0x49c9d7 = await _0x4c97a3.conn.getName(_0x5b38fd.userId + "@s.whatsapp.net");
    _0x4c97a3.reply("اللقب " + _0x5e73b8 + " مأخوذ من طرف @" + _0x49c9d7);
  } else {
    _0x4c97a3.reply("اللقب " + _0x5e73b8 + " متوفر");
  }
}
let medoHandler = async function (_0x20ed5d, {
  conn: _0x11aa11,
  text: _0x35075e,
  command: _0xbd2b1d
}) {
  try {
    const _0x5629c6 = await _0x11aa11.groupMetadata(_0x20ed5d.chat);
    const _0x23cf35 = _0x5629c6.participants.filter(_0x1491db => _0x1491db.admin !== null).map(_0x2c1adc => _0x2c1adc.id);
    const _0x4b7c62 = _0x23cf35.includes(_0x20ed5d.sender);
    _0x20ed5d.isAdmin = _0x4b7c62;
    switch (_0xbd2b1d) {
      case "الألقاب":
        await handleTitlesCommand(_0x20ed5d);
        break;
      case "تسجيل":
        await handleRegisterCommand(_0x20ed5d);
        break;
      case "حذف_لقب":
        await handleDeleteTitleCommand(_0x20ed5d);
        break;
      case "لقبي":
        await handleMyTitleCommand(_0x20ed5d);
        break;
      case "لقبه":
        await handleGetTitleCommand(_0x20ed5d);
        break;
      case "لقب":
        await handleCheckTitleCommand(_0x20ed5d);
        break;
      default:
        _0x20ed5d.reply("أمر غير معروف");
    }
  } catch (_0x76bf1a) {
    console.error("Error handling command:", _0x76bf1a);
    _0x20ed5d.reply("حدث خطأ اثناء معالجة الأمر");
  }
};
medoHandler.command = ["الألقاب", "تسجيل", "لقبي", "لقبه", 'حذف_لقب', "لقب"];
medoHandler.tags = ["BK9"];
export default medoHandler;