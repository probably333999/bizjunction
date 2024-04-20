const { Telegraf, Markup } = require('telegraf');
require('./keep_alive');
const bot = new Telegraf('6707564936:AAFjK26x9OT-an3hlDQMNYTFhyKcOO0eq4c');

const targetUserId = '5306177516'; // Replace with the ID of the user you want to send messages to
let sentMessages = {}; // Object to keep track of users who have sent a message

// Start command handler
bot.start((ctx) => {
    const senderUserId = ctx.from.id;
    if (!sentMessages[senderUserId]) {
        sentMessages[senderUserId] = { language: 'Russian', messageSent: false };
        ctx.reply('Чтобы оставить заявку на работника, заполните эту вакансию↓\n\n1. Кого вы ищите?\n2. Что ему следует делать?\n3. Его зарплата?'); 
    } else {
        ctx.reply('Вы уже отправили вакансию. Пожалуйста подождите!');
    }
});

// Text message handler
bot.on('text', (ctx) => {
    const messageFromUser = ctx.message.text;
    const senderUserId = ctx.from.id;
    const senderUsername = ctx.from.username;
    const { language, messageSent } = sentMessages[senderUserId];

    if (!messageSent) {
        // Send the user's message and language preference to the target user
        bot.telegram.sendMessage(targetUserId, `Language preference from user ${senderUserId}: ${language}\nMessage: ${messageFromUser}`)
            .then(() => {
                ctx.reply(`✅ Спасибо за ваше сообщение! Мы обязательно рассмотрим его и выберем нужных вам людей.`);
                sentMessages[senderUserId].messageSent = true; // Mark message as sent
            })
            .catch((error) => {
                console.error('Извините, попробуйте еще раз через некоторое время', error);
                ctx.reply('Извините, при отправке вашего сообщения произошла ошибка. Пожалуйста, попробуйте еще раз позже.');
            });
    } else {
        ctx.reply('Вы уже отправили заявкy. Пожалуйста подождите!');
    }
});

bot.launch();
