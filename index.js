const functions = require("firebase-functions");
const { Telegraf } = require("telegraf");

const TELE_BOT_TOKEN = "5472493264:AAF_pU3wKv_qNs44ft-Fp36VU--xZBxGdHc"; // lấy token trong bot father

const bot = new Telegraf(TELE_BOT_TOKEN, {
  polling: true,
});

async function getBalanceAndSendToTele() {
  // lấy id của user gửi tin nhắn đến bot khi user nhắn hi
  bot.hears("hi", (ctx) => {
    ctx.reply(`ID của bạn: ${ctx.message.from.id}`);
  });

  const balance = Math.floor(Math.random() * 100); // lấy số ngẫu nhiên từ 0 - 100

  // gửi tin nhắn đến user cố định
  const id_Chung_chuột = "5176186293";
  bot.telegram.sendMessage(id_Chung_chuột, `Số dư của bạn là: ${balance}`);
}

// mở comment code bên dưới nếu muốn chạy ở local
(async () => {
  if (bot.polling?.started) {
    await bot.stop();
  }
  bot.launch();
  setInterval(async () => {
    check++;
    await getBalanceAndSendToTele();
  }, 10 * 1000);
})();

exports.scheduledSendBalanceToTele = functions.pubsub
  .schedule("every 1 minutes") // chạy 1 phút 1 lần
  .onRun(async (context) => {
    // nếu bot đang khởi động thì off đi bật lại
    if (bot.polling?.started) {
      await bot.stop();
    }
    bot.launch();
    let check = 0;
    const timer = setInterval(async () => {
      check++;
      await getBalanceAndSendToTele();
      if (check == 6) {
        clearInterval(timer);
        await bot.stop();
      }
    }, 10 * 1000);
    return;
  });
