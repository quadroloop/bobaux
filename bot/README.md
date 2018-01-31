# BotBros Framework User Manual

## I. About The Framework
* Built on top of BotKit
* Easier generation of templates according to the chosen channel
* Set up the conversation structure once and easily switch channels

### Channels
* Facebook
* _Add more here!_

### How It Works
First let's define the terms. In Botkit's default `conversations.js` file, we should be able to do this:
```javascript
block.addText('How old are you?')
          .addQR('0-10', 'ten')
          .addQR('11-20', 'twenty')
      .reply(bot, message);
```

that is equivalent to this:
```javascript
bot.reply(message, {
    "text": "How old are you?",
    "quick_replies":[
      {
        "content_type":"text",
        "title":"0-10",
        "payload":"ten"
      },
      {
        "content_type":"text",
        "title":"11-20",
        "payload":"twenty"
      }
    ]
  })
```

Let's call the first shorthand `Bubble Notation`.

The `Block` object (which is instantiated from the `helpers` folder) converts the Bubble Notation to a generic format and then converts it to the chosen channel's format. In this case, the default is Facebook.

### How To Use
On top of BotKit's `conversations.js` file, add:
`var Block = require('../helpers/block');`

Inside the main function, instantiate Block into a new variable. You'll use this new variable in writing your Bubble Notations.

`let block = new Block();`

## II. Bubble Notation Formatting
If you check the `Block` object, there are functions connected to it such as setting and getting the channel, creation of bubbles and the reply and create functions.

### List of bubble functions:
|                |Standalone                          |Preceded by                         |
|----------------|-------------------------------|-----------------------------|
|`addText(string)`|Yes            |            |
|`addImage(url)`|Yes            |Cards or Lists            |
|`addVideo(url)`          | Yes | |
|`addQR(title, payload, type = 'block')`          | No | Text |
|`addButtons(title, payload, type = 'block')`| No | Text, Cards or Lists |
|`addList(title, subtitle)`         | Yes | Another List |
|`addAction(url, height = 'tall')`         | No | List |
|`addListButton(title, payload)`         | No | List |
|`addCard(title, subtitle)`         | Yes | Another Card |

### Reply vs Create
All Bubble Notations should end with a `reply()` or `create()` function to execute the bubbles.

* Reply = executes the template with BotKit's `bot.replyWithTyping`
* Create = returns the template (to be used in conversations)

## III. How to Use the Facebook Channel
If you send the wrong template to Facebook, Facebook won't send your message. So make sure that you follow Facebook's standard guidelines when creating your Bubble Notations.

### Types of Bubbles
1. Text
	* Can be called with just a string
	* Can contain QR or Buttons
2. Video
3. Image
4. Card
	* Represents a single card
	* Can contain an Image and up to 3 buttons
	* Stackable to create a gallery

**Sample Gallery**
```javascript
block.addCard('hi', 'this is the description')
        .addImage('https://placehold.it/300')
        .addButton('Title', 'Blockname')
        .addButton('Title 2', 'Blockname')
    .addCard('hi', 'this is the description')
        .addImage('https://placehold.it/300')
        .addButton('Title', 'Blockname')
        .addButton('Title 2', 'Blockname')
    .reply(bot,message);
```

5. List
	* You need to have at last 2 `addList` for it to work
	* Represents a single list item
	* Can contain 1 image, 1 action (link on click), 1 button per list item
	* Can be followed by 1 List Button, which is the button for the whole list


**Sample List**
```javascript
block.addList('Classic T-Shirt Collection', 'See colors')
        .addImage('https://placehold.it/300')
    .addList('Red Collection', 'Something red')
        .addImage('https://placehold.it/300')
        .addAction('http://botbros.ai')
        .addButton('Click Me', 'go_to_site')
    .addList('Blue Collection', 'Something blue')
        .addImage('https://placehold.it/300')
        .addAction('http://botbros.ai')
    .addListButton('View More', 'more_buttons')
    .reply(bot,message);
```

# Botkit demo for Messenger, using Express, PostgreSQL, and ReactJS

This app is a demo of using [Botkit](https://github.com/howdyai/botkit) to create a Facebook Messenger bot, using the PostGreSQL [adapter](https://github.com/lixhq/botkit-storage-postgres) for storage and [Express](http://expressjs.com) to serve webpages.

## Features

* Serves webpages through standard express routes, with EJS as templating engine
``` app/routes/routes.js ```

* Added ApiAi message handler for text, cards, quick replies, images and custom payloads

* Added Babel + ReactJS + Redux + Webpack for serving webviews for Facebook Messenger

* Uses [We-UI](https://weui.github.io/react-weui/docs/) for a more webview-friendly UI

* Stores users ID when a new user clicks on "Send to Messenger"

* Offers a welcome message when user clicks on "Send to Messenger", replies to Hello, and generally just repeats what you just said

## Configuration

* For local deployment

There are quite a number of steps to set up a Facebook bot

1) Create a Facebook page. Add Page ID in .env file (rename the .env-demo file)

2) Create a Facebook app. Add App ID in .env file

3) Add Messenger to your App, then select the Page, to generate a Page Access token. Add Token in .env file

4) install localtunnel to your computer, then use this command to make it available for webhooks
```
lt --subdomain yourappname --port 5000
```

5) Add Webhooks to your app

5.1) Choose a verify token, add it to the .env file as well

5.2) Set the app webhook url to https://yourappname.localtunnel.me/webhook

5.3) Restart your server and click verify

* For Heroku deployment

Add Page ID, App ID, and token as environement variables.
Change the webhook route to match your deployed domain name.

## Contributions & style
Contributions are more than welcome!
In terms of style, I use [standard style](https://github.com/feross/standard) with camelcase and brace-style disabled.

## Author

* [Matthieu Varagnat](https://twitter.com/MVaragnat)

* Modified by [Rachelle Uy](https://twitter.com/rachelletanuy)

## License
Shared under [MIT license](http://choosealicense.com/licenses/mit/)
