const Bot = require("../index.js"); 
const bot = new Bot("<token>");

bot.cmd("/start", function(message) {
	message.lines([
		"Just for test .-."
	]);
});

bot.cmd("/inline", function(message) {
	message.inline("Click:", [{
		text: "Button 1",
		data: "1",
		raw: 0
	}, {
		text: "Button 2",
		data: "2",
		raw: 1
	}], function(message) {
		message.send("Clicked:", message.data);
	});
});

bot.start();