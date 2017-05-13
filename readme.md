[![NPM version](http://img.shields.io/npm/v/telega.svg)](https://www.npmjs.org/package/telega) [![Built with Gulp](https://img.shields.io/badge/Built%20with-Gulp-orange.svg)](http://gulpjs.com)

![](http://www.sadik92.ru/products_pictures/telega_bol.jpg)

# Telega

Telega is a library based on [telegram-bot-api](https://npmjs.com/package/telegram-bot-api/) for making Telegram bots fast and easily.

# Documentation

Documentation is avaliable on [wiki](https://github.com/RedFoxCode/telega/wiki)

# Other

If you don't see something that you need (for example, file upload or process edited message) you can always access instance of telegram-bot-api:

```javascript
bot.api.getMe().then(console.log);
```

### Building

To build write:

```sh
npm run build
```

Don't care about it, if you're just installing it from npm.