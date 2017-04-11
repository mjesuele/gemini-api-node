import WebSocket from 'ws';
import createRequestConfig from './createRequestConfig';
import get from 'lodash/fp/get';
import pipe from 'lodash/fp/pipe';

const withData = listener => pipe(
  get(`data`),
  dataString => JSON.parse(dataString),
  listener,
);

export default class GeminiAPIWebsocketClient {
  constructor({ key, secret, sandbox = false }) {
    this.key = key;
    this.secret = secret;
    const subdomain = sandbox ? `api.sandbox` : `api`;
    this.baseUrl = `wss://${subdomain}.gemini.com`;
    this.hasCredentials = key && secret;
  }

  openOrderSocket = onOpen => {
    if (this.hasCredentials) {
      const requestPath = `/v1/order/events`;
      this.orderUrl = `${this.baseUrl}${requestPath}`;
      this.orderSocket = new WebSocket(this.orderUrl, createRequestConfig({
        key: this.key,
        secret: this.secret,
        payload: {
          nonce: Date.now(),
          request: requestPath,
        },
      }));
      this.orderSocket.addEventListener(`open`, (...args) => {
        console.log(`Connected to order events WebSocket API.`);
        if (typeof onOpen === `function`) onOpen(...args);
      });
    }
  }

  openMarketSocket = (symbol, onOpen) => {
    this.marketSocket = new WebSocket(`${this.baseUrl}/v1/marketdata/${symbol}`);
    this.marketSocket.addEventListener(`open`, (...args) => {
      console.log(`Connected to market data WebSocket API`);
      if (typeof onOpen === `function`) onOpen(...args);
    });
  }

  addMarketMessageListener = listener => this.marketSocket
    && this.marketSocket.addEventListener(`message`, withData(listener));

  addOrderMessageListener = listener => this.orderSocket
    && this.orderSocket.addEventListener(`message`, withData(listener));

  removeMarketMessageListener = listener => this.marketSocket
    && this.marketSocket.removeEventListener(`message`, withData(listener));

  removeOrderMessageListener = listener => this.orderSocket
    && this.orderSocket.removeEventListener(`message`, withData(listener));

  addMarketListener = (event, listener) => this.marketSocket
    && this.marketSocket.addEventListener(event, listener);

  addOrderListener = (event, listener) => this.orderSocket
    && this.orderSocket.addEventListener(event, listener);

  removeMarketListener = (event, listener) => this.marketSocket
    && this.marketSocket.removeEventListener(event, listener);

  removeOrderListener = (event, listener) => this.orderSocket
    && this.orderSocket.removeEventListener(event, listener);

}
