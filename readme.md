![](http://www.sadik92.ru/products_pictures/telega_bol.jpg)

# Telega

Telega is a library based on [telegram-bot-api](https://npmjs.com/package/telegram-bot-api/) for making Telegram bots fast and easily.

# Installation

Install using npm

```sh
npm i telega
```

# Usage

Example bot:

```javascript
const Bot = require("telega");
const bot = new Bot("<your token>");

bot.cmd("/start", function(message) {
    message.lines([
        "Hello!",
        "My test bot"
    ]);
});

bot.start();
```

For more examples see **/examples** folder

# Retrieving command

Commands can be added by **cmd** method of Bot instance.

**bot.cmd**(**string** cmd[, **regexp** regexp,] **function** handler)

> Command **should not** contain spaces. 

After receiving message and finding command **handler** will be called with message as first argument.

```javascript
bot.cmd("/start", function(message) {});
```

Message has following methods:

| Name | Description | Example |
|:----:|:-----------:|:-------:|
|send|Send text to current chat|message.send("Hello!");|
|lines|Joins array with \n and sends|message.lines(["line1", "line2"]);|
|answer|Wait for user to write someting and call handler|message.answer(function(message) {});|
|inline|Init inline keyboard|message.inline("Click:", [{/*...*/}], function(message) {});|

And following properties

| Name | Description |
|:----:|:-----------:|
|text|Message text|
|from|Who sent message|
|chat|Current chat|
|date|Message sent time (unix)|
|message_id|Message id|
|args|Message arguments|
|search|Search string (joined args)|
|method|Command name|

## Inline queries

Create inline query by using **inline** method of message. 

**message.inline**(**string** text, **array** data, **function** handler);

**data** is an array of objects. This will be our buttons. Object should has this properties:

| Name | Description |
|:----:|:-----------:|
|text|Button text|
|data|Button data (will be given in handler)|
|raw|Raw number|

Example:

```javascript
bot.cmd("/inline", function(message) {
    message.inline("Click: ", [
        {
            text: "First",
            data: "1",
            raw: 0
        },
        {
            text: "Second",
            data: "2",
            raw: 0
        }
    ], function(message) {
        message.send("You clicked: ", message.data);
    });
});
```

## Answers

If you need to wait until user will write something use **answer** method of message.

**message.answer**(**function** handler)

Handler will be called once when user whom sent message will write something. 

> Privacy status must be set to **DISABLE** so bot can receive answers in multidialogs

Example:

```javascript
bot.cmd("/ans", function(message) {
    message.send("Now write something");

    message.answer(function(message) {
        messages.send("You wrote: ", message.text);
    });
});
```

## Command with regexp

If you need to match text of command (for example, get only numbers) you can provide regexp as second argument.

```javascript
bot.cmd("/nums", /[0-9]/g, function(message) {});
```

Matched will by in **message.matched**

# Use

Add functions that will be executed before every message with **bot.use** method.

**bot.use**(**function** handler);

Example:

```javascript
bot.use(function(message) {
	console.log("(" + (message.from.username || message.from.id) + ") " + message.text);
});
```

Also you can modify message:

```javascript
bot.use(function(message) {
    message.search = "Apple";
});
```

# Other

If you don't see something that you need (for example, file upload or process edited message) you can always access instance of telegram-bot-api:

```javascript
bot.api.getMe().then(console.log);
```