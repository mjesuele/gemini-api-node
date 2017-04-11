# gemini-api

Gemini cryptocurrency exchange API wrapper for Node.js

## Installation

```
yarn add gemini-api
```

## Usage

Clients for both the [REST API](https://docs.gemini.com/rest-api/) and
[streaming WebSocket API](https://docs.gemini.com/websocket-api/) are included.
Private endpoints as indicated in the API docs require authentication with an API
key and secret key.

### Example usage:

```javascript
import GeminiAPI from 'gemini-api';

const restClient = new GeminiAPI({ key, secret, sandbox: false });
const websocketClient =
  new GeminiAPI.WebsocketClient({ key, secret, sandbox: false });

restClient.getOrderBook('btcusd', { limit_asks: 10, limit_bids: 10 })
  .then(console.log)
  .catch(console.error);

websocketClient.addMarketMessageListener(data =>
  doSomethingCool(data)
);

// The methods are bound properly, so feel free to destructure them:
const { getTicker } = restClient;
getTicker('btcusd')
  .then(data =>
    console.log(`Last trade: $${data.last} / BTC`)
  )
```

## API

### REST
All methods return promises.
* getAllSymbols()
* getTicker(symbol)
* getOrderBook(symbol, params = {})
* getTradeHistory(symbol, params = {})
* getCurrentAuction(symbol)
* getAuctionHistory(symbol, params = {})
* newOrder(params = {})
* cancelOrder({ order_id })
* cancelAllSessionOrders()
* cancelAllActiveOrders()
* getMyOrderStatus({ order_id })
* getMyActiveOrders()
* getMyPastTrades(params = {})
* getMyTradeVolume()
* getMyAvailableBalances()

### WebSocket
* openMarketSocket(symbol, onOpen)
* openOrderSocket(onOpen)
* addMarketMessageListener(listener)
* addOrderMessageListener(listener)
* removeMarketMessageListener(listener)
* removeOrderMessageListener(listener)
* addMarketListener(event, listener)
* addOrderListener(event, listener)
* removeMarketListener(event, listener)
* removeOrderListener(event, listener)

## To Do
* Improved documentation
* More robust error handling

Feedback and pull requests welcome!
