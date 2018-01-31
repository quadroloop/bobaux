var channels = require('../channels');

var formatBubbles = function(c, bubbles) {
  let formatted = [];

  bubbles.forEach(bubble => {
    let { type, content, quick_replies } = bubble;

    switch(type) {
      case 'video':
      case 'image':
        formatted.push(c.bases.image(type, content));
        break;
      case 'text':
        // check if qr is present
        if(!!quick_replies) {
          formatted.push(c.bases.text(bubble));
        // check if buttons are present
        } else if (!!content.hasOwnProperty('buttons')) {
          formatted.push(c.handleTextWithButtons(content));
        } else {
          formatted.push(content.title);
        }
        break;
      case 'card':
        formatted.push(c.bases.card(content));
        break;
      case 'list':
        formatted.push(c.bases.list(bubble));
        break;
      default:
        console.log('push text default');
        formatted.push(content);
        break;
    }
  });

  return formatted;
}

const Block = function(ch = 'facebook') {
  this.bubbles = [];
  this.channel = channels[ch];
}

Block.prototype.setChannel = function(channelName) {
  this.channel = channels[channelName];
}

Block.prototype.getChannel = function() {
  return this.channel;
}

Block.prototype.addText = function(str) {
  if(str.length > 0) {
    this.bubbles.push({
      type: 'text',
      content: {
        title: str
      }
    });
  }
  return this;
}

Block.prototype.addImage = function(str) {

  var b = this.bubbles;
  var lastb = b[b.length-1];

  if(b.length > 0 && (lastb.type == 'card' || lastb.type == 'list')) {
    // push image inside card
    lastb.content[lastb.content.length-1].image_url = str;
  } else {
    // push simple image
    if(str.length > 0) {
      this.bubbles.push({
        type: 'image',
        content: str
      });
    }
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

Block.prototype.addQR = function(title, payload, type = 'block') {
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
      payload: payload || ''
    })
  } else {
    console.error('QR should be preceded by text');
  }
  
  // mapTriggers - filters the route in triggers array, add payload to keywords, payload is title_blockName
  return this;
}

Block.prototype.addButton = function(title, payload, type = 'block') {
  //block- (payload)
  //url-
  //share-

  var b = this.bubbles;
  var lastb = b[b.length-1];

  //----- card or list
  if(b.length > 0 && (lastb.type == 'card' || lastb.type == 'list')) {
    var lastcard = lastb.content[lastb.content.length-1];

    // if buttons exist
    if(!lastcard.hasOwnProperty('buttons')) {
      lastcard.buttons = [];
    }

    lastcard.buttons.push({ title, payload });

  //----- text
  } else if (b.length > 0 && lastb.type == 'text') {

    if(!lastb.content.hasOwnProperty('buttons')) {
      lastb.content.buttons = [];
    }

    lastb.content.buttons.push({ title, payload });

  //----- button only
  } else {
    console.error('Buttons should be preceded by text, card or list');
  }
  
  return this;
}

Block.prototype.addList = function(title, subtitle) {
  var b = this.bubbles;
  var lastb = b[b.length-1];

  if(b.length > 0 && lastb.type == 'list') {
    lastb.content.push({ title, subtitle});
  } else {
  
    //push container
    this.bubbles.push({
      type: 'list',
      content: [{ title, subtitle }]
    });
  
  }
  
  return this;
}

Block.prototype.addAction = function(url, height = 'tall') {
  var b = this.bubbles;
  var lastb = b[b.length-1];

  //----- card or list
  if(b.length > 0 && lastb.type == 'list') {
    
    var lastlist = lastb.content[lastb.content.length-1];
    lastlist['action'] = { url, height };

  } else {
    console.error('Actions should be preceded by lists.');
  }

  return this;
}

Block.prototype.addListButton = function(title, payload) {
  var b = this.bubbles;
  var lastb = b[b.length-1];

  //----- card or list
  if(b.length > 0 && lastb.type == 'list') {
    
    lastb['buttons'] = [ {title, payload} ];

  } else {
    console.error('List Buttons should be contained in a list.');
  }

  return this;
}

Block.prototype.addCard = function(title, subtitle) {
  var b = this.bubbles;
  var lastb = b[b.length-1];
  if(b.length > 0 && lastb.type == 'card') {
    lastb.content.push({ title, subtitle});
  } else {
    //push container
    this.bubbles.push({
      type: 'card',
      content: [{ title, subtitle }]
    });
  }
  return this;
}

Block.prototype.reply = function(b,m) {
  // creates all templates for the bot.reply functions
  // should be uniform across channels
  let formatted = formatBubbles(this.channel, this.bubbles);

  // execute bot replies
  formatted.forEach((bubble, i) => {
    b.replyWithTyping(m, bubble);
  });

  // reset bubbles for reuse
  this.bubbles = [];

  return;
}

Block.prototype.create = function() {
  // creates all templates for the bot.reply functions
  // should be uniform across channels
  let formatted = formatBubbles(this.channel, this.bubbles);

  // reset bubbles for reuse
  this.bubbles = [];

  // conversations can only process one
  return formatted[0];
}

module.exports = Block;