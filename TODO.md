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

### Add options to answers, replies and inlines

Add argument `options` to answers, replies and inlines. It's object that contains following properties:

* **once** - Receive reply only once and then do not accept replies from any user of chat
* **multi** - Receive reply from users that don't replied to message (chat only)
* **bindToChat** - Bind replies to current chat (useless if private message). Default **true**

Already finished:

* inline mode
* tests