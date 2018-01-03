// Type definitions for gemini-api
// Project: https://github.com/mjesuele/gemini-api-node
// Definitions by: Evan Shortiss <https://github.com/evanshortiss/>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.23

// This is not publicly exposed, but is instead exposed as a static member of
// the GeminiAPI (aka RestClient)
declare class WebsocketClient {}

export class GeminiAPI {
  constructor (options: RestClientOptions)

  static WebsocketClient: WebsocketClient

  /**
   * Retrieves all available symbols for trading.
   */
  getAllSymbols(): Promise<string[]>

  /**
   * Retrieves information about recent trading activity for the symbol.
   * @param symbol
   */
  getTicker(symbol: string): Promise<Ticker>

  /**
   * This will return the current order book, as two arrays, one of bids, and one of asks.
   * @param symbol
   * @param params
   */
  getOrderBook(symbol: string, params?: OrderBook): Promise<OrderBook>

  /**
   * This will return the trades that have executed since the specified timestamp.
   * Timestamps are either seconds or milliseconds since the epoch (1970-01-01).
   * See the Data Types section of the Gemini API docs for information on this.
   * @param symbol
   * @param params
   */
  getTradeHistory(symbol: string, params?: Params.TradeHistory): Promise<Trade[]>

  /**
   * Retreives details of the current auction.
   * @param symbol
   */
  getCurrentAuction(symbol: string): Promise<AuctionClosedState|AuctionOpenedState|AuctionIndicativePriceState>

  /**
   * This will return the auction events, optionally including publications of
   * indicative prices, since the specific timestamp.
   * @param symbol
   * @param params
   */
  getAuctionHistory(symbol: string, params?: Params.AuctionHistory): Promise<AuctionHistoryEntry[]>

  /**
   * Place an order. Only limit orders are supported via the API.
   * @param params
   */
  newOrder(params: Params.NewOrder): Promise<OrderStatus>

  /**
   * This will cancel an order. If the order is already canceled, the message
   * will succeed but have no effect.
   * @param params
   */
  cancelOrder(params: Params.CancelOrder): Promise<OrderStatus>


  /**
   * Cancel all orders for this session.
   */
  cancelAllSessionOrders(): Promise<{ result: boolean }>

  /**
   * This will cancel all outstanding orders created by all sessions owned by
   * this account, including interactive orders placed through the UI.
   */
  cancelAllActiveOrders(): Promise<{ result: boolean }>

  /**
   * Gets the status for an order
   * @param params
   */
  getMyOrderStatus(params: Params.OrderStatus): Promise<OrderStatus>

  /**
   * Returns active orders for the session account.
   */
  getMyActiveOrders(): Promise<OrderStatus[]>

  /**
   * Returns past trades. 50 are returned by default, with a max of 500 being
   * returned if the limit_trades param is passed.
   * @param params
   */
  getMyPastTrades(params?: Params.AccountPastTrades): Promise<AccountTradesEntry[]>

  /**
   * Returns the trade volume for the session account.
   */
  getMyTradeVolume(): Promise<TradeVolumeEntry[]>

  /**
   * Returns available balances in the supported currencies
   */
  getMyAvailableBalances(): Promise<AccountBalancesEntry[]>
}

export type OrderSide = 'buy'|'sell'
export type OrderType = 'exchange limit'
export type OrderExecutionOption = 'maker-or-cancel'|'immediate-or-cancel'|'auction-only'

export namespace Params {
  interface CancelOrder {
    client_order_id: string
  }

  interface OrderStatus {
    client_order_id: string
  }

  interface NewOrder {
    client_order_id?: string
    symbol: string
    amount: string
    price: string
    side: OrderSide
    type: OrderType
    options?: OrderExecutionOption
  }

  interface AuctionHistory {
    limit_auction_results: number
    include_indicative: boolean
    since: number
  }

  interface AccountOrderBook {
    limit_asks?: number
    limit_bids?: number
  }

  interface TradeHistory {
    timestamp?: number
    limit_trades?: number
    include_breaks?: number
  }

  interface AccountPastTrades {
    symbol: string
    limit_trades?: number
    timestamp?: number
  }
}


export interface AuctionHistoryEntry {
  auction_id: number
  auction_price: string
  auction_quantity: string
  eid: number
  highest_bid_price: string
  lowest_ask_price: string
  collar_price: string
  auction_result: string
  timestamp: number
  timestampms: number
  event_type: string
}

export interface AuctionClosedState {
  closed_until_ms: number
  last_auction_price: string
  last_auction_quantity: string
  last_highest_bid_price: string
  last_lowest_ask_price: string
  last_collar_price: string
  next_auction_ms: number
}

export interface AuctionOpenedState {
  last_auction_eid: number
  last_auction_price: string
  last_auction_quantity: string
  last_highest_bid_price: string
  last_lowest_ask_price: string
  last_collar_price: string
  next_auction_ms: number
  next_update_ms: number
}

export interface AuctionIndicativePriceState {
  last_auction_eid: number
  most_recent_indicative_price: string
  most_recent_indicative_quantity: string
  most_recent_highest_bid_price: string
  most_recent_lowest_ask_price: string
  most_recent_collar_price: string
  next_auction_ms: number
  next_update_ms: number
}

export interface AccountBalancesEntry {
  currency: string
  amount: string
  available: string
  availableForWithdrawal: string
}

export interface AccountTradesEntry {
  price: string
  amount: string
  timestamp: number
  timestampms: number
  type: string
  aggressor: boolean
  fee_currency: string
  fee_amount: string
  tid: number
  order_id: string
  exchange: string
  is_auction_fill: boolean
  break?: boolean
}

export interface TradeVolumeEntry {
  account_id: string
  symbol: string
  base_currency: string
  notional_currency: string
  data_date: string
  total_volume_base: string
  maker_buy_sell_ratio: string
  buy_maker_base: string
  buy_maker_notional: string
  buy_maker_count: string
  sell_maker_base: string
  sell_maker_notional: string
  sell_maker_count: string
  buy_taker_base: string
  buy_taker_notional: string
  buy_taker_count: string
  sell_taker_base: string
  sell_taker_notional: string
  sell_taker_count: string
}

export interface Trade {
  timestamp: number
  timestampms: number
  tid: number
  price: string
  amount: string
  exchange: string
  type: string
  broken: boolean
}

export interface Ticker {
  ask: string
  bid: string
  last: string
  volume: {
    BTC?: string
    ETH?: string
    USD?: string
    timestamp: number
  }
}

export interface OrderStatus {
  order_id: string
  client_order_id: string
  symbol: string
  price: string
  avg_execution_price: string
  side: OrderSide
  type: OrderType
  timestamp: string
  timestampms: number
  is_live: boolean
  is_cancelled: false
  options: OrderExecutionOption[],
  executed_amount: string
  remaining_amount: string
  original_amount: string
}

export interface OrderBookEntry {
  price: string
  amount: string
}

export interface OrderBook {
  bids: Array<OrderBookEntry>
  asks: Array<OrderBookEntry>
}

export interface RestClientOptions {
  key: string
  secret: string
  sandbox?: boolean
}

export default GeminiAPI;
