import { NextRequest, NextResponse } from 'next/server';

interface BacktestRequest {
  strategy: string;
  asset: string;
  start_date: string;
  end_date: string;
  initial_capital: number;
  parameters: Record<string, number>;
}

interface BacktestResult {
  strategy: string;
  asset: string;
  period: { start: string; end: string };
  metrics: {
    total_return: number;
    annualized_return: number;
    sharpe_ratio: number;
    max_drawdown: number;
    win_rate: number;
    total_trades: number;
    profit_factor: number;
  };
  trades: {
    date: string;
    action: 'buy' | 'sell';
    price: number;
    size: number;
    pnl?: number;
  }[];
  equity_curve: { date: string; value: number }[];
}

export async function POST(request: NextRequest) {
  try {
    const body: BacktestRequest = await request.json();
    
    const { strategy, asset, start_date, end_date, initial_capital = 10000, parameters } = body;
    
    if (!strategy || !asset || !start_date || !end_date) {
      return NextResponse.json({ 
        error: 'Required: strategy, asset, start_date, end_date' 
      }, { status: 400 });
    }

    // Simulate backtest results (in production, this would use historical data)
    const daysBetween = Math.ceil(
      (new Date(end_date).getTime() - new Date(start_date).getTime()) / (1000 * 60 * 60 * 24)
    );

    const trades: BacktestResult['trades'] = [];
    const equity_curve: BacktestResult['equity_curve'] = [];
    let capital = initial_capital;
    let position = 0;
    let wins = 0;
    let losses = 0;
    let totalPnl = 0;
    let grossProfit = 0;
    let grossLoss = 0;
    let maxEquity = initial_capital;
    let maxDrawdown = 0;

    // Simulate trading over the period
    const startDate = new Date(start_date);
    for (let i = 0; i < daysBetween; i += 7) { // Weekly trades
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      // Simulated price based on random walk
      const basePrice = 50000 * (1 + (Math.random() - 0.45) * 0.1);
      
      if (position === 0 && Math.random() > 0.5) {
        // Enter position
        position = capital / basePrice;
        trades.push({ date: dateStr, action: 'buy', price: basePrice, size: position });
      } else if (position > 0 && Math.random() > 0.6) {
        // Exit position
        const pnl = (basePrice - (trades[trades.length - 1]?.price || basePrice)) * position;
        capital += pnl;
        totalPnl += pnl;
        
        if (pnl > 0) {
          wins++;
          grossProfit += pnl;
        } else {
          losses++;
          grossLoss += Math.abs(pnl);
        }
        
        trades.push({ date: dateStr, action: 'sell', price: basePrice, size: position, pnl });
        position = 0;
      }
      
      // Track equity
      const currentEquity = capital + (position * basePrice);
      equity_curve.push({ date: dateStr, value: currentEquity });
      
      if (currentEquity > maxEquity) maxEquity = currentEquity;
      const drawdown = (maxEquity - currentEquity) / maxEquity;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    }

    const totalTrades = wins + losses;
    const totalReturn = ((capital - initial_capital) / initial_capital) * 100;
    const annualizedReturn = totalReturn * (365 / daysBetween);
    const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0;
    
    // Simplified Sharpe (assuming risk-free rate of 2%)
    const avgReturn = totalReturn / (daysBetween / 30);
    const sharpeRatio = avgReturn > 0 ? (avgReturn - 0.17) / 5 : 0; // Rough approximation

    const result: BacktestResult = {
      strategy,
      asset,
      period: { start: start_date, end: end_date },
      metrics: {
        total_return: Math.round(totalReturn * 100) / 100,
        annualized_return: Math.round(annualizedReturn * 100) / 100,
        sharpe_ratio: Math.round(sharpeRatio * 100) / 100,
        max_drawdown: Math.round(maxDrawdown * 10000) / 100,
        win_rate: Math.round(winRate * 100) / 100,
        total_trades: totalTrades,
        profit_factor: Math.round(profitFactor * 100) / 100
      },
      trades: trades.slice(-50),
      equity_curve: equity_curve.filter((_, i) => i % Math.max(1, Math.floor(equity_curve.length / 100)) === 0)
    };

    return NextResponse.json({
      result,
      parameters_used: parameters || {},
      disclaimer: 'Backtesting results are simulated and do not guarantee future performance.'
    });
  } catch (error) {
    console.error('Backtest error:', error);
    return NextResponse.json({ error: 'Backtest failed' }, { status: 500 });
  }
}
