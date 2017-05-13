const Bot = require("../build/index.js"); 
const bot = new Bot("<token>");

bot.use(function(message, next) {
	console.log("First middleware called");

	console.log("(" + (message.from.username || message.from.id) + ") " + message.text);

	next();
});

bot.use(function(message, next) {
	console.log("Second middleware called");

	setTimeout(function() {
		console.log("Next");
		next();
	}, 5000);
});

bot.use(function(message, next) {
	console.log("Third middleware called");

	setTimeout(function() {
		console.log("Next");
		next();
	}, 2000);
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