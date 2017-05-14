const Bot = require("../build/index.js"); 
const bot = new Bot("<token>");

bot.cmd("/start", function(message) {
	message.lines([
		"Hello!",
		"This bot runs in inline mode and can make screenshots",
		"Just type: @<your bot username> <site url>"
	]);
});

bot.inline(function(message) {
	if (!message.query) return;

	message.reply([
		{
			type: "photo",
			photo_url: "http://mini.s-shot.ru/1366x768/JPEG/1366/Z100/?" + encodeURIComponent(message.query),
			thumb_url: "http://mini.s-shot.ru/640x480/JPEG/640/Z100/?" + encodeURIComponent(message.query),
			width: 1366 / 2 + "",
			height: 768 / 2 + ""
		}
	]).catch(console.log);
});

bot.start();