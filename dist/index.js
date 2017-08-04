'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _websocketClient = require('./websocketClient');

var _websocketClient2 = _interopRequireDefault(_websocketClient);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _createRequestConfig = require('./createRequestConfig');

var _createRequestConfig2 = _interopRequireDefault(_createRequestConfig);

var _get = require('lodash/fp/get');

var _get2 = _interopRequireDefault(_get);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class GeminiAPI {

  constructor({ key, secret, sandbox = false } = { sandbox: false }) {
    this.requestPublic = (endpoint, params = {}) => _axios2.default.get(`${this.baseUrl}/v1${endpoint}`, { params }).then((0, _get2.default)(`data`)).catch(err => Promise.reject(err.response.data));

    this.requestPrivate = (endpoint, params = {}) => {
      if (!this.key || !this.secret) {
        throw new Error(`API key and secret key required to use authenticated methods`);
      }

      const requestPath = `/v1${endpoint}`;
      const requestUrl = `${this.baseUrl}${requestPath}`;

      const payload = _extends({
        nonce: Date.now(),
        request: requestPath
      }, params);

      const config = (0, _createRequestConfig2.default)({
        payload,
        key: this.key,
        secret: this.secret
      });

      return _axios2.default.post(requestUrl, {}, config).then((0, _get2.default)(`data`)).catch(err => Promise.reject(err.response.data));
    };

    this.getAllSymbols = () => this.requestPublic(`/symbols`);

    this.getTicker = symbol => this.requestPublic(`/pubticker/${symbol}`);

    this.getOrderBook = (symbol, params = {}) => this.requestPublic(`/book/${symbol}`, params);

    this.getTradeHistory = (symbol, params = {}) => this.requestPublic(`/trades/${symbol}`, params);

    this.getCurrentAuction = symbol => this.requestPublic(`/auction/${symbol}`);

    this.getAuctionHistory = (symbol, params = {}) => this.requestPublic(`/auction/${symbol}/history`, params);

    this.newOrder = (params = {}) => this.requestPrivate(`/order/new`, _extends({
      client_order_id: (0, _shortid2.default)(),
      type: `exchange limit`
    }, params));

    this.cancelOrder = ({ order_id } = {}) => this.requestPrivate(`/order/cancel`, { order_id });

    this.cancelAllSessionOrders = () => this.requestPrivate(`/order/cancel/session`);

    this.cancelAllActiveOrders = () => this.requestPrivate(`/order/cancel/all`);

    this.getMyOrderStatus = ({ order_id } = {}) => this.requestPrivate(`/order/status`, { order_id });

    this.getMyActiveOrders = () => this.requestPrivate(`/orders`);

    this.getMyPastTrades = (params = {}) => this.requestPrivate(`/mytrades`, params);

    this.getMyTradeVolume = () => this.requestPrivate(`/tradevolume`);

    this.getMyAvailableBalances = () => this.requestPrivate(`/balances`);

    this.newAddress = currency => this.requestPrivate(`/deposit/${currency}/newAddress`);

    this.key = key;
    this.secret = secret;
    const subdomain = sandbox ? `api.sandbox` : `api`;
    this.baseUrl = `https://${subdomain}.gemini.com`;
  }

  // Public API


  // Order Placement API


  // Order Status API


  // Fund Management API
}
exports.default = GeminiAPI;
GeminiAPI.WebsocketClient = _websocketClient2.default;