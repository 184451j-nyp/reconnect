require('dotenv').config();
const TelegramBot = require("node-telegram-bot-api");
const invoicesORM = require("../models/Invoice");
const token = process.env.TG_TOKEN;
const bot = new TelegramBot(token, {
    polling: true
});

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Hello world!");
});

bot.onText(/\/getreceipt/, (msg) => {
    if (msg.chat.id != process.env.TG_CAT_ID) {
        bot.sendMessage(msg.chat.id, "Hey this ain't for you! This will be reported!");
        console.log(`${msg.chat.username} tried to access sensitive data!`);
    } else {
        bot.sendMessage(msg.chat.id, "Please reply with receipt number. Do not include 'RCR' prefix.", {
            reply_markup: JSON.stringify({
                force_reply: true
            })
        }).then(sentMsg => {
            bot.onReplyToMessage(sentMsg.chat.id, sentMsg.message_id, reply => {
                let receiptNo = parseInt(reply.text);
                (async () => {
                    const invoice = await invoicesORM.findByPk(receiptNo);
                    if (invoice == null) {
                        bot.sendMessage(msg.chat.id, "No invoice found!");
                    } else {
                        let senderString = `Who sent it? \n\nName: ${invoice.sender_name} \nEmail: ${invoice.sender_email} \nAddress: ${invoice.sender_address} \nPostal Code: ${invoice.sender_postal_code} \nContact No.: ${invoice.sender_contact_no}`;
                        let receiverString = `Who is it for? \n\nName: ${invoice.receiver_name} \nAddress: ${invoice.receiver_address} \nPostal Code: ${invoice.receiver_postal_code} \nContact No.: ${invoice.receiver_contact_no}`;
                        let invoiceString = `Here are more details about this order! \n\nCreated at: ${invoice.createdAt}\nPostage option: ${invoice.postage}\nMessage: ${invoice.card_msg}`;
                        [senderString, receiverString, invoiceString].forEach(str => {
                            bot.sendMessage(msg.chat.id, str);
                            setTimeout(()=>{}, 50);
                        });
                    }
                })();
            });
        });
    }
});

bot.onText(/\/easteregg/, (msg) =>{
    bot.sendSticker(msg.chat.id, "CAACAgUAAxkBAANEXpCItwGo1mS_CIdcGsNtdQpE0bsAAkUAAxYOiQhNoUyc63rWNxgE");
});

bot.on("polling_error", (err) => {
    console.log(err);
});

module.exports = bot;