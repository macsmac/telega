const Bot = require("../build/index.js"); 
const bot = new Bot("<token>");

bot.cmd("/start", function(message) {
	message.lines([
		"Hello!",
		"This matches only numbers in your message",
		"Example: /numbers test 123"
	]);
});

bot.cmd("/numbers", /[0-9]/g, function(message) {
	if (!message.matched) {
		return message.send("I didn't match anything");
	}

	message.send(message.matched.join(""));
});

bot.start();