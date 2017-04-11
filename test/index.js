import GeminiAPI from '../dist/index';
import credentials from '../config.js';
import { test } from 'ava';

const restAPI =
  new GeminiAPI(Object.assign({}, credentials, { sandbox: true }));

const websocketAPI =
  new GeminiAPI.WebsocketClient(Object.assign({}, credentials, { sandbox: true }));

const orderParams = {
  amount: `1`,
  price: `100`,
  side: `buy`,
  symbol: `btcusd`,
};

test(`rest API methods`, async t => {
  const { order_id } = await restAPI.newOrder(orderParams);

  const methods = [
    [`getAllSymbols`, []],
    [`getTicker`, [`btcusd`]],
    [`getOrderBook`, [`btcusd`]],
    [`getTradeHistory`, [`btcusd`]],
    [`getCurrentAuction`, [`btcusd`]],
    [`getAuctionHistory`, [`btcusd`]],
    [`newOrder`, [orderParams]],
    [`getMyOrderStatus`, [{ order_id }]],
    [`cancelOrder`, [{ order_id }]],
    [`cancelAllSessionOrders`, []],
    [`cancelAllActiveOrders`, []],
    [`getMyActiveOrders`, []],
    [`getMyPastTrades`, [{ symbol: `btcusd` }]],
    [`getMyTradeVolume`, []],
    [`getMyAvailableBalances`, []],
  ];

  const promiseFunctions = methods.map(([methodName, args]) => () =>
    restAPI[methodName](...args)
      .catch(err => Promise.reject(
        Object.assign({}, err, { methodName })
      )),
  );

  return promiseFunctions.reduce(
    (current, next) => current.then(next),
    Promise.resolve(),
  )
  .then(() => t.pass())
  .catch(err => t.fail(`Failure in ${err.methodName}: ${err.message}`));
});

const fiveSeconds = 5000;

test(`market data websocket API`, t =>
  new Promise((resolve, reject) => {
    websocketAPI.openMarketSocket(`btcusd`, resolve);
    setTimeout(reject, fiveSeconds);
  })
  .then(() => t.pass())
  .catch(err => t.fail(err.message))
);

test(`order events websocket API`, t =>
  new Promise((resolve, reject) => {
    websocketAPI.openOrderSocket(resolve);
    setTimeout(reject, fiveSeconds);
  })
  .then(() => t.pass())
  .catch(err => t.fail(err.message))
);
