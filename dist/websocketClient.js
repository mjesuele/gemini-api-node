'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ws = require('ws');

var _ws2 = _interopRequireDefault(_ws);

var _createRequestConfig = require('./createRequestConfig');

var _createRequestConfig2 = _interopRequireDefault(_createRequestConfig);

var _get = require('lodash/fp/get');

var _get2 = _interopRequireDefault(_get);

var _pipe = require('lodash/fp/pipe');

var _pipe2 = _interopRequireDefault(_pipe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const withData = listener => (0, _pipe2.default)((0, _get2.default)(`data`), dataString => JSON.parse(dataString), listener);

class GeminiAPIWebsocketClient {
  constructor({ key, secret, sandbox = false }) {
    this.openOrderSocket = onOpen => {
      if (this.hasCredentials) {
        const requestPath = `/v1/order/events`;
        this.orderUrl = `${this.baseUrl}${requestPath}`;
        this.orderSocket = new _ws2.default(this.orderUrl, (0, _createRequestConfig2.default)({
          key: this.key,
          secret: this.secret,
          payload: {
            nonce: Date.now(),
            request: requestPath
          }
        }));
        this.orderSocket.addEventListener(`open`, (...args) => {
          console.log(`Connected to order events WebSocket API.`);
          if (typeof onOpen === `function`) onOpen(...args);
        });
      }
    };

    this.openMarketSocket = (symbol, onOpen) => {
      this.marketSocket = new _ws2.default(`${this.baseUrl}/v1/marketdata/${symbol}`);
      this.marketSocket.addEventListener(`open`, (...args) => {
        console.log(`Connected to market data WebSocket API`);
        if (typeof onOpen === `function`) onOpen(...args);
      });
    };

    this.addMarketMessageListener = listener => this.marketSocket && this.marketSocket.addEventListener(`message`, withData(listener));

    this.addOrderMessageListener = listener => this.orderSocket && this.orderSocket.addEventListener(`message`, withData(listener));

    this.removeMarketMessageListener = listener => this.marketSocket && this.marketSocket.removeEventListener(`message`, withData(listener));

    this.removeOrderMessageListener = listener => this.orderSocket && this.orderSocket.removeEventListener(`message`, withData(listener));

    this.addMarketListener = (event, listener) => this.marketSocket && this.marketSocket.addEventListener(event, listener);

    this.addOrderListener = (event, listener) => this.orderSocket && this.orderSocket.addEventListener(event, listener);

    this.removeMarketListener = (event, listener) => this.marketSocket && this.marketSocket.removeEventListener(event, listener);

    this.removeOrderListener = (event, listener) => this.orderSocket && this.orderSocket.removeEventListener(event, listener);

    this.key = key;
    this.secret = secret;
    const subdomain = sandbox ? `api.sandbox` : `api`;
    this.baseUrl = `wss://${subdomain}.gemini.com`;
    this.hasCredentials = key && secret;
  }

}
exports.default = GeminiAPIWebsocketClient;