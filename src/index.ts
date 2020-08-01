import axios, { AxiosRequestConfig } from "axios";
import createRequestConfig from "./createRequestConfig";
import * as params from "./params";
import * as responses from "./responses";
// import WebsocketClient from "./websocketClient";

type Params = AxiosRequestConfig["params"];

export interface ConstructorProps {
  key?: string;
  secret?: string;
  sandbox?: boolean;
}

export default class GeminiAPI {
  // static WebsocketClient = WebsocketClient;
  private key?: string;
  private secret?: string;
  private baseUrl: string;

  constructor(
    { key, secret, sandbox = false }: ConstructorProps = {
      sandbox: false,
    }
  ) {
    this.key = key;
    this.secret = secret;
    const subdomain = sandbox ? `api.sandbox` : `api`;
    this.baseUrl = `https://${subdomain}.gemini.com`;
  }

  requestPublic = <T>(
    endpoint: string,
    params: Params = {},
    version = 1
  ): Promise<T> =>
    axios
      .get(`${this.baseUrl}/v${version}${endpoint}`, { params })
      .then((resp) => resp.data)
      .catch((err) => Promise.reject(err.response.data));

  requestPublicV2 = <T>(endpoint: string, params: Params = {}): Promise<T> =>
    this.requestPublic(endpoint, params, 2);

  requestPrivate = <T>(
    endpoint: string,
    params: Params = {},
    version = 1
  ): Promise<T> => {
    if (!this.key || !this.secret) {
      throw new Error(
        `API key and secret key required to use authenticated methods`
      );
    }

    const requestPath = `/v${version}${endpoint}`;
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

    return axios
      .post(requestUrl, {}, config)
      .then(get(`data`))
      .catch((err) => Promise.reject(err.response.data));
  };

  // Public API

  /**
   * Retrieves all available symbols for trading.
   */
  getAllSymbols = (): Promise<responses.Symbols> =>
    this.requestPublic(`/symbols`);

  /**
   * Retrieves information about recent trading activity for the symbol.
   */
  getTicker = (symbol: string): Promise<responses.Ticker> =>
    this.requestPublic(`/pubticker/${symbol}`);

  /**
   * V2 Ticker endpoint returns more information about the symbol than V1
   */
  getTickerV2 = (symbol: string): Promise<responses.TickerV2> =>
    this.requestPublicV2(`/ticker/${symbol}`);

  /**
   * Retrieves time-intervaled data for the provided symbol, postprocessed into a more
   * ergonomic format than the array-of-arrays the API responds with.
   */
  getCandles = async (
    symbol: string,
    timeFrame: params.CandleTimeFrame
  ): Promise<responses.Candle[]> => {
    const rawCandles = await this.requestPublicV2<responses.RawCandle[]>(
      `/candles/${symbol}/${timeFrame}`
    );
    return rawCandles.map(([time, open, high, low, close, volume]) => ({
      time,
      open,
      high,
      low,
      close,
      volume,
    }));
  };

  /**
   * Like getCandles but without any postprocessing of the result from Gemini.
   */
  getRawCandles = (
    symbol: string,
    timeFrame: params.CandleTimeFrame
  ): Promise<responses.RawCandle[]> =>
    this.requestPublicV2(`/candles/${symbol}/${timeFrame}`);

  /**
   * Returns the current order book as two arrays, one of bids, and one of asks.
   */
  getOrderBook = (
    symbol: string,
    params: params.OrderBook = {}
  ): Promise<responses.OrderBook> =>
    this.requestPublic(`/book/${symbol}`, params);

  /**
   * This will return the trades that have executed since the specified timestamp.
   * Timestamps are either seconds or milliseconds since the epoch (1970-01-01).
   * See the Data Types section of the Gemini API docs for information on this.
   */
  getTradeHistory = (
    symbol: string,
    params: params.TradeHistory = {}
  ): Promise<responses.TradeHistory[]> =>
    this.requestPublic(`/trades/${symbol}`, params);

  /**
   * Retrieves details of the current auction.
   */
  getCurrentAuction = (symbol: string): Promise<responses.AuctionStatus> =>
    this.requestPublic(`/auction/${symbol}`);

  /**
   * This will return the auction events, optionally including publications of
   * indicative prices, since the specific timestamp.
   */
  getAuctionHistory = (
    symbol: string,
    params: params.AuctionHistory = {}
  ): Promise<responses.AuctionHistory[]> =>
    this.requestPublic(`/auction/${symbol}/history`, params);

  getPriceFeed = (): Promise<responses.PriceFeedItem[]> =>
    this.requestPublic("/pricefeed");

  // Order Placement API

  /**
   * Place an order. Only limit and stop-limit orders are supported via the API.
   */
  newOrder = (params: params.NewOrder): Promise<responses.OrderStatus> =>
    this.requestPrivate(`/order/new`, params);

  /**
   * This will cancel an order. If the order is already canceled, the message
   * will succeed but have no effect.
   */
  cancelOrder = ({
    order_id,
  }: params.CancelOrder): Promise<responses.OrderCancelledStatus> =>
    this.requestPrivate(`/order/cancel`, { order_id });

  /**
   * Cancel all orders for this session.
   */
  cancelAllSessionOrders = (
    params: params.CancelOrders = {}
  ): Promise<responses.CancelOrders> =>
    this.requestPrivate(`/order/cancel/session`, params);

  /**
   * This will cancel all outstanding orders created by all sessions owned by
   * this account, including interactive orders placed through the UI.
   */
  cancelAllActiveOrders = (
    params: params.CancelOrders = {}
  ): Promise<responses.CancelOrders> =>
    this.requestPrivate(`/order/cancel/all`, params);

  // // Order Status API

  // /**
  //  * Gets the status for an order
  //  * @param params
  //  */
  // getMyOrderStatus = ({ order_id } = {}) =>
  //   this.requestPrivate(`/order/status`, { order_id });

  // /**
  //  * Returns active orders for the session account.
  //  */
  // getMyActiveOrders = () => this.requestPrivate(`/orders`);

  // /**
  //  * Returns past trades. 50 are returned by default, with a max of 500 being
  //  * returned if the limit_trades param is passed.
  //  * @param params
  //  */
  // getMyPastTrades = (params = {}) => this.requestPrivate(`/mytrades`, params);

  // /**
  //  * Returns the trade volume for the session account.
  //  */
  // getMyTradeVolume = () => this.requestPrivate(`/tradevolume`);

  // // Fund Management API

  // /**
  //  * Returns available balances in the supported currencies.
  //  */
  // getMyAvailableBalances = () => this.requestPrivate(`/balances`);

  // /**
  //  * Requests a new deposit address for the specified currency.
  //  * @param {string} currency
  //  */
  // newAddress = (currency) =>
  //   this.requestPrivate(`/deposit/${currency}/newAddress`);
}
