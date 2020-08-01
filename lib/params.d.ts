export declare type CandleTimeFrame = "1m" | "5m" | "15m" | "30m" | "1hr" | "6hr" | "1day";
export interface OrderBook {
    limit_bids?: number;
    limit_asks?: number;
}
export interface TradeHistory {
    since?: string | number;
    limit_trades?: number;
    include_breaks?: boolean;
}
export interface AuctionHistory {
    since?: string | number;
    limit_auction_results?: number;
    include_indicative?: boolean;
}
export declare enum OrderType {
    LIMIT = "exchange limit",
    STOP_LIMIT = "exchange stop limit"
}
export declare type LimitOrderOption = "maker-or-cancel" | "immediate-or-cancel" | "fill-or-kill" | "auction-only" | "indication-of-interest";
export interface NewOrderCommon {
    client_order_id?: string;
    symbol: string;
    amount: string;
    min_amount?: string;
    price: string;
    side: "buy" | "sell";
    account?: string;
}
export interface NewOrderLimit {
    type: OrderType.LIMIT;
    options?: [] | [LimitOrderOption];
}
export interface NewOrderStopLimit {
    type: OrderType.STOP_LIMIT;
    stop_price?: string;
}
export declare type NewOrder = NewOrderCommon & (NewOrderLimit | NewOrderStopLimit);
export interface CancelOrder {
    order_id: string;
    account?: string;
}
export interface CancelOrders {
    account?: string;
}
