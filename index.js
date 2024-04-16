const { Telegraf, Markup } = require('telegraf');
require('./keep_alive');
const bot = new Telegraf('6707564936:AAFjK26x9OT-an3hlDQMNYTFhyKcOO0eq4c');

const targetUserId = '5306177516'; // Replace with the ID of the user you want to send messages to

let sentMessages = {}; // Object to keep track of users who have sent a message

// Start command handler
bot.start((ctx) => {
    ctx.reply("Здравствуйте! для продолжения выберите удобный для вас язык", Markup.inlineKeyboard([
        Markup.button.callback('Русский 🇷🇺', 'language_russian'),
        Markup.button.callback(`O'zbek 🇺🇿`, 'language_uzbek')
    ]));
});

// Language selection callback handler
bot.action('language_russian', (ctx) => {
    const senderUserId = ctx.from.id;
    sentMessages[senderUserId] = { language: 'Russian', messageSent: false };
    ctx.reply('Вы выбрали русский язык.\nТеперь, пожалуйста, отправьте немного о работе, например:\n\n1. Кого вы ищите?\n2. Что ему следует делать?\n3. Его зарплата?'); 
});

bot.action('language_uzbek', (ctx) => {
    const senderUserId = ctx.from.id;
    sentMessages[senderUserId] = { language: 'Uzbek', messageSent: false };
    ctx.reply(`Siz o'zbek tilini tanladingiz.\nEndi, iltimos, ish haqida bir oz yuboring, masalan:\n\n 1. Ishchi lavozimi?\n2. Sizning talablaringiz?\n3. Uning maoshi?`);
});

// Text message handler
bot.on('text', (ctx) => {
    const messageFromUser = ctx.message.text;
    const senderUserId = ctx.from.id;

    if (!sentMessages[senderUserId]) {
        ctx.reply('Здравствуйте! для продолжения выберите удобный для вас язык');
        return;
    }

    const { language } = sentMessages[senderUserId];

    // Send the user's message and language preference to the target user
    bot.telegram.sendMessage(targetUserId, `Language preference from user ${senderUserId}: ${language}\nMessage: ${messageFromUser}`)
        .then(() => {
            ctx.reply(`✅ Спасибо за ваше сообщение! Мы обязательно рассмотрим его и свяжемся с вами, если это необходимо.`);
        })
        .catch((error) => {
            console.error('Извините, при отправке вашего сообщения произошла ошибка:', error);
            ctx.reply('Извините, при отправке вашего сообщения произошла ошибка. Пожалуйста, попробуйте еще раз позже.');
        });
});

bot.launch();
