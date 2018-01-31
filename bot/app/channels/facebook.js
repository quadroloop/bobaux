module.exports = {
	bases: {
	    image: function(type,url) {
	      return {
		      "attachment":{
		        type,
		        "payload":{url}
		      }
		    }
	    },
	    qr: function({content_type,title,payload,image_url}) {
	    	return {
	          content_type,
	          title,
	          payload,
	          image_url
	        }
	    },
	    text: function(bubble) {
	    	return {
		      "text": bubble.content.title,
		      "quick_replies": bubble.quick_replies.map(this.qr)
		    };
	    },
	    button: function({title, payload}) {
    		return {
		        "type": "postback",
		        title,
		        payload
		    };
    	},
	    cardSingle: function(card) {

	    	// map buttons if it exists
		    if(!!card.buttons) {
		    	Object.assign(card, { 
		    		buttons: card.buttons.map(({title, payload}) => {
			    		return {
					        "type": "postback",
					        title, payload
					    };
			    	  })
		    		}
		    	);
		    }

		    return card;
	    },
	    card: function(cards) {
	    	return {
	          "attachment":{
	            "type":"template",
	            "payload":{
	              "template_type":"generic",
	              "elements": cards.map(this.cardSingle)
	            }
	          }
	        };
	    },
	    listSingle: function(list) {
	    	let { title, subtitle, action, image_url, buttons } = list;

	    	let newlist = {
	    		title,
	    		subtitle,
	    		image_url
	    	}
	    	
	    	if(!!action) {
		    	Object.assign(newlist, {
		    		default_action: {
		    			type: 'web_url',
		    			url: action.url,
		    			webview_height_ratio: action.height
		    		}
		    	});
		    }

		    if(!!buttons) {
		    	Object.assign(newlist, {
		    		buttons: [{
		    			type: 'postback',
		    			title: buttons[0].title,
		    			payload: buttons[0].payload
		    		}]
		    	});
		    }

	    	return newlist;
	    },
	    list: function({content, buttons}) {
	    	let newlist = {
	          "attachment":{
	            "type":"template",
	            "payload":{
	              "template_type":"list",
	              "elements": content.map(this.listSingle)
	            }
	          }
	        };

	    	if(!!buttons) {
	    		newlist.attachment.payload.buttons = buttons.map(this.button);
	    	}

	    	return newlist;
	    }
	},
	handleTextWithButtons: function(content) {
		return {
	      "attachment":{
	        "type":"template",
	        "payload":{
	          "template_type":"button",
	          "text":content.title,
	          "buttons":content.buttons.map(this.bases.button)
	        }
	      }
	    }
	}
}