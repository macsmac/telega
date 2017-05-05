const DEFAULT_OPTIONS = {
	token: null,
	updates: {
		enabled: true
	}
}

const Telegram = require("telegram-bot-api");

const overload = require("overload-js");

const Telega = function(arg) {
	var _this = this;
	var params = Object.create(DEFAULT_OPTIONS);

	if (typeof arg === "string") params.token = arg;
	else if (typeof arg === "object") params = arg;

	this.api = new Telegram(params);

	this._uses = [];
	this._answers = {};
	this._inlines = {};
	this._cmds = {};

	this.other = {
		parseMessage: function(text) {
			if (!text) return {};

			const struct = text.split(" ");
			var method = struct[0];
			const args = struct.slice(1);
			const search = args.join(" ");

			if (method.split("@").length > 1) {
				method = method.split("@")[0];
			}

			return {
				struct: struct,
				method: method,
				args: args,
				search: search
			}
		}
	}

	this.use = function(handler) {
		this._uses.push(handler);
	}

	this.cmd = overload()
		.args(String, Function).use(function(cmd, handler) {
			_this._cmd(cmd, null, handler);
		})
		.args(String, RegExp, Function).use(function(cmd, regexp, handler) {
			_this._cmd(cmd, regexp, handler);
		});

	this._cmd = function(cmd, regexp, handler) {
		this._cmds[cmd] = {
			handler: handler,
			regexp: regexp
		}
	}

	this.start = function() {
		this.api.on("message", function(message) {
			_this.message(message);
		});

		this.api.on("inline.callback.query", function(message) {
			_this.modifyMessage(message);

			const _inline = _this._inlines[message.chat.id];

			if (!_inline) return;

			_inline.handler(message);

			if (!_inline.many) {
				delete _this._inlines[message.chat.id];
			}
		});
	}

	this.modifyMessage = function(message) {
		if (message.message) {
			message.user = message.message.user;
			message.chat = message.message.chat;
		}

		const parsed = this.other.parseMessage(message.text);

		message.struct = parsed.struct || [];
		message.method = parsed.method || "";
		message.args = parsed.args || [];
		message.search = parsed.search || "";

		message.send = function() {
			_this.api.sendMessage({
				chat_id: message.chat.id,
				text: [].join.call(arguments, " ")
			});
		}

		message.lines = function(lines) {
			message.send(typeof lines === "array" ? lines.join("\n") : [].join.call(arguments, "\n"));
		}

		message._inline = function(text, data, many, handler) {
			var raws = [];

			data.forEach(function(item) {
				if (raws[item.raw]) {
					raws[item.raw].push({
						text: item.text,
						callback_data: item.data	
					});
				} else {
					raws[item.raw] = [
						{
							text: item.text,
							callback_data: item.data	
						}
					];
				}
			});

			_this._inlines[message.chat.id] = { 
				handler: handler,
				many: many
			}

			_this.api.sendMessage({
				chat_id: message.chat.id,
				text: text,
				reply_markup: JSON.stringify({ inline_keyboard: raws })
			});
		}

		message.inline = overload()
			.args(String, Array, Function).use(function(text, data, handler) {
				message._inline(text, data, null, handler);
			})
			.args(String, Array, Boolean, Function).use(function(text, data, many, handler) {
				message._inline(text, data, many, handler);
			});

		message.answer = function(handler) {
			_this._answers[message.from.id] = handler;
		}
	}

	this.message = function(message) {
		if (!message) return;

		this.modifyMessage(message);

		this._uses.forEach(function(use) {
			use(message);
		});

		const _answer = this._answers[message.from.id];

		if (_answer) {
			_answer(message);
			delete this._answers[message.from.id];

			return;
		}

		const _cmd = this._cmds[message.method.toLowerCase()];

		if (!_cmd) return;

		if (_cmd.regexp) {
			message.matched = message.search.match(_cmd.regexp);
		}

		_cmd.handler(message);
	}
}

module.exports = Telega;