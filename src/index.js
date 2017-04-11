import WebsocketClient from './websocketClient';
import axios from 'axios';
import createRequestConfig from './createRequestConfig';
import credentials from '../config';
import get from 'lodash/fp/get';
import shortid from 'shortid';

export default class GeminiAPI {
  static WebsocketClient = WebsocketClient;

  constructor({ key, secret, sandbox = false } = { sandbox: false }) {
    this.key = key;
    this.secret = secret;
    const subdomain = sandbox ? `api.sandbox` : `api`;
    this.baseUrl = `https://${subdomain}.gemini.com`;
  }

  requestPublic = (endpoint, params = {}) =>
    axios.get(`${this.baseUrl}/v1${endpoint}`, { params })
      .then(get(`data`))
      .catch(err => Promise.reject(err.response.data));

  requestPrivate = (endpoint, params = {}) => {
    if (!this.key || !this.secret) {
      throw new Error(
        `API key and secret key required to use authenticated methods`,
      );
    }

    const requestPath = `/v1${endpoint}`;
    const requestUrl = `${this.baseUrl}${requestPath}`;

    const payload = {
      nonce: Date.now(),
      request: requestPath,
      ...params,
    };

    const config = createRequestConfig({
      payload,
      key: this.key,
      secret: this.secret,
    });

    return axios.post(requestUrl, {}, config)
      .then(get(`data`))
      .catch(err => Promise.reject(err.response.data));
  }

  // Public API
  getAllSymbols = () =>
    this.requestPublic(`/symbols`)

  getTicker = symbol =>
    this.requestPublic(`/pubticker/${symbol}`)

  getOrderBook = (symbol, params = {}) =>
    this.requestPublic(`/book/${symbol}`, params)

  getTradeHistory = (symbol, params = {}) =>
    this.requestPublic(`/trades/${symbol}`, params)

  getCurrentAuction = symbol =>
    this.requestPublic(`/auction/${symbol}`);

  getAuctionHistory = (symbol, params = {}) =>
    this.requestPublic(`/auction/${symbol}/history`, params)

  // Order Placement API
  newOrder = (params = {}) =>
    this.requestPrivate(`/order/new`, {
      client_order_id: shortid(),
      type: `exchange limit`,
      ...params,
    })

  cancelOrder = ({ order_id } = {}) =>
    this.requestPrivate(`/order/cancel`, { order_id })

  cancelAllSessionOrders = () =>
    this.requestPrivate(`/order/cancel/session`)

  cancelAllActiveOrders = () =>
    this.requestPrivate(`/order/cancel/all`)

  // Order Status API
  getMyOrderStatus = ({ order_id } = {}) =>
    this.requestPrivate(`/order/status`, { order_id })

  getMyActiveOrders = () =>
    this.requestPrivate(`/orders`)

  getMyPastTrades = (params = {}) =>
    this.requestPrivate(`/mytrades`, params)

  getMyTradeVolume = () =>
    this.requestPrivate(`/tradevolume`)

  // Fund Management API
  getMyAvailableBalances = () =>
    this.requestPrivate(`/balances`)
}

const restClient =
  new GeminiAPI({ ...credentials, sandbox: true });

const { getTicker } = restClient;
getTicker(`btcusd`)
  .then(data =>
    console.log(`Last trade: $${data.last}/BTC`)
  );
