// Type definitions for gemini-api
// Project: https://github.com/mjesuele/gemini-api-node
// Definitions by: Evan Shortiss <https://github.com/evanshortiss/>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.23

declare class WebsocketClient {}

export class GeminiAPI {
  constructor (options: RestClientOptions)

  static WebsocketClient: WebsocketClient

  getAllSymbols(): Promise<Array<string>>

  getTicker(symbol: string): Promise<ResponseTicker>

  getOrderBook(symbol: string, params?: ParamOrderBook): Promise<ResponseOrderBook>

  getTradeHistory(symbol: string, params?: ParamTradeHistory): Promise<Array<ResponseTrade>>

  // TODO
  // getCurrentAuction(symbol: string)
  // getAuctionHistory(symbol, params = {})
  // newOrder(params = {})
  // cancelOrder({ order_id })
  // cancelAllSessionOrders()
  // cancelAllActiveOrders()
  // getMyOrderStatus({ order_id })
  // getMyActiveOrders()

  getMyPastTrades(params?: ParamMyPastTrades): Promise<Array<ResponseMyTradesEntry>>

  getMyTradeVolume(): Promise<Array<ResponseTradeVolumeEntry>>

  getMyAvailableBalances(): Promise<Array<ReponseMyBalancesEntry>>
}

interface ParamOrderBook {
  limit_asks?: number
  limit_bids?: number
}

interface ParamTradeHistory {
  timestamp?: number
  limit_trades?: number
  include_breaks?: number
}

interface ParamMyPastTrades {
  request: string
  nonce: number
  symbol: string
  limit_trades?: number
  timestamp?: number
}

interface ReponseMyBalancesEntry {
  currency: string
  amount: string
  available: string
  availableForWithdrawal: string
}

interface ResponseMyTradesEntry {
  price: string
  amount: string
  timestamp: number
  timestampms: number
  type: string
  aggressor: boolean,
  fee_currency: string,
  fee_amount: string,
  tid: number,
  order_id: string,
  exchange: string,
  is_auction_fill: boolean
  break?: boolean
}

export interface ResponseTradeVolumeEntry {
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

interface ResponseTrade {
  timestamp: number
  timestampms: number
  tid: number
  price: string
  amount: string
  exchange: string
  type: string
  broken: boolean
}

interface ResponseTicker {
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

interface ResponseOrderBookEntry {
  price: string
  amount: string
}

interface ResponseOrderBook {
  bids: Array<ResponseOrderBookEntry>
  asks: Array<ResponseOrderBookEntry>
}

export interface RestClientOptions {
  key: string
  secret: string
  sandbox?: boolean
}

export default GeminiAPI;
