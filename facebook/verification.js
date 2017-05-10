'use strict';
const crypto = require('crypto');
module.exports.verifyRequestSignature = function(req, res, buf) {
  console.log("verifying request signature");
  var signature = req.headers["x-hub-signature"];

  if (!signature) {
    // For testing, let's log an error. In production, you should throw an 
    // error.
    console.error("Couldn't validate the signature.");
  } else {
    console.log("Successfully verified request signature. request==");
    var elements = signature.split('=');
    var method = elements[0];
    var signatureHash = elements[1];
    console.log("APP_SECRET==", process.env.APP_SECRET);
    var expectedHash = crypto.createHmac('sha1', process.env.APP_SECRET)
                        .update(buf)
                        .digest('hex');

    if (signatureHash != expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}
