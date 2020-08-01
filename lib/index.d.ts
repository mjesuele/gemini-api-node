import { AxiosRequestConfig } from "axios";
import * as params from "./params";
import * as responses from "./responses";
declare type Params = AxiosRequestConfig["params"];
export interface ConstructorProps {
    key?: string;
    secret?: string;
    sandbox?: boolean;
}
export default class GeminiAPI {
    private key?;
    private secret?;
    private baseUrl;
    constructor({ key, secret, sandbox }?: ConstructorProps);
    requestPublic: <T>(endpoint: string, params?: Params, version?: number) => Promise<T>;
    requestPublicV2: <T>(endpoint: string, params?: Params) => Promise<T>;
    requestPrivate: <T>(endpoint: string, params?: Params, version?: number) => Promise<T>;
    /**
     * Retrieves all available symbols for trading.
     */
    getAllSymbols: () => Promise<responses.Symbols>;
    /**
     * Retrieves information about recent trading activity for the symbol.
     */
    getTicker: (symbol: string) => Promise<responses.Ticker>;
    /**
     * V2 Ticker endpoint returns more information about the symbol than V1
     */
    getTickerV2: (symbol: string) => Promise<responses.TickerV2>;
    /**
     * Retrieves time-intervaled data for the provided symbol, postprocessed into a more
     * ergonomic format than the array-of-arrays the API responds with.
     */
    getCandles: (symbol: string, timeFrame: params.CandleTimeFrame) => Promise<responses.Candle[]>;
    /**
     * Like getCandles but without any postprocessing of the result from Gemini.
     */
    getRawCandles: (symbol: string, timeFrame: params.CandleTimeFrame) => Promise<responses.RawCandle[]>;
    /**
     * Returns the current order book as two arrays, one of bids, and one of asks.
     */
    getOrderBook: (symbol: string, params?: params.OrderBook) => Promise<responses.OrderBook>;
    /**
     * This will return the trades that have executed since the specified timestamp.
     * Timestamps are either seconds or milliseconds since the epoch (1970-01-01).
     * See the Data Types section of the Gemini API docs for information on this.
     */
    getTradeHistory: (symbol: string, params?: params.TradeHistory) => Promise<responses.TradeHistory[]>;
    /**
     * Retrieves details of the current auction.
     */
    getCurrentAuction: (symbol: string) => Promise<responses.AuctionStatus>;
    /**
     * This will return the auction events, optionally including publications of
     * indicative prices, since the specific timestamp.
     */
    getAuctionHistory: (symbol: string, params?: params.AuctionHistory) => Promise<responses.AuctionHistory[]>;
    getPriceFeed: () => Promise<responses.PriceFeedItem[]>;
    /**
     * Place an order. Only limit and stop-limit orders are supported via the API.
     */
    newOrder: (params: params.NewOrder) => Promise<responses.OrderStatus>;
    /**
     * This will cancel an order. If the order is already canceled, the message
     * will succeed but have no effect.
     */
    cancelOrder: ({ order_id, }: params.CancelOrder) => Promise<responses.OrderCancelledStatus>;
    /**
     * Cancel all orders for this session.
     */
    cancelAllSessionOrders: (params?: params.CancelOrders) => Promise<responses.CancelOrders>;
    /**
     * This will cancel all outstanding orders created by all sessions owned by
     * this account, including interactive orders placed through the UI.
     */
    cancelAllActiveOrders: (params?: params.CancelOrders) => Promise<responses.CancelOrders>;
}
export {};
