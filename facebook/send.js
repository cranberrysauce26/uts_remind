'use strict';

const request = require('request');

function send(messageDataArray) {
  if (messageDataArray.length == 0) {
    return;
  }

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageDataArray[0]
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      messageDataArray.shift();
      send(messageDataArray);
    } else {
      console.error("Unable to send message.");
      console.error(error);
    }
  });
}


module.exports.sendTextMessages = function (senderID, messageTextArray) {
  console.log("in facecbook.send.sendTextMessages with");
  var messageDataArray = [];
  messageTextArray.forEach(function (text) {
    var messageData = {
      recipient: {
        id: senderID
      },
      message: {
        text: text
      }
    };
   
    messageDataArray.push(messageData);
  });

  console.log(JSON.stringify(messageDataArray));
  send(messageDataArray);
}

/*
  message is the prompt
  quickReplies is an array of objects. Each object is like
  {
    text: "text_to_display",
    "payload": "payload_to_call"
  }
*/
module.exports.sendQuickReplies = function (senderID, message, quickReplies) {
  console.log("sending quick reply");
  var messageData = {
    "recipient": {
      "id": senderID
    },
    "message": {
      "text": message,
      "quick_replies": []
    },
  };
  quickReplies.forEach(function (quickReply) {
    messageData.message.quick_replies.push({
      "content_type": "text",
      "title": quickReply.text,
      "payload": quickReply.payload
    });
  })
  console.log(messageData);
  send(messageData);
}

