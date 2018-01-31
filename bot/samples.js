controller.on('facebook_referral', function(bot, message) {

    console.log('referred: ' + message);
    bot.reply(message, 'You were referred?');

});

// user said hello
controller.hears(['hello', 'hi'], 'message_received', function(bot, message) {

    // bot.replyWithTyping(message, 'Hello there, my friend!');
    console.log(message);

    bot.reply(message, {
        attachment: {
            'type':'template',
            'payload':{
                'template_type':'generic',
                'elements':[
                    {
                        'title':'Chocolate Cookie',
                        'image_url':'http://cookies.com/cookie.png',
                        'subtitle':'A delicious chocolate cookie',
                        'buttons':[
                            {
                            'type':'postback',
                            'title':'Eat Cookie',
                            'payload':'chocolate'
                            }
                        ]
                    },
                    {
                        'title':'Chocolate Cookie',
                        'image_url':'http://cookies.com/cookie.png',
                        'subtitle':'A delicious chocolate cookie',
                        'buttons':[{
                                type: 'postback',
                                title: 'Share',
                                payload: 'https://www.vapebox.ph'
                            },
                            {
                                type: 'postback',
                                title: 'Something Else',
                                payload: 'share'
                            }
                        ]
                    },
                ]
            }
        }
    });

});

controller.hears(['cookies'], 'message_received', function(bot, message) {

    bot.startConversation(message, function(err, convo) {

        convo.say('Did someone say cookies!?!!');
        convo.ask('What is your favorite type of cookie?', function(response, convo) {
            convo.say('Golly, I love ' + response.text + ' too!!!');
            convo.next();
        });
    });
});

controller.on('facebook_postback', function(bot, message) {

  console.log(message);

    if (message.payload == 'friday') {
        bot.reply(message, 'You ate the chocolate cookie!')
    }

});

// ******* API AI

// apiai.hears for intents. in this example is 'hello' the intent 
controller.hears('load-buy', 'message_received',apiai.hears,function(bot, message) {
  
  bbapiai.handleMessages(bot, message, 1000);
  
});
 
// apiai.action for actions. in this example is 'user.setName' the action 
controller.hears(['user.loadBuy'],'direct_message',apiai.action,function(bot, message) {
    console.log('action triggered');
});


//////---------------


block = responses and trigger
trigger has listen, direct to specific block
mapTriggersToBlocks


//should generate bot.reply
foo.addVideo
    .addImage
    .addText
        .addQR
        .addQR
        .addQR
    .addList
    .addList
    .addList
    .addCard
    .addCard
        .addImageUrl
        .addButton
    .create()


//create block executes
var Block = function() {
  this.bubbles = [];
}

Block.prototype.addText = function(str) {
  if(str.length > 0) {
    this.bubbles.push({
      type: 'text',
      content: str
    });
  }
  return this;
}

Block.prototype.addImage = function(str) {
  if(str.length > 0) {
    this.bubbles.push({
      type: 'image',
      content: str
    });
  }
  return this;
}

Block.prototype.addVideo = function(str) {
  if(str.length > 0) {
    this.bubbles.push({
      type: 'video',
      content: str
    });
  }
  return this;
}

Block.prototype.addQR = function(title, blockName, type = 'block') {
  //block- (payload)
  //location-
  
  var b = this.bubbles;
  var lastb = b[b.length-1];
  if(lastb.type == 'text') {
    if(!lastb.hasOwnProperty('quick_replies')) {
      lastb.quick_replies = [];
    }
     
    lastb.quick_replies.push({
      title: title || '',
      content_type: type == 'block' ? 'text' : type,
      block: blockName
    })
  } else {
    console.error('QR should be preceded by text')
  }
  
  // mapTriggers - filters the route in triggers array, add payload to keywords, payload is title_blockName
  return this;
}

Block.prototype.addButton = function(title, blockName, type = 'block') {
  //block- (payload)
  //url-
  //share-
  
//   if card or list, add buttons
//   else text, add buttons
  
  var b = this.bubbles;
  b[b.length-1].push({
    type: 'video',
    content: str
  });
  return this;
}

Block.prototype.addList = function(title, subtitle) {
  //push container
  this.bubbles.push({
    type: 'list',
    content: {
      title: title,
      subtitle: subtitle || ''
    }
  });
  return this;
}

Block.prototype.addCard = function(title, subtitle) {
  //push container
  this.bubbles.push({
    type: 'card',
    content: {
      title: title,
      subtitle: subtitle || ''
    }
  });
  return this;
}

Block.prototype.create = function() {
  //creates all templates with bot.reply functions
  //map triggers
  //map blocks
  return this;
}