const Bot = require("../build/index.js"); 
const bot = new Bot("<token>");

bot.cmd("/start", function(message) {
	message.lines([
		"Hello!",
		"This bot is just for test. Really"
	]);
});

bot.cmd("/ans", function(message) {
	message.send("Now write something!");

	message.answer(function(message) {
		message.send("You wrote:", message.text);
	});
});

bot.start();