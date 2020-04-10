require('dotenv').config();
const TelegramBot = require("node-telegram-bot-api");
const invoicesORM = require("../models/Invoice");
const token = process.env.TG_TOKEN;
const bot = new TelegramBot(token, {
    polling: true
});

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(chatId, "Hello world!");
});

module.exports = bot;