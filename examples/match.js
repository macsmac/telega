const Bot = require("../build/index.js"); 
const bot = new Bot("<token>");

bot.cmd("/start", function(message) {
	message.lines([
		"Test .-."
	]);
});

bot.match(/^(hello|hi)/i, function(message) {
	message.send("Hello!");
});

bot.match(/^(bye|good\s?bye)/i, function(message) {
	message.send("Bye!");
});

bot.start();

console.err = console.log;