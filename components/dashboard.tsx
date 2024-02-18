import { Separator } from '@radix-ui/react-separator';
import {
  BanknoteIcon,
  CreditCardIcon,
  HomeIcon,
  LineChartIcon,
  Link,
  ShoppingBagIcon,
  UsersIcon,
} from 'lucide-react';
import React from 'react';
import { Button } from './ui/button.jsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';

export default function Dashboard() {
  const userDataString = localStorage.getItem('user');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const category = userData?.category || '';

  return (
    <div className="p-4">
      <p className="text-center font-bold text-4xl text-slate-700">Finance Dashboard</p>
      <main className="flex-1 flex flex-col md:gap-8 md:p-6">
        <div className="grid gap-4 ">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <CreditCardIcon className="h-6 w-6" />
              <h2 className="font-semibold text-lg">Credit Score</h2>
            </div>
            {/* <Button size="sm">Improve my score</Button> */}
          </div>
          <Card>
            <CardContent className="flex items-center gap-4 py-4">
              <div className="flex-1">
                <div className="font-semibold py-2 text-2xl">
                  Your Credit Score Category :
                  <span
                    className={`text-4xl 
            ${category === 'good' || category === 'excellent' ? 'text-green-500' : ''}
            ${category === 'fair' ? 'text-yellow-500' : ''}
            ${category === 'poor' || category === 'verypoor' ? 'text-red-500' : ''}
        `}
                  >
                    {''} {category}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {category === 'good' || category === 'excellent'
                    ? "You're in the top tier of borrowers. You're likely to get the best rates and terms."
                    : category === 'fair'
                      ? "You're in the mid-range of borrowers. You might get decent rates, but they may not be the best."
                      : category === 'poor' || category === 'verypoor'
                        ? "You're in the lower tier of borrowers. You may face difficulty in getting credit and might receive higher interest rates."
                        : 'Your credit category is not recognized.'}
                </p>
              </div>

              <div className="flex-1">
                <h3 className="font-semibold">
                  {category === 'good' || category === 'excellent'
                    ? '750-850'
                    : category === 'fair'
                      ? '600-749'
                      : category === 'poor' || category === 'very poor'
                        ? '300-599'
                        : 'Unknown'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {category === 'good' || category === 'excellent'
                    ? 'The credit score range is 750-850. The higher the score, the better.'
                    : category === 'fair'
                      ? 'The credit score range is 600-749. A good score can make it easier to qualify for loans and better interest rates.'
                      : category === 'poor' || category === 'verypoor'
                        ? 'The credit score range is 300-599. A low score may indicate credit risk and may make it difficult to qualify for loans or obtain favorable interest rates.'
                        : 'Unknown'}
                </p>
              </div>

              <div className="w-[200px] ml-16">
                <BanknoteIcon size={80} color="#16a34a" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 pb-4">
          <div className="flex items-center gap-2">
            <ShoppingBagIcon className="h-6 w-6" />
            <h2 className="font-semibold text-lg">Financial Products</h2>
          </div>
          <Card>
            <CardContent className="p-2">
              <div>
                <div>
                  <div className="grid items-center gap-4 px-4 py-2 md:grid-cols-6">
                    <div className="text-sm font-medium">Platinum Credit Card</div>
                    <div className="hidden md:flex">Access exclusive benefits</div>
                    <div className="hidden md:flex">Credit Card</div>
                    <div className="hidden md:flex">$0 annual fee</div>
                    <div className="hidden md:flex">$0 foreign transaction fee</div>
                    <Button className="ml-auto" size="sm">
                      View
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="grid items-center gap-4 px-4 py-2 md:grid-cols-6">
                    <div className="text-sm font-medium">Personal Loan</div>
                    <div className="hidden md:flex">Borrow for any purpose</div>
                    <div className="hidden md:flex">Loan</div>
                    <div className="hidden md:flex">As low as 5.99% APR</div>
                    <div className="hidden md:flex">Flexible repayment terms</div>
                    <Button className="ml-auto" size="sm">
                      View
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="grid items-center gap-4 px-4 py-2 md:grid-cols-6">
                    <div className="text-sm font-medium">High-Yield Savings</div>
                    <div className="hidden md:flex">Grow your money faster</div>
                    <div className="hidden md:flex">Savings Account</div>
                    <div className="hidden md:flex">0.50% APY</div>
                    <div className="hidden md:flex">No minimum balance</div>
                    <Button className="ml-auto" size="sm">
                      View
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="grid items-center gap-4 px-4 py-2 md:grid-cols-6">
                    <div className="text-sm font-medium">Investment Portfolio</div>
                    <div className="hidden md:flex">Build wealth over time</div>
                    <div className="hidden md:flex">Investment Account</div>
                    <div className="hidden md:flex">Customized portfolio</div>
                    <div className="hidden md:flex">Expert advice</div>
                    <Button className="ml-auto" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      {/* <footer className="flex items-center h-14 border-t gap-4 px-8 dark:border-gray-800 ">
        <div className="flex items-center gap-2 text-sm font-medium shrink-0">
          <HomeIcon className="h-4 w-4" />
          Home
        </div>
        <div className="flex items-center gap-2 text-sm font-medium shrink-0">
          <ShoppingBagIcon className="h-4 w-4" />
          Products
        </div>
        <div className="flex items-center gap-2 text-sm font-medium shrink-0">
          <UsersIcon className="h-4 w-4" />
          Customers
        </div>
        <div className="flex items-center gap-2 text-sm font-medium shrink-0">
          <LineChartIcon className="h-4 w-4" />
          Analytics
        </div>
      </footer> */}
    </div>
  );
}
