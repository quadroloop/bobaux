/* eslint-disable brace-style */
/* eslint-disable camelcase */
var bbapiai = require('../helpers/botbros_apiai');
var Block = require('../helpers/block');
var request = require('request'); // make http call

module.exports = function (controller) {
  let state = controller.config.state;
  let block = new Block(state);

  // this is triggered when a user clicks the send-to-messenger plugin
  controller.on('facebook_optin', function (bot, message) {
    bot.replyWithTyping(message, 'Welcome, my friend');
  })

  controller.on('facebook_postback', function(bot, message) {
    console.log('----- payload -----');
    console.log(message.payload);
    if (message.payload == 'go_to_site') {
        block.addText('Fancy seeing you here')
            .reply(bot, message);
    }
  });

  controller.hears(['lala'], 'message_received', function( bot, message) {

        // lists should have at least 2 items
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

        // block.addCard('hi', 'this is the description')
        //         .addImage('https://placehold.it/300')
        //         .addButton('Title', 'Blockname')
        //         .addButton('Title 2', 'Blockname')
        //     .addCard('hi', 'this is the description')
        //         .addImage('https://placehold.it/300')
        //         .addButton('Title', 'Blockname')
        //         .addButton('Title 2', 'Blockname')
        //     .reply(bot,message);

        // block.addText('hi')
        //         .addButton('Title', 'Blockname')
        //         .addButton('Title 2', 'Blockname')
        //     .reply(bot, message);

        // block.addText('How old are you?')
        //         .addQR('0-10', 'ten')
        //         .addQR('11-20', 'twenty')
        //     .reply(bot, message);
  })


  getUserName = function(response, convo) {
  var usersPublicProfile = 'https://graph.facebook.com/v2.6/' + response.user + '?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=' + process.env.page_token;
  request({
      url: usersPublicProfile,
      json: true // parse
  }, function (error, response, body) {
          if (!error && response.statusCode === 200) {
              convo.replyWithTyping('Hi ' + body.first_name);
          }
      });
  };


  controller.hears(['yo'], 'message_received', function(bot, message) {

        bot.startConversation(message, function(err, convo) {

            convo.ask('What is your favorite type of cookie?', function(response, convo) {

                var msg = block.addImage('https://placehold.it/300')
                    .create();

                convo.say(msg);
                convo.next();

                msg = block.addText('How old are you?')
                    .addQR('Child', 'child')
                    .addQR('Teenager', 'teenager')
                    .addQR('Adult', 'adult')
                    .create();

                convo.ask(msg, function(response, convo) {
                  console.log(response.text);
                  convo.stop();
                });
            });
      });
  });

  // test 'hi'
  // controller.hears(['hi'], 'message_recieved',function(response,bot,message) {
  // var usersPublicProfile = 'https://graph.facebook.com/v2.6/' + response.user + '?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=' + process.env.page_token;
  // request({
  //     url: usersPublicProfile,
  //     json: true // parse
  // }, function (error, response, body) {
  //         // if (!error && response.statusCode === 100) {
  //         //     bot.replyWithTyping(message, 'Hi ' + body.first_name);
  //         // }else{
  //         //     bot.replyWithTyping(message,'Hey you failed');
  //         // }
  //           bot.replyWithTyping(message, 'Hi ' + body.first_name);
  //     });
  // });


  // user said hello
  controller.hears(['hello'], 'message_received', function (bot, message) {
    bot.reply(message, 'Hi, Bryce, How are you today?');
    // ------------- text: addText
    // bot.reply(message, 'Hey there.')

    // ------------- image: addImage
    // bot.reply(message, {
    //   "attachment":{
    //     "type":"image",
    //     "payload":{
    //       "url":"http://placehold.it/300x200"
    //     }
    //   }
    // })

    // GIPHY - api.giphy.com/v1/gifs/search, https://developers.giphy.com/docs/#search-endpoint
    // bot.reply(message, {
    //   "attachment":{
    //     "type":"image",
    //     "payload":{
    //       "url":"http://placehold.it/300x200"
    //     }
    //   }
    // })

    // ------------- video: addVideo
    // bot.reply(message, {
    //   "attachment":{
    //     "type":"video",
    //     "payload":{
    //       "url":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"
    //     }
    //   }
    // })

    // ------------- qr: addQR
    // bot.reply(message, {
    //   "text": "Here's a quick reply!", // <<required
    //   "quick_replies":[
    //     {
    //       "content_type":"text",
    //       "title":"Yes",
    //       "payload":"red",
    //       "image_url":"https://www.staples-3p.com/s7/is/image/Staples/m000746375_sc7?$std$"
    //     },
    //     {
    //       "content_type":"location"
    //     },
    //     {
    //       "content_type":"text",
    //       "title":"No",
    //       "payload":"blank"
    //     }
    //   ]
    // })

    // ------------- text with buttons: addTextWithButtons
    // bot.reply(message, {
    //   "attachment":{
    //     "type":"template",
    //     "payload":{
    //       "template_type":"button",
    //       "text":"Here are some buttons!",
    //       "buttons":[
    //         {
    //           "type":"web_url",
    //           "url":"https://www.messenger.com",
    //           "title":"Visit Messenger",
    //           "webview_height_ratio": "compact"
    //         },
    //         {
    //           "type":"postback",
    //           "title":"Bookmark Item",
    //           "payload":"DEVELOPER_DEFINED_PAYLOAD"
    //         },
    //         // {
    //         //   "type":"phone_number",
    //         //   "title":"Call Representative",
    //         //   "payload":"+15105551234"
    //         // },
    //         // {
    //         //   "type":"element_share",
    //         //   "title": "Share"
    //         // }
    //       ]
    //     }
    //   }
    // })

    // ------------- list: addList
    // bot.reply(message, {
    //   "attachment": {
    //     "type": "template",
    //     "payload": {
    //       "template_type": "list",
    //       // "top_element_style": "compact",
    //       "elements": [
    //         {
    //           "title": "Classic T-Shirt Collection",
    //           "subtitle": "See all our colors",
    //           "image_url": "https://placehold.it/300x200",
    //           "buttons": [
    //             {
    //               "title": "View",
    //               "type": "web_url",
    //               "url": "http://www.botbros.ai",
    //               "webview_height_ratio": "tall",
    //             }
    //           ]
    //         },
    //         {
    //           "title": "Classic White T-Shirt",
    //           "subtitle": "See all our colors",
    //           "default_action": {
    //             "type": "web_url",
    //             "url": "https://peterssendreceiveapp.ngrok.io/view?item=100",
    //             "webview_height_ratio": "tall",
    //           }
    //         },
    //         {
    //           "title": "Classic Blue T-Shirt",
    //           "image_url": "https://placehold.it/100x100",
    //           "subtitle": "100% Cotton, 200% Comfortable",
    //           "default_action": {
    //             "type": "web_url",
    //             "url": "https://peterssendreceiveapp.ngrok.io/view?item=101",
    //             "webview_height_ratio": "tall",
    //           },
    //           "buttons": [
    //             {
    //               "title": "Shop Now",
    //               "type": "web_url",
    //               "url": "https://peterssendreceiveapp.ngrok.io/shop?item=101",
    //               "webview_height_ratio": "tall"
    //             }
    //           ]
    //         }
    //       ],
    //        "buttons": [
    //         {
    //           "title": "View More",
    //           "type": "postback",
    //           "payload": "payload"
    //         }
    //       ]
    //     } //end of payload
    //   } //end of attachment
    // })

    // ------------- cards: addCard
    // bot.reply(message, {
    //     attachment: {
    //         'type':'template',
    //         'payload':{
    //             'template_type':'generic',
    //             'elements':[
    //                 {
    //                     'title':'Chocolate Cookie',
    //                     'image_url':'http://cookies.com/cookie.png',
    //                     'subtitle':'A delicious chocolate cookie',
    //                     'buttons':[
    //                         {
    //                         'type':'postback',
    //                         'title':'Eat Cookie',
    //                         'payload':'chocolate'
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     'title':'Chocolate Cookie',
    //                     'image_url':'http://cookies.com/cookie.png',
    //                     'subtitle':'A delicious chocolate cookie',
    //                     'buttons':[{
    //                             type: 'postback',
    //                             title: 'Share',
    //                             payload: 'https://www.vapebox.ph'
    //                         },
    //                         {
    //                             type: 'postback',
    //                             title: 'Something Else',
    //                             payload: 'share'
    //                         }
    //                     ]
    //                 },
    //             ]
    //         }
    //     }
    // });

  })

  // user says anything else
  // controller.hears('(.*)', 'message_received', function (bot, message) {
  //   bot.reply(message, 'you said ' + message.match[1])
  // })

  //
  // controller.on('message_received', function(bot, message) {
  //   bbapiai.handleMessages(bot, message, 1000);
  // });
}
