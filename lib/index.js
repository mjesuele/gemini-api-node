"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const createRequestConfig_1 = __importDefault(require("./createRequestConfig"));
class GeminiAPI {
    constructor({ key, secret, sandbox = false } = {
        sandbox: false,
    }) {
        this.requestPublic = (endpoint, params = {}, version = 1) => axios_1.default
            .get(`${this.baseUrl}/v${version}${endpoint}`, { params })
            .then((resp) => resp.data)
            .catch((err) => Promise.reject(err.response.data));
        this.requestPublicV2 = (endpoint, params = {}) => this.requestPublic(endpoint, params, 2);
        this.requestPrivate = (endpoint, params = {}, version = 1) => {
            if (!this.key || !this.secret) {
                throw new Error(`API key and secret key required to use authenticated methods`);
            }
            const requestPath = `/v${version}${endpoint}`;
            const requestUrl = `${this.baseUrl}${requestPath}`;
            const payload = Object.assign({ nonce: Date.now(), request: requestPath }, params);
            const config = createRequestConfig_1.default({
                payload,
                key: this.key,
                secret: this.secret,
            });
            return axios_1.default
                .post(requestUrl, {}, config)
                .then(get(`data`))
                .catch((err) => Promise.reject(err.response.data));
        };
        // Public API
        /**
         * Retrieves all available symbols for trading.
         */
        this.getAllSymbols = () => this.requestPublic(`/symbols`);
        /**
         * Retrieves information about recent trading activity for the symbol.
         */
        this.getTicker = (symbol) => this.requestPublic(`/pubticker/${symbol}`);
        /**
         * V2 Ticker endpoint returns more information about the symbol than V1
         */
        this.getTickerV2 = (symbol) => this.requestPublicV2(`/ticker/${symbol}`);
        /**
         * Retrieves time-intervaled data for the provided symbol, postprocessed into a more
         * ergonomic format than the array-of-arrays the API responds with.
         */
        this.getCandles = (symbol, timeFrame) => __awaiter(this, void 0, void 0, function* () {
            const rawCandles = yield this.requestPublicV2(`/candles/${symbol}/${timeFrame}`);
            return rawCandles.map(([time, open, high, low, close, volume]) => ({
                time,
                open,
                high,
                low,
                close,
                volume,
            }));
        });
        /**
         * Like getCandles but without any postprocessing of the result from Gemini.
         */
        this.getRawCandles = (symbol, timeFrame) => this.requestPublicV2(`/candles/${symbol}/${timeFrame}`);
        /**
         * Returns the current order book as two arrays, one of bids, and one of asks.
         */
        this.getOrderBook = (symbol, params = {}) => this.requestPublic(`/book/${symbol}`, params);
        /**
         * This will return the trades that have executed since the specified timestamp.
         * Timestamps are either seconds or milliseconds since the epoch (1970-01-01).
         * See the Data Types section of the Gemini API docs for information on this.
         */
        this.getTradeHistory = (symbol, params = {}) => this.requestPublic(`/trades/${symbol}`, params);
        /**
         * Retrieves details of the current auction.
         */
        this.getCurrentAuction = (symbol) => this.requestPublic(`/auction/${symbol}`);
        /**
         * This will return the auction events, optionally including publications of
         * indicative prices, since the specific timestamp.
         */
        this.getAuctionHistory = (symbol, params = {}) => this.requestPublic(`/auction/${symbol}/history`, params);
        this.getPriceFeed = () => this.requestPublic("/pricefeed");
        // Order Placement API
        /**
         * Place an order. Only limit and stop-limit orders are supported via the API.
         */
        this.newOrder = (params) => this.requestPrivate(`/order/new`, params);
        /**
         * This will cancel an order. If the order is already canceled, the message
         * will succeed but have no effect.
         */
        this.cancelOrder = ({ order_id, }) => this.requestPrivate(`/order/cancel`, { order_id });
        /**
         * Cancel all orders for this session.
         */
        this.cancelAllSessionOrders = (params = {}) => this.requestPrivate(`/order/cancel/session`, params);
        /**
         * This will cancel all outstanding orders created by all sessions owned by
         * this account, including interactive orders placed through the UI.
         */
        this.cancelAllActiveOrders = (params = {}) => this.requestPrivate(`/order/cancel/all`, params);
        this.key = key;
        this.secret = secret;
        const subdomain = sandbox ? `api.sandbox` : `api`;
        this.baseUrl = `https://${subdomain}.gemini.com`;
    }
}
exports.default = GeminiAPI;
//# sourceMappingURL=index.js.map