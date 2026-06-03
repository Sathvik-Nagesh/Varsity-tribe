'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconBuildingBank, IconTrendingUp, IconChartPie, IconSparkles, IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { useUserStore } from '@/stores/useUserStore';
import { Button, Card } from '@/components/ui';
import { PageLayout } from '@/components/layout/PageLayout';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/formatCurrency';

export default function InvestmentSandboxPage() {
  const router = useRouter();
  const { addXP, currency } = useUserStore();
  
  const [completed, setCompleted] = useState(false);
  const [balance, setBalance] = useState(10000);
  const [portfolio, setPortfolio] = useState({ stocks: 0, bonds: 0, crypto: 0 });
  const [marketYear, setMarketYear] = useState(0);

  const marketConditions = [
    { year: 1, type: "Bull Market", stockReturn: 0.15, bondReturn: 0.04, cryptoReturn: 0.50 },
    { year: 2, type: "Correction", stockReturn: -0.10, bondReturn: 0.05, cryptoReturn: -0.30 },
    { year: 3, type: "Recovery", stockReturn: 0.12, bondReturn: 0.03, cryptoReturn: 0.20 },
    { year: 4, type: "Bear Market", stockReturn: -0.20, bondReturn: 0.06, cryptoReturn: -0.60 },
    { year: 5, type: "Boom", stockReturn: 0.25, bondReturn: 0.02, cryptoReturn: 1.00 },
  ];

  const totalPortfolioValue = portfolio.stocks + portfolio.bonds + portfolio.crypto;

  const handleInvest = (asset: keyof typeof portfolio, amount: number) => {
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      setPortfolio(prev => ({ ...prev, [asset]: prev[asset] + amount }));
    }
  };

  const simulateYear = () => {
    if (marketYear < marketConditions.length) {
      const condition = marketConditions[marketYear];
      
      setPortfolio(prev => ({
        stocks: prev.stocks * (1 + condition.stockReturn),
        bonds: prev.bonds * (1 + condition.bondReturn),
        crypto: prev.crypto * (1 + condition.cryptoReturn),
      }));
      
      setMarketYear(marketYear + 1);
    } else {
      setCompleted(true);
      addXP(500); // 500 XP for completing the simulator
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 pb-12 max-w-5xl">
        <div className="py-4 mb-2 flex items-center">
          <Link href="/learn" className="text-slate-500 hover:text-slate-800 flex items-center gap-2 font-medium text-sm transition-colors">
            <IconArrowLeft size={16} /> Back to Learn
          </Link>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <IconBuildingBank className="text-cyan-500" size={32} />
            Investment Sandbox
          </h1>
          <p className="text-slate-600 mt-2">Build a portfolio with {formatCurrency(10000, currency)} and test it across 5 years of historical market cycles.</p>
        </div>

        {!completed ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6 bg-white border-cyan-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <IconChartPie className="text-cyan-500" />
                    Your Portfolio (Year {marketYear} of 5)
                  </h2>
                  <div className="text-right">
                    <div className="text-sm text-slate-500">Cash Available</div>
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(balance, currency)}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'stocks', name: 'Stocks (S&P 500)', color: 'bg-blue-500', risk: 'Medium' },
                    { key: 'bonds', name: 'Bonds (US Treasury)', color: 'bg-slate-500', risk: 'Low' },
                    { key: 'crypto', name: 'Crypto (Bitcoin)', color: 'bg-orange-500', risk: 'High' }
                  ].map(asset => (
                    <div key={asset.key} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="mb-4 sm:mb-0">
                        <div className="font-semibold text-slate-800">{asset.name}</div>
                        <div className="text-sm text-slate-500">Risk: {asset.risk} | Value: <span className="font-bold text-slate-900">{formatCurrency(portfolio[asset.key as keyof typeof portfolio], currency)}</span></div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleInvest(asset.key as keyof typeof portfolio, 500)}
                          disabled={balance < 500 || marketYear > 0}
                          className="px-3 py-1 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          + {formatCurrency(500, currency)}
                        </button>
                        <button 
                          onClick={() => handleInvest(asset.key as keyof typeof portfolio, 1000)}
                          disabled={balance < 1000 || marketYear > 0}
                          className="px-3 py-1 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          + {formatCurrency(1000, currency)}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {marketYear > 0 && marketYear < 5 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="font-bold text-blue-900 mb-1">Market Update: {marketConditions[marketYear - 1].type}</div>
                  <div className="text-sm text-blue-800">
                    Stocks: {(marketConditions[marketYear - 1].stockReturn * 100).toFixed(0)}% | 
                    Bonds: {(marketConditions[marketYear - 1].bondReturn * 100).toFixed(0)}% | 
                    Crypto: {(marketConditions[marketYear - 1].cryptoReturn * 100).toFixed(0)}%
                  </div>
                </motion.div>
              )}
            </div>

            <div className="space-y-6">
              <Card className="p-6 bg-slate-900 text-white shadow-xl">
                <h3 className="text-lg font-semibold text-slate-300 mb-2">Total Net Worth</h3>
                <div className="text-4xl font-bold mb-6">{formatCurrency(balance + totalPortfolioValue, currency)}</div>
                
                <div className="space-y-2 mb-8 text-sm">
                  <div className="flex justify-between border-b border-slate-700 pb-2">
                    <span className="text-slate-400">Initial</span>
                    <span>{formatCurrency(10000, currency)}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-400">Total Return</span>
                    <span className={(balance + totalPortfolioValue) >= 10000 ? 'text-green-400' : 'text-red-400'}>
                      {(((balance + totalPortfolioValue - 10000) / 10000) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>

                <Button 
                  variant="primary" 
                  className="w-full py-4 text-lg"
                  onClick={simulateYear}
                >
                  {marketYear === 0 ? 'Start Simulation' : marketYear < 5 ? `Simulate Year ${marketYear + 1}` : 'Finish'}
                </Button>
              </Card>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center pb-12 bg-white rounded-2xl shadow-xl border border-slate-200 p-8 max-w-2xl mx-auto"
          >
            <div className="mx-auto w-20 h-20 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mb-6">
              <IconTrendingUp size={40} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Simulation Complete!</h2>
            <p className="text-slate-600 mb-2">Final Net Worth:</p>
            <p className={`text-5xl font-bold mb-8 ${(balance + totalPortfolioValue) >= 10000 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(balance + totalPortfolioValue, currency)}
            </p>
            
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8 max-w-sm mx-auto flex items-center justify-center gap-4">
              <IconSparkles className="text-blue-500" size={32} />
              <div className="text-left">
                <div className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Reward</div>
                <div className="text-2xl font-bold text-blue-900">+500 XP</div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button variant="secondary" onClick={() => router.push('/learn')}>
                Back to Learn
              </Button>
              <Button variant="primary" onClick={() => window.location.reload()}>
                Play Again
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
}
