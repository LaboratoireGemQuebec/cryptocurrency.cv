---
title: "Crypto Trading Bot Basics for Developers"
description: "Learn the fundamentals of building a cryptocurrency trading bot. Covers exchange API integration, order management, strategy implementation, and risk controls in Python."
date: "2026-03-30"
author: team
category: tutorial
tags: ["trading-bot", "python", "exchange-api", "developer", "algorithmic-trading"]
image: "/images/blog/crypto-trading-bot-basics.jpg"
imageAlt: "Cryptocurrency trading bot architecture diagram showing strategy, execution, and risk management"
---

Cryptocurrency trading bots automate buy and sell decisions based on predefined rules. They can react faster than any human, execute without emotion, and run 24/7 — advantages that matter enormously in a market that never closes. This guide covers the fundamentals every developer needs to build their first trading bot responsibly.

## Important Disclaimer

Building and running a trading bot involves real financial risk. Start with small amounts, use testnet environments, backtest thoroughly before going live, and never risk money you cannot afford to lose. The code in this guide is educational.

## Architecture Overview

A trading bot has three core components:

1. **Data layer**: Price feeds, order book data, news, technical indicators
2. **Strategy layer**: Logic that decides when to buy, sell, or hold
3. **Execution layer**: Order placement, position management, risk controls

## Setting Up with ccxt

`ccxt` is a Python library that provides a unified API for over 100 cryptocurrency exchanges:

```bash
pip install ccxt python-dotenv pandas
```

```python
import ccxt
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize exchange
exchange = ccxt.binance({
    'apiKey': os.environ['BINANCE_API_KEY'],
    'secret': os.environ['BINANCE_SECRET'],
    'enableRateLimit': True,
    'options': {'defaultType': 'spot'},
})

# For testing, use the sandbox/testnet
exchange.set_sandbox_mode(True)  # Many exchanges support this
```

## Fetching Market Data

```python
def get_ohlcv(symbol: str, timeframe: str = '1h', limit: int = 200) -> list:
    """Fetch OHLCV (Open, High, Low, Close, Volume) data."""
    ohlcv = exchange.fetch_ohlcv(symbol, timeframe, limit=limit)
    return ohlcv  # [[timestamp, open, high, low, close, volume], ...]

def get_ticker(symbol: str) -> dict:
    """Get current ticker data."""
    ticker = exchange.fetch_ticker(symbol)
    return {
        'symbol': symbol,
        'bid': ticker['bid'],
        'ask': ticker['ask'],
        'last': ticker['last'],
        'volume': ticker['baseVolume'],
        'change_24h': ticker['percentage'],
    }

def get_order_book(symbol: str, depth: int = 10) -> dict:
    """Get order book depth."""
    book = exchange.fetch_order_book(symbol, limit=depth)
    return {
        'bids': book['bids'][:5],  # [price, amount]
        'asks': book['asks'][:5],
        'spread': book['asks'][0][0] - book['bids'][0][0],
    }
```

## Implementing a Simple Moving Average Strategy

The crossover of a short-term and long-term moving average is one of the most basic trading signals:

```python
import pandas as pd

def calculate_signals(ohlcv: list, short_window: int = 20, long_window: int = 50) -> pd.DataFrame:
    """Calculate SMA crossover signals."""
    df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
    df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
    df = df.set_index('timestamp')

    df['sma_short'] = df['close'].rolling(short_window).mean()
    df['sma_long'] = df['close'].rolling(long_window).mean()

    # Signal: 1 = buy, -1 = sell, 0 = hold
    df['signal'] = 0
    df.loc[df['sma_short'] > df['sma_long'], 'signal'] = 1
    df.loc[df['sma_short'] < df['sma_long'], 'signal'] = -1

    # Trade: only signal on crossover
    df['trade'] = df['signal'].diff()

    return df

def get_current_signal(symbol: str) -> str:
    ohlcv = get_ohlcv(symbol, '1h', 100)
    df = calculate_signals(ohlcv)
    last_trade = df['trade'].iloc[-1]

    if last_trade == 2:
        return 'BUY'    # Short crossed above long
    elif last_trade == -2:
        return 'SELL'   # Short crossed below long
    else:
        return 'HOLD'
```

## RSI Strategy

The Relative Strength Index measures momentum:

```python
def calculate_rsi(prices: pd.Series, period: int = 14) -> pd.Series:
    delta = prices.diff()
    gain = delta.clip(lower=0)
    loss = (-delta).clip(lower=0)

    avg_gain = gain.rolling(period).mean()
    avg_loss = loss.rolling(period).mean()

    rs = avg_gain / avg_loss.replace(0, float('inf'))
    rsi = 100 - (100 / (1 + rs))
    return rsi

def rsi_signal(symbol: str, oversold: int = 30, overbought: int = 70) -> str:
    ohlcv = get_ohlcv(symbol, '4h', 100)
    df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
    rsi = calculate_rsi(df['close'])
    current_rsi = rsi.iloc[-1]

    if current_rsi < oversold:
        return f'BUY (RSI: {current_rsi:.1f})'
    elif current_rsi > overbought:
        return f'SELL (RSI: {current_rsi:.1f})'
    else:
        return f'HOLD (RSI: {current_rsi:.1f})'
```

## Order Placement

```python
def place_market_order(symbol: str, side: str, amount: float) -> dict:
    """Place a market order. side = 'buy' or 'sell'."""
    try:
        order = exchange.create_market_order(symbol, side, amount)
        print(f"Order placed: {side} {amount} {symbol} at market price")
        return order
    except ccxt.InsufficientFunds as e:
        print(f"Insufficient funds: {e}")
        raise
    except ccxt.ExchangeError as e:
        print(f"Exchange error: {e}")
        raise

def place_limit_order(symbol: str, side: str, amount: float, price: float) -> dict:
    """Place a limit order at a specific price."""
    order = exchange.create_limit_order(symbol, side, amount, price)
    return order

def cancel_order(order_id: str, symbol: str) -> dict:
    """Cancel an open order."""
    return exchange.cancel_order(order_id, symbol)

def get_open_orders(symbol: str = None) -> list:
    """Get all open orders."""
    return exchange.fetch_open_orders(symbol)
```

## Risk Management

This is the most important part. A bot without risk controls will eventually lose everything:

```python
class RiskManager:
    def __init__(self, max_position_pct: float = 0.1, stop_loss_pct: float = 0.03):
        """
        max_position_pct: maximum % of portfolio in any single position
        stop_loss_pct: stop loss trigger (3% loss = exit)
        """
        self.max_position_pct = max_position_pct
        self.stop_loss_pct = stop_loss_pct
        self.positions: dict = {}

    def get_portfolio_value(self) -> float:
        balance = exchange.fetch_balance()
        return balance['USDT']['total']  # Assume USDT base

    def calculate_position_size(self, price: float) -> float:
        """Calculate safe position size based on portfolio."""
        portfolio_value = self.get_portfolio_value()
        max_usd = portfolio_value * self.max_position_pct
        return max_usd / price

    def check_stop_loss(self, symbol: str, current_price: float) -> bool:
        """Returns True if stop loss is triggered."""
        if symbol not in self.positions:
            return False

        entry_price = self.positions[symbol]['entry_price']
        loss_pct = (entry_price - current_price) / entry_price

        if loss_pct >= self.stop_loss_pct:
            print(f"STOP LOSS triggered for {symbol}: {loss_pct*100:.2f}% loss")
            return True
        return False

    def record_position(self, symbol: str, side: str, amount: float, price: float):
        self.positions[symbol] = {
            'side': side,
            'amount': amount,
            'entry_price': price,
            'entry_time': pd.Timestamp.now(),
        }
```

## The Main Bot Loop

```python
import time

class TradingBot:
    def __init__(self, symbol: str = 'BTC/USDT'):
        self.symbol = symbol
        self.risk = RiskManager(max_position_pct=0.05, stop_loss_pct=0.03)
        self.in_position = False
        self.running = False

    def run_once(self):
        """Execute one iteration of the bot loop."""
        ticker = get_ticker(self.symbol)
        current_price = ticker['last']

        # Check stop loss first
        if self.in_position and self.risk.check_stop_loss(self.symbol, current_price):
            amount = self.risk.positions[self.symbol]['amount']
            place_market_order(self.symbol, 'sell', amount)
            self.in_position = False
            return

        # Check strategy signal
        signal = get_current_signal(self.symbol)
        print(f"[{pd.Timestamp.now():%H:%M:%S}] {self.symbol}: ${current_price:.2f} | Signal: {signal}")

        if signal == 'BUY' and not self.in_position:
            amount = self.risk.calculate_position_size(current_price)
            order = place_market_order(self.symbol, 'buy', amount)
            self.risk.record_position(self.symbol, 'buy', amount, current_price)
            self.in_position = True

        elif signal == 'SELL' and self.in_position:
            amount = self.risk.positions[self.symbol]['amount']
            place_market_order(self.symbol, 'sell', amount)
            self.in_position = False

    def run(self, interval_seconds: int = 3600):
        self.running = True
        print(f"Bot started for {self.symbol}")
        while self.running:
            try:
                self.run_once()
            except Exception as e:
                print(f"Error: {e}")
            time.sleep(interval_seconds)

    def stop(self):
        self.running = False
```

## Backtesting Before Going Live

Never deploy a strategy without backtesting it on historical data:

```python
def backtest(ohlcv: list, initial_capital: float = 10000) -> dict:
    df = calculate_signals(ohlcv)
    df = df.dropna()

    capital = initial_capital
    position = 0
    trades = []

    for i, row in df.iterrows():
        if row['trade'] == 2 and position == 0:  # Buy signal
            position = capital / row['close']
            capital = 0
            trades.append({'type': 'buy', 'price': row['close'], 'time': i})

        elif row['trade'] == -2 and position > 0:  # Sell signal
            capital = position * row['close']
            trades.append({'type': 'sell', 'price': row['close'],
                          'time': i, 'pnl': capital - initial_capital})
            position = 0

    final_value = capital + (position * df['close'].iloc[-1] if position > 0 else 0)

    return {
        'initial_capital': initial_capital,
        'final_value': final_value,
        'return_pct': (final_value - initial_capital) / initial_capital * 100,
        'trades': len(trades),
    }
```

## Conclusion

Building a trading bot is one of the most educational programming projects in the crypto space. The skills you develop — data fetching, strategy design, risk management, and execution — transfer directly to professional quant development. Always start on testnet, backtest rigorously, and keep position sizes small when transitioning to live trading.
