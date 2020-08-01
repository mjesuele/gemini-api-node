import GeminiAPI from "./index";
import { NewOrder, OrderType } from "./params";

const pretty = (o: any) => JSON.stringify(o, null, 2);

const key = process.env.KEY;
const secret = process.env.SECRET;

const hasAuth = !!key && !!secret;

console.log({ key, secret, hasAuth });
// throw "foo";

const restAPI = new GeminiAPI({ key, secret, sandbox: true });

// const websocketAPI = new GeminiAPI.WebsocketClient({
//   key,
//   secret,
//   sandbox: true,
// });

const orderParams: NewOrder = {
  amount: `1`,
  price: `100`,
  side: `buy`,
  symbol: `btcusd`,
  type: OrderType.LIMIT,
};

type TestRun = {
  name: string;
  args?: any[];
};

describe("REST API methods", () => {
  const methods: TestRun[] = [
    { name: "getAllSymbols" },
    { name: "getTicker", args: ["btcusd"] },
    { name: "getTickerV2", args: ["btcusd"] },
    { name: "getCandles", args: ["btcusd", "15m"] },
    // { name: "getRawCandles", args: ["btcusd", "15m"] },
    { name: "getOrderBook", args: ["btcusd"] },
    { name: "getTradeHistory", args: ["btcusd"] },
    { name: "getCurrentAuction", args: ["btcusd"] },
    { name: "getAuctionHistory", args: ["btcusd"] },
    { name: "getPriceFeed" },
  ];

  methods.forEach(({ name, args = [] }) => {
    test(name, async (t) => {
      try {
        const result = await restAPI[name](...args);
        console.log(
          `Success in ${name}\n\nArgs: ${pretty(args)}\n\nResult: ${pretty(
            result
          )}`
        );
        t();
      } catch (err) {
        t.fail(
          `Failure in ${name}\n\nArgs: ${pretty(args)}\n\nError:\n${
            err.message
          }`
        );
      }
    });
  });

  test.only("private API methods", async (t) => {
    if (!hasAuth) {
      t.fail(
        "testing private API methods require a KEY and SECRET specified in environment variables. dotenv is supported, so you can add them to an .env file at the root of this repository (see example)"
      );
    }
    const { order_id } = await restAPI.newOrder(orderParams);
    const authedMethods: TestRun[] = [
      { name: `newOrder`, args: [orderParams] },
      // { name: `getMyOrderStatus`, args: [{ order_id }] },
      { name: `cancelOrder`, args: [{ order_id }] },
      { name: `cancelAllSessionOrders`, args: [] },
      { name: `cancelAllActiveOrders`, args: [] },
      // { name: `getMyActiveOrders`, args: [] },
      // { name: `getMyPastTrades`, args: [{ symbol: `btcusd` }] },
      // { name: `getMyTradeVolume`, args: [] },
      // { name: `getMyAvailableBalances`, args: [] },
    ];

    const authedPromises = authedMethods.map(async ({ name, args }) => {
      try {
        const result = await restAPI[name](...args);
        console.log(
          `Success in ${name}\n\nArgs: ${pretty(args)}\n\nResult: ${pretty(
            result
          )}`
        );
      } catch (err) {
        t.fail(
          `Failure in ${name}\n\nArgs: ${pretty(args)}\n\nError:\n${
            err.message
          }`
        );
      }
    });
    await Promise.all(authedPromises);
    t();
  });
});

// const fiveSeconds = 5000;

// test(`market data websocket API`, (t) =>
//   new Promise((resolve, reject) => {
//     websocketAPI.openMarketSocket(`btcusd`, resolve);
//     setTimeout(reject, fiveSeconds);
//   })
//     .then(() => t.pass())
//     .catch((err) => t.fail(err.message)));

// test(`order events websocket API`, (t) =>
//   new Promise((resolve, reject) => {
//     websocketAPI.openOrderSocket(resolve);
//     setTimeout(reject, fiveSeconds);
//   })
//     .then(() => t.pass())
//     .catch((err) => t.fail(err.message)));
