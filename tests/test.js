const TOKEN = null;

const Telega = require("../build/index");
const assert = require("assert");

function equal(a, b) {
	var result;

	try {
		assert.equal(a, b);
		result = null;
	} catch(e) {
		result = e;
	}

	return result;
}

var bot;

if (!TOKEN) {
	console.log("You should create a dedicated bot and put token to TOKEN const");
	throw "No token";
} else {
	bot = new Telega(TOKEN);
	bot.start();
}

console.log("Actions that you need to preform yourself will start with >>>");

describe("Messages", function() {
	/*
		TODO: Add tests for sending messages
	*/

	it("Command receiving", function(done) {
		console.log(">>> Write to bot command /test");

		bot.cmd("/test", function(message) {
			done();

			bot.cmd("/test", undefined);
		});
	});

	it("Answers", function(done) {
		console.log(">>> Write to bot command /ans");

		bot.cmd("/ans", function(message) {
			const N = Math.random() + "";

			message.send("Now write " + N); 
			message.answer(function(message) {
				bot.cmd("/ans", undefined);

				done(equal(N, message.text));
			});
		});
	});

	it("Inline", function(done) {
		console.log(">>> Write to bot command /inline");

		bot.cmd("/inline", function(message) {
			message.inline("Click on 3:", [
				{
					text: "1",
					data: "d_1",
					row: 0
				}, 
				{
					text: "2",
					data: "d_2",
					row: 1
				},
				{
					text: "3",
					data: "d_3",
					row: 2
				}
			], function(message) {
				assert.equal("d_3", message.data);

				done();

				bot.cmd("/inline", undefined);
			});
		});
	});

	it("Matches", function(done) {
		console.log(">>> Write to bot 'hello world'");

		bot.match(/^(hello world)$/i, function(message) {
			bot._matches = [];

			done(equal("hello world", message.text));
		});
	});
});

describe("Advanced", function() {
	it("Middlewares", function(done) {
		var order = [];

		console.log(">>> Write any message to bot once");

		bot.use(function(message, next) {
			order.push(1);
			setTimeout(() => next(), 1000);
		});

		bot.use(function(message, next) {
			order.push(2);
			setTimeout(() => next(), 1000);
		});

		bot.use(function(message, next) {
			order.push(3);
			setTimeout(() => next(), 1000);

			done(equal("123", order.join("")));

			bot._uses = [];
		});
	});

	it("Action handling", function(done) {
		console.log(">>> Create a group chat with bot");

		bot.action("group_chat_created", function(message) {
			done(
				equal("group_chat_created", message.action_type),
				equal(true, !!message.action_data)
			);

			bot.action("group_chat_created", undefined);
		});
	});
});