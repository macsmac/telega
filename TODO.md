# TODO

### Modifying default behaviour

It means we can force inline queries to save and get from database. Something like:

```javascript
bot.modify("inline.get", function(query, next) {
    Inline.findOne({
        query: query
    }).exec(function(err, inline) {
        next(eval(inline.handler));
    });
});

bot.modify("inline.set", function(query, handler, next) {
    const inline = new Inline({
        query: query,
        handler: handler.toString()
    });
    inline.save(next);
});
```

Same with: answers.get, answers.set, actions.get, actions.set

### Inline mode

Saw that inline bots on Telegram? I mean, when you mention bot you got something like interface.

```
@gifs test
```

I want to implement this. Example of code:

```javascript
bot.inline(function(message) {
    message.reply(/* Telegram inline answers format */);
});
```

### Mocha tests

Nothing to add here, just tests