const DEFAULT_OPTIONS = {
	token: null,
	updates: {
		enabled: true
	}
}

const Telegram = require("telegram-bot-api");

const async = require("async");
const overload = require("overload-js");

const Telega = function(arg) {
	var _this = this;
	var params = Object.create(DEFAULT_OPTIONS);

	if (typeof arg === "string") params.token = arg;
	else if (typeof arg === "object") params = arg;

	this.ACTIONS = ["new_chat_member", "left_chat_member", "new_chat_title", "new_chat_photo", "group_chat_created", "supergroup_chat_created", "channel_chat_created", "migrate_to_chat_id", "migrate_from_chat_id", "pinned_message"];

	this.api = new Telegram(params);

	this._uses = [];
	this._actions = [];
	this._matches = [];
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
			const parts = method.split("@");
			var target;

			if (parts.length > 1) {
				method = parts[0];
				target = parts[1];
			}

			return {
				struct: struct,
				method: method,
				args: args,
				search: search,
				parts: parts,
				target: target
			}
		}
	}

	this.use = function(handler) {
		this._uses.push(handler);
	}

	this.action = function(type, handler) {
		if (this.ACTIONS.indexOf(type) === -1) return false;

		this._actions.push({
			type: type,
			handler: handler
		});
	}

	this.match = function(regexp, handler) {
		this._matches.push({
			regexp: regexp,
			handler: handler
		});
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

		this.api.getMe().then(function(bot) {
			_this.username = bot.username;
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
		message.target = parsed.target || _this.username;

		message.send = function() {
			return _this.api.sendMessage({
				chat_id: message.chat.id,
				text: [].join.call(arguments, " ")
			});
		}

		message.lines = function(lines) {
			return message.send(typeof lines === "array" ? lines.join("\n") : [].join.call(arguments, "\n"));
		}

		message._inline = function(text, data, many, handler) {
			var rows = [];

			data.forEach(function(item) {
				if (rows[item.row]) {
					rows[item.row].push({
						text: item.text,
						callback_data: item.data	
					});
				} else {
					rows[item.row] = [
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

			return _this.api.sendMessage({
				chat_id: message.chat.id,
				text: text,
				reply_markup: JSON.stringify({ inline_keyboard: rows })
			});
		}

		message.inline = overload()
			.args(String, Array, Function).use(function(text, data, handler) {
				return message._inline(text, data, null, handler);
			})
			.args(String, Array, Boolean, Function).use(function(text, data, many, handler) {
				return message._inline(text, data, many, handler);
			});

		message.answer = function(handler) {
			_this._answers[message.from.id] = handler;
		}
	}

	this.message = function(message) {
		if (!message) return;

		this.modifyMessage(message);

		async.eachSeries(this._uses, function(use, callback) {
			use(message, function(error) {
				callback(error || null);
			});
		}, function(error) {
			if (error) {
				throw error;
			}

			handler();
		});

		function handler() {
			const _action = _this._actions.find(function(action) {
				return Object.keys(message).indexOf(action.type) !== -1;
			});

			if (_action) {
				message.action_type = _action.type;
				message.action_data = message[_action.type];

				return _action.handler(message);
			}

			const _answer = _this._answers[message.from.id];

			if (_answer) {
				_answer(message);
				delete _this._answers[message.from.id];

				return;
			}

			const _cmd = _this._cmds[message.method.toLowerCase()];

			if (!_cmd) {
				const _match = _this._matches.find(function(match) {
					return message.text && message.text.match(match.regexp);
				});

				if (!_match) return;

				_match.handler(message);
			} else {
				if (message.target !== _this.username) {
					return;
				}

				if (_cmd.regexp) {
					message.matched = message.search.match(_cmd.regexp);
				}

				_cmd.handler(message);
			}
		}
	}
}

module.exports = Telega;