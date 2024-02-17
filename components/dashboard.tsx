import { Separator } from '@radix-ui/react-separator';
import { Link, ShoppingBagIcon } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button.jsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';

export default function Dashboard() {
    const userDataString = localStorage.getItem('user');
    const userData = userDataString ? JSON.parse(userDataString) : null;
    const category = userData?.category || '';

    return (
        <div className='px-4'>
            <main className="flex flex-1 flex-col gap-4 p-8 md:gap-8 md:p-6">
                <div className='flex flex-col items-center'>
                    <div className='text-3xl pb-1'>Your Credit Score Category :
                        <span className={`
        ${category === 'good' || category === 'excellent' ? 'text-green-500' : ''}
        ${category === 'fair' ? 'text-yellow-500' : ''}
        ${category === 'poor' || category === 'very poor' ? 'text-red-500' : ''}
    `}>
                            {""}   {category}
                        </span>

                    </div>
                    <div>Check below financial products</div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card className='bg-slate-50'>
                        <CardHeader>
                            <CardTitle>Financial Products</CardTitle>
                            <CardDescription>Explore and purchase financial products</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <Card>
                                    <CardContent className="flex items-center gap-4">
                                        <img
                                            alt="Product image"
                                            className="rounded-lg aspect-square object-cover"
                                            height="80"
                                            src="/placeholder.svg"
                                            width="80"
                                        />
                                        <div className="grid gap-1 text-sm">
                                            <div className="font-semibold">Savings Account</div>
                                            <div>High-interest savings account</div>
                                            <Button size="sm">View details</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="flex items-center gap-4">
                                        <img
                                            alt="Product image"
                                            className="rounded-lg aspect-square object-cover"
                                            height="80"
                                            src="/placeholder.svg"
                                            width="80"
                                        />
                                        <div className="grid gap-1 text-sm">
                                            <div className="font-semibold">Credit Card</div>
                                            <div>Low APR credit card from ABC</div>
                                            <Button size="sm">View details</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="flex items-center gap-4">
                                        <img
                                            alt="Product image"
                                            className="rounded-lg aspect-square object-cover"
                                            height="80"
                                            src="/placeholder.svg"
                                            width="80"
                                        />
                                        <div className="grid gap-1 text-sm">
                                            <div className="font-semibold">Personal Loan</div>
                                            <div>Flexible personal loan options</div>
                                            <Button size="sm">View details</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className='bg-slate-50'>
                        <CardHeader>
                            <CardTitle>Recent Transactions</CardTitle>
                            <CardDescription>View your recent transactions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                <div className="flex items-center gap-4 shadow-md px-2 rounded-lg bg-white py-1 hover:shadow-lg transition duration-300">
                                    <ShoppingBagIcon className="h-6 w-6" />
                                    <div className="grid gap-1 text-sm">
                                        <div className="font-semibold">Online Purchase</div>
                                        <div>Amazon.com</div>
                                    </div>
                                    <div className="ml-auto font-semibold">$49.99</div>
                                </div>
                                <Separator />
                                <div className="flex items-center gap-4 shadow-md px-2 rounded-lg bg-white py-1 hover:shadow-lg transition duration-300">
                                    <ShoppingBagIcon className="h-6 w-6" />
                                    <div className="grid gap-1 text-sm">
                                        <div className="font-semibold">Online Purchase</div>
                                        <div>Apple.com</div>
                                    </div>
                                    <div className="ml-auto font-semibold">$999.00</div>
                                </div>
                                <Separator />
                                <div className="flex items-center gap-4 shadow-md px-2 rounded-lg bg-white py-1 hover:shadow-lg transition duration-300">
                                    <ShoppingBagIcon className="h-6 w-6" />
                                    <div className="grid gap-1 text-sm">
                                        <div className="font-semibold">Online Purchase</div>
                                        <div>Walmart.com</div>
                                    </div>
                                    <div className="ml-auto font-semibold">$199.00</div>
                                </div>
                                <Separator />
                                <div className="flex items-center gap-4 shadow-md px-2 rounded-lg bg-white py-1 hover:shadow-lg transition duration-300">
                                    <ShoppingBagIcon className="h-6 w-6" />
                                    <div className="grid gap-1 text-sm">
                                        <div className="font-semibold">Online Purchase</div>
                                        <div>Bestbuy.com</div>
                                    </div>
                                    <div className="ml-auto font-semibold">$299.00</div>
                                </div>
                                <Separator />

                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
