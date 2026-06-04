'use client';

import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { IconArrowLeft, IconHome, IconBuildingSkyscraper, IconWallet, IconCalculator } from '@tabler/icons-react';
import { useUserStore } from '@/stores/useUserStore';
import Link from 'next/link';
import { formatCurrency } from '@/lib/formatCurrency';

import dynamic from 'next/dynamic';
const BarChart = dynamic(() => import('recharts').then((mod) => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then((mod) => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then((mod) => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false });
const Legend = dynamic(() => import('recharts').then((mod) => mod.Legend), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false });

export default function RentVsBuyPage() {
  const { currency } = useUserStore();

  // Down Payment Planner
  const [homePrice, setHomePrice] = useState<number>(5000000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [currentSavings, setCurrentSavings] = useState<number>(200000);
  const [monthlySavings, setMonthlySavings] = useState<number>(25000);
  
  // Rent vs Buy Comparison
  const [mortgageRate, setMortgageRate] = useState<number>(8.5);
  const [loanTerm, setLoanTerm] = useState<number>(20);
  const [propertyTax, setPropertyTax] = useState<number>(1);
  const [homeAppreciation, setHomeAppreciation] = useState<number>(5);
  
  const [currentRent, setCurrentRent] = useState<number>(20000);
  const [rentAppreciation, setRentAppreciation] = useState<number>(5);
  const [investmentReturn, setInvestmentReturn] = useState<number>(10);

  const [hasCalculated, setHasCalculated] = useState(false);
  const [monthsToDownPayment, setMonthsToDownPayment] = useState<number>(0);
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [buyNetWorth, setBuyNetWorth] = useState<number>(0);
  const [rentNetWorth, setRentNetWorth] = useState<number>(0);

  const calculate = () => {
    // 1. Down Payment Planning
    const requiredDownPayment = homePrice * (downPaymentPercent / 100);
    const shortfall = Math.max(0, requiredDownPayment - currentSavings);
    const monthsNeeded = monthlySavings > 0 ? Math.ceil(shortfall / monthlySavings) : 0;
    setMonthsToDownPayment(monthsNeeded);

    // 2. Rent vs Buy 10-Year Simulation
    const loanAmount = homePrice - requiredDownPayment;
    const monthlyRate = mortgageRate / 100 / 12;
    const numPayments = loanTerm * 12;
    const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    let currentHomeValue = homePrice;
    let currentLoanBalance = loanAmount;
    
    let currentRentCost = currentRent;
    // Renter invests the down payment + any difference in monthly cash flow
    let renterPortfolio = requiredDownPayment; // We assume they start with the down payment saved

    const data = [];
    
    for (let year = 1; year <= 10; year++) {
      // BUYER
      let annualPropertyTax = currentHomeValue * (propertyTax / 100);
      let annualMaintenance = currentHomeValue * 0.01; // 1% maintenance
      
      let interestPaidThisYear = 0;
      let principalPaidThisYear = 0;
      
      for (let m = 0; m < 12; m++) {
        let interest = currentLoanBalance * monthlyRate;
        let principal = emi - interest;
        interestPaidThisYear += interest;
        principalPaidThisYear += principal;
        currentLoanBalance -= principal;
      }
      
      currentHomeValue *= (1 + homeAppreciation / 100);
      let buyerNetWorth = currentHomeValue - currentLoanBalance;
      
      // RENTER
      let annualRentPaid = 0;
      for (let m = 0; m < 12; m++) {
        annualRentPaid += currentRentCost;
        
        // Difference in cash flow
        let monthlyBuyerCost = emi + (annualPropertyTax / 12) + (annualMaintenance / 12);
        let monthlyDifference = monthlyBuyerCost - currentRentCost;
        
        // Renter invests the difference if buyer cost is higher, or withdraws if rent is higher
        renterPortfolio = renterPortfolio * (1 + (investmentReturn / 100 / 12)) + monthlyDifference;
      }
      
      currentRentCost *= (1 + rentAppreciation / 100);
      
      data.push({
        year,
        "Buyer Net Worth": Math.round(buyerNetWorth),
        "Renter Net Worth": Math.round(renterPortfolio)
      });
    }

    setComparisonData(data);
    setBuyNetWorth(data[data.length - 1]["Buyer Net Worth"]);
    setRentNetWorth(data[data.length - 1]["Renter Net Worth"]);
    setHasCalculated(true);
  };

  const downPaymentAmount = homePrice * (downPaymentPercent / 100);

  return (
    <PageLayout>
      <Container className="pb-12 max-w-6xl">
        <div className="py-4 mb-2 flex items-center">
          <Link href="/learn" className="text-brand-text-secondary hover:text-brand-primary flex items-center gap-2 font-medium text-sm transition-colors">
            <IconArrowLeft size={16} /> Back to Learn
          </Link>
        </div>
        <div className="mb-8 flex flex-col items-center text-center">
          <h1 className="text-h2 font-bold mb-4 text-brand-text-primary">Rent vs Buy & Down Payment Planner</h1>
          <p className="text-body text-brand-text-secondary max-w-2xl">
            Plan your down payment savings goal and compare the long-term financial impact of buying a home versus continuing to rent.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-1 flex flex-col gap-6">
            <Card variant="elevated" className="p-6">
              <div className="flex items-center gap-2 mb-4 border-b border-brand-border pb-3">
                <IconWallet className="text-brand-primary" />
                <h3 className="text-h4 font-semibold text-brand-text-primary">Down Payment</h3>
              </div>
              <div className="flex flex-col gap-4">
                <Input label="Target Home Price" type="number" value={homePrice} onChange={(e) => setHomePrice(Number(e.target.value))} />
                <Input label={`Down Payment (%) = ${formatCurrency(downPaymentAmount, currency)}`} type="number" value={downPaymentPercent} onChange={(e) => setDownPaymentPercent(Number(e.target.value))} />
                <Input label="Current Savings" type="number" value={currentSavings} onChange={(e) => setCurrentSavings(Number(e.target.value))} />
                <Input label="Monthly Savings Dedicated" type="number" value={monthlySavings} onChange={(e) => setMonthlySavings(Number(e.target.value))} />
              </div>
            </Card>

            <Card variant="elevated" className="p-6">
              <div className="flex items-center gap-2 mb-4 border-b border-brand-border pb-3">
                <IconHome className="text-blue-500" />
                <h3 className="text-h4 font-semibold text-brand-text-primary">Buying Details</h3>
              </div>
              <div className="flex flex-col gap-4">
                <Input label="Mortgage Rate (%)" type="number" value={mortgageRate} onChange={(e) => setMortgageRate(Number(e.target.value))} />
                <Input label="Loan Term (Years)" type="number" value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))} />
                <Input label="Property Tax (%)" type="number" value={propertyTax} onChange={(e) => setPropertyTax(Number(e.target.value))} />
                <Input label="Home Appreciation (%)" type="number" value={homeAppreciation} onChange={(e) => setHomeAppreciation(Number(e.target.value))} />
              </div>
            </Card>

            <Card variant="elevated" className="p-6">
              <div className="flex items-center gap-2 mb-4 border-b border-brand-border pb-3">
                <IconBuildingSkyscraper className="text-purple-500" />
                <h3 className="text-h4 font-semibold text-brand-text-primary">Renting Details</h3>
              </div>
              <div className="flex flex-col gap-4">
                <Input label="Current Monthly Rent" type="number" value={currentRent} onChange={(e) => setCurrentRent(Number(e.target.value))} />
                <Input label="Annual Rent Increase (%)" type="number" value={rentAppreciation} onChange={(e) => setRentAppreciation(Number(e.target.value))} />
                <Input label="Investment Return (%)" type="number" value={investmentReturn} onChange={(e) => setInvestmentReturn(Number(e.target.value))} />
              </div>
            </Card>

            <Button onClick={calculate} variant="primary" size="lg" className="w-full" icon={<IconCalculator size={20} />}>
              Calculate Comparison
            </Button>
          </div>

          <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
            {hasCalculated ? (
              <>
                <Card variant="elevated" className="p-6 bg-brand-primary/5 border-brand-primary/20">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-brand-primary/20 text-brand-primary rounded-xl">
                      <IconWallet size={28} />
                    </div>
                    <div>
                      <h3 className="text-h4 font-semibold text-brand-text-primary mb-2">Down Payment Goal</h3>
                      {monthsToDownPayment > 0 ? (
                        <p className="text-brand-text-secondary">
                          At your current savings rate, it will take you <strong className="text-brand-text-primary">{Math.floor(monthsToDownPayment / 12)} years and {monthsToDownPayment % 12} months</strong> to save the remaining <strong>{formatCurrency(downPaymentAmount - currentSavings, currency)}</strong> needed for your down payment.
                        </p>
                      ) : (
                        <p className="text-brand-text-secondary">
                          Congratulations! You already have enough saved for your <strong>{formatCurrency(downPaymentAmount, currency)}</strong> down payment.
                        </p>
                      )}
                    </div>
                  </div>
                </Card>

                <Card variant="elevated" className="p-6 flex-1 flex flex-col">
                  <h3 className="text-h4 font-semibold text-brand-text-primary mb-2">10-Year Net Worth Comparison</h3>
                  <p className="text-sm text-brand-text-secondary mb-6">
                    If you bought the home vs. if you rented and invested your down payment plus any monthly cashflow differences.
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-brand-surface p-4 rounded-xl border border-brand-border">
                      <p className="text-xs text-brand-text-secondary mb-1">Net Worth if Buying</p>
                      <p className="text-xl font-bold text-blue-500">{formatCurrency(buyNetWorth, currency)}</p>
                    </div>
                    <div className="bg-brand-surface p-4 rounded-xl border border-brand-border">
                      <p className="text-xs text-brand-text-secondary mb-1">Net Worth if Renting</p>
                      <p className="text-xl font-bold text-purple-500">{formatCurrency(rentNetWorth, currency)}</p>
                    </div>
                  </div>

                  <div className="flex-1 min-h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                        <XAxis 
                          dataKey="year" 
                          tickFormatter={(val) => `Year ${val}`}
                          stroke="#9ca3af"
                          fontSize={12}
                        />
                        <YAxis 
                          tickFormatter={(val) => `${(val / 100000).toFixed(0)}L`}
                          stroke="#9ca3af"
                          fontSize={12}
                        />
                        <Tooltip 
                          formatter={(value: any) => formatCurrency(Number(value) || 0, currency)}
                          labelFormatter={(label) => `Year ${label}`}
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend verticalAlign="top" height={36}/>
                        <Bar dataKey="Buyer Net Worth" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Renter Net Worth" fill="#A855F7" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-6 p-4 bg-brand-surface border border-brand-border rounded-xl">
                    <h4 className="font-semibold mb-2">The Verdict</h4>
                    <p className="text-sm text-brand-text-secondary">
                      Over 10 years, <strong>{buyNetWorth > rentNetWorth ? 'Buying' : 'Renting'}</strong> comes out ahead by <strong>{formatCurrency(Math.abs(buyNetWorth - rentNetWorth), currency)}</strong>. 
                      Remember that buying a home is also a lifestyle choice, not just a financial one!
                    </p>
                  </div>
                </Card>
              </>
            ) : (
              <Card variant="elevated" className="h-full flex flex-col items-center justify-center p-12 text-center text-brand-text-tertiary">
                <IconCalculator size={64} className="mb-4 opacity-20" />
                <h3 className="text-h5 font-semibold text-brand-text-secondary mb-2">Awaiting Calculation</h3>
                <p className="text-sm max-w-sm">
                  Enter your details to calculate your down payment timeline and compare buying vs. renting.
                </p>
              </Card>
            )}
          </div>
        </div>
      </Container>
    </PageLayout>
  );
}
