// Title: BotBros' API.ai extension
// Features:
// - catches Api.ai's text, cards, quick replies, images and custom payloads
// - clicking on a quick reply is as good as typing the text
// - auto converts text in square brackets syntax to qr. sample: [Globe|Smart|Sun]

// Installation:
// var apiai = require('botkit-middleware-apiai')({
//     token: config.apiai_token,
//     skip_bot: false // or false. If true, the middleware don't send the bot reply/says to api.ai 
// });
// controller.middleware.receive.use(apiai.receive);

// controller.on('message_received', function(bot, message) {
//   bbapiai.handleMessages(bot, message, 1000);
// });

module.exports = {
	bases: {
	    qr: function(text) {
	      return {
	        "content_type": "text",
	        "title": text,
	        "payload": text.split(' ').join('_').toUpperCase()
	      };
	    },
	    card: function(msg) {
	      return [{
	        "title": msg.title,
	        "subtitle": msg.subtitle,
	        "image_url": msg.imageUrl,
	        "buttons": msg.buttons.map(this.buttons)
	      }];
	    },
	    buttons: function(btn) {
	      return {
	        "type": "postback",
	        "title": btn.text,
	        "payload": btn.postback
	      }
	    }
	},
	handleMessage: function(bot, m, r) {
	  bot.replyWithTyping(m, r);
	},
	handleMessages: function(bot, message, timeoutInterval) {
		var timeout;
		var messages = message.fulfillment.messages;

		for (var i = 0; i < messages.length; i++) {
		    var responseText = {};

		    switch(messages[i].type) {
		      case 0: //text only
				responseText = this.checkForQR(messages[i].speech) || { "text": messages[i].speech };;
		        break;
		      case 1: //cards ****
		        responseText = {
		          "attachment":{
		            "type":"template",
		            "payload":{
		              "template_type":"generic",
		              "elements": this.bases.card(messages[i])
		            }
		          }
		        }
		        break;
		      case 2: //quick replies
		        responseText = {
		          "text": messages[i].title,
		          "quick_replies": messages[i].replies.map(this.bases.qr)
		        };
		        break;
		      case 3: //images
		        responseText = {
		          "attachment":{
		            "type":"image",
		            "payload":{
		              "url": messages[i].imageUrl
		            }
		          }
		        }
		        break;
		      case 4: //custom payload ****
		        responseText = messages[i].payload.facebook;
		        break;
		      default:
		        console.log("uncaught: " + messages[i]);
		        break;
		    } //end of switch

		    timeout = i * timeoutInterval;
		    setTimeout(this.handleMessage.bind(null, bot, message, responseText), timeout);

		} //end of forloop
	},
	checkForQR: function(text) {
		// checks for [Globe|Smart|Sun] in text and converts to quick reply
		var inbrackets = text.match(/\[(.*?)\]/g);
		if(inbrackets != null) {
			var latestres = inbrackets[inbrackets.length-1];
			var question = text.replace(latestres, '');
			var qr_options = latestres.substring(1, latestres.length-1).trim().split("|");

			return {
	          "text": question,
	          "quick_replies": qr_options.map(this.bases.qr)
	        };
		}
		return false;
	}
}