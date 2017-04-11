'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = ({ key, secret, payload }) => {
  const encodedPayload = new Buffer(JSON.stringify(payload)).toString(`base64`);

  const signature = _crypto2.default.createHmac(`sha384`, secret).update(encodedPayload).digest(`hex`);

  return {
    headers: {
      'X-GEMINI-APIKEY': key,
      'X-GEMINI-PAYLOAD': encodedPayload,
      'X-GEMINI-SIGNATURE': signature
    }
  };
};