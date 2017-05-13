const Bot = require("../build/index.js"); 
const bot = new Bot("<token>");

bot.cmd("/start", function(message) {
	message.lines([
		"This bot is for testing inline queries",
		"Command: /test"
	]);
});

bot.cmd("/test", function(message) {
	message.inline("Click:", [
		{
			text: "Cell 1",
			data: "1",
			row: 0
		},
		{
			text: "Cell 2",
			data: "2",
			row: 0
		},
		{
			text: "Cell 3",
			data: "3",
			row: 1
		}
	], function(message) {
		message.send(Object.keys(bot._inlines) + "\n" + "You clicked: ", message.data);
	});
});

bot.start();

console.err = console.log;