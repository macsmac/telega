const Bot = require("../index.js"); 
const bot = new Bot("<token>");

bot.use(function(message) {
	console.log("(" + (message.from.username || message.from.id) + ") " + message.text);
});

bot.cmd("/start", function(message) {
	message.lines([
		"Hello!",
		"This bot can echo your messages!",
		"For example: /echo apple"
	]);
});

bot.cmd("/echo", function(message) {
	if (!message.search) {
		return message.send("Sorry, you didn't specified any text");
	}

	message.send(message.search);
});

bot.start();