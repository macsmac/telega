const Bot = require("../build/index.js"); 
const bot = new Bot("<token>");

bot.cmd("/start", function(message) {
	message.lines([
		"This bot will welcome new members in chats"
	]);
});

bot.action("new_chat_member", function(message) {
	message.send("@" + (message.action_data.username || message.action_data.id) + ", Welcome!");
});

bot.start();

console.err = console.log;