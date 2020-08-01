import { LimitOrderOption } from "./params";
export declare type Symbols = string[];
export interface Ticker {
    ask: string;
    bid: string;
    last: string;
    volume: Volume;
}
export declare type Volume = {
    [symbol: string]: string;
} & {
    timestamp: number;
};
export interface TickerV2 {
    symbol: string;
    open: string;
    high: string;
    low: string;
    close: string;
    changes: string[];
    bid: string;
    ask: string;
}
export declare type RawCandle = [number, // time
number, // open
number, // high
number, // low
number, // close
number];
export interface Candle {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}
export interface OrderBook {
    bids: PriceLevel[];
    asks: PriceLevel[];
}
export interface PriceLevel {
    price: string;
    amount: string;
}
export declare type TradeType = "buy" | "sell" | "auction" | "block";
export interface TradeHistory {
    timestamp: number;
    timestampms: number;
    tid: number;
    price: string;
    amount: string;
    exchange: "gemini";
    type: TradeType;
    broken: boolean;
}
export declare type AuctionStatus = {
    next_auction_ms: number;
} & (AuctionPreopenStatus | AuctionOpenStatus | AuctionPriceStatus | AuctionFinalPriceStatus | AuctionClosedStatus);
export interface AuctionPreopenStatus {
    closed_until_ms: number;
    last_auction_price: string;
    last_auction_quantity: string;
    last_highest_bid_price: string;
    last_lowest_ask_price: string;
    last_collar_price: string;
}
export interface AuctionOpenStatus {
    last_auction_eid: number;
    last_auction_price: string;
    last_auction_quantity: string;
    last_highest_bid_price: string;
    last_lowest_ask_price: string;
    last_collar_price: string;
    next_update_ms: number;
}
export interface AuctionPriceStatus {
    last_auction_eid: number;
    most_recent_indicative_price: string;
    most_recent_indicative_quantity: string;
    most_recent_highest_bid_price: string;
    most_recent_lowest_ask_price: string;
    most_recent_collar_price: string;
    next_update_ms: number;
}
export interface AuctionFinalPriceStatus {
    last_auction_eid: number;
    most_recent_indicative_price: string;
    most_recent_indicative_quantity: string;
    most_recent_highest_bid_price: string;
    most_recent_lowest_ask_price: string;
    most_recent_collar_price: string;
    next_update_ms: number;
}
export interface AuctionClosedStatus {
    closed_until_ms: number;
    last_auction_price: string;
    last_auction_quantity: string;
    last_highest_bid_price: string;
    last_lowest_ask_price: string;
    last_collar_price: string;
}
export declare type AuctionHistory = AuctionCommonHistory & (AuctionSuccessHistory | AuctionFailureHistory);
interface AuctionCommonHistory {
    highest_bid_price?: string;
    lowest_ask_price?: string;
    auction_id: number;
    eid: number;
    collar_price: string;
    timestamp: number;
    timestampms: number;
    event_type: "indicative" | "auction";
}
export interface AuctionSuccessHistory {
    auction_price: string;
    auction_quantity: string;
    auction_result: "success";
}
export interface AuctionFailureHistory {
    auction_price: "0";
    auction_quantity: "0";
    auction_result: "failure";
}
export interface PriceFeedItem {
    pair: string;
    price: string;
    percentChange24h: string;
}
export declare type OrderStatus = OrderLimitStatus | OrderMarketStatus;
export declare enum OrderType {
    LIMIT = "exchange limit",
    AUCTION_LIMIT = "auction-only exchange limit",
    MARKET_BUY = "market buy",
    MARKET_SELL = "market sell",
    IOI = "indication-of-interest"
}
export interface OrderLimitStatus {
    order_id: string;
    id: string;
    symbol: string;
    exchange: "gemini";
    avg_execution_price: string;
    side: "buy" | "sell";
    type: OrderType.LIMIT | OrderType.AUCTION_LIMIT;
    timestamp: number;
    timestampms: number;
    is_live: boolean;
    is_cancelled: boolean;
    is_hidden: boolean;
    was_forced: false;
    executed_amount: string;
    remaining_amount: string;
    options: [] | [LimitOrderOption];
    price: string;
    original_amount: string;
}
export interface OrderMarketStatus {
    order_id: string;
    id: string;
    symbol: string;
    exchange: "gemini";
    avg_execution_price: string;
    side: "buy" | "sell";
    type: OrderType.MARKET_BUY | OrderType.MARKET_SELL | OrderType.IOI;
    timestamp: number;
    timestampms: number;
    is_live: boolean;
    is_cancelled: boolean;
    is_hidden: false;
    was_forced: boolean;
    executed_amount: string;
    remaining_amount: string;
    options: [];
}
export declare type OrderCancelledStatus = OrderStatus & {
    is_cancelled: true;
};
export interface CancelOrders {
    result: "ok";
    details: {
        cancelledOrders: number[];
        cancelRejects: [];
    };
}
export {};
