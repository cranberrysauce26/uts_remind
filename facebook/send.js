'use strict';

const request = require('request');

function send(messageDataArray, callback) {
  if (messageDataArray.length == 0) {
    if (callback !== undefined) {
      callback();
    }
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
      send(messageDataArray, callback);
    } else {
      console.error("Unable to send message.");
      console.error(error);
    }
  });
}


module.exports.sendTextMessages = function (senderID, messageTextArray, callback) {
  console.log("in facecbook.send.sendTextMessages with");
  let messageDataArray = [];
  messageTextArray.forEach(function (text) {
    let messageData = {
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
  send(messageDataArray, callback);
}

/*
  message is the prompt
  quickReplies is an array of objects. Each object is like
  {
    text: "text_to_display",
    "payload": "payload_to_call"
  }
*/
module.exports.sendQuickReplies = function (senderID, message, quickReplies, callback) {
  console.log("sending quick reply");
  let messageData = {
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
  send([messageData]);
}

module.exports.sendButtons = function (senderID, message, buttons, callback) {
  console.log("sending button");
  let messageData = {
    "recipient": {
      "id": senderID
    },
    "message": {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "button",
          "text": message,
          "buttons": []
        }
      }
    }
  };

  buttons.forEach( button => {
    messageData.message.attachment.payload.buttons.push({
      "type": "postback",
      "title": button.text,
      "payload": button.payload
    });
  })
  send([messageData]);
}

            