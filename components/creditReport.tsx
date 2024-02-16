import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog.jsx';
import { Button } from './ui/button.jsx';

const CreditReport = ({ qrData }: any) => {
  const handleGenerateProof = () => {
    console.log('Generating proof');
  };
  return (
    <>
      <DialogHeader>
        <DialogTitle>Hi, {qrData.data.customer_name}</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col justify-between items-center">
        {/* Credit score */}
        <div className="flex flex-col items-center">
          <p className="text-xl font-semibold">Your Credit Score is</p>
          <p className="text-4xl font-extrabold "> {qrData.data.credit_score}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 w-full">
          {/* Key Factors*/}
          <div className="mt-2 w-full text-center">
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-xl font-semibold">Key Factors</p>
              <p className="text-sm font-thin mb-2">affecting your score</p>

              <div>
                <div className="flex justify-between p-2">
                  <div className="flex flex-col text-left">
                    <p className="text-lg font-medium text-green-600">On-time payments</p>
                    <p className="font-thin">
                      impact - <span className="font-bold">high</span>{' '}
                    </p>
                  </div>

                  <p className="font-bold text-green-600 text-2xl">
                    {qrData.data.credit_history.payment_history.on_time_payments}
                  </p>
                </div>

                <div className="flex justify-between p-2">
                  <div className="flex flex-col text-left">
                    <p className="text-lg font-medium ">Late payments</p>
                    <p className="font-thin">
                      impact - <span className="font-bold">high</span>{' '}
                    </p>
                  </div>
                  <p className="font-bold  text-2xl">
                    {qrData.data.credit_history.payment_history.late_payments}
                  </p>
                </div>

                <div className="flex justify-between p-2">
                  <div className="flex flex-col text-left">
                    <p className="text-lg font-medium text-red-600">On-time payments</p>
                    <p className="font-thin">
                      impact - <span className="font-bold">high</span>{' '}
                    </p>
                  </div>
                  <p className="font-bold text-red-500 text-lg">
                    {qrData.data.credit_history.payment_history.missed_payments}
                  </p>
                </div>

                <div className="flex justify-between p-2">
                  <div className="flex flex-col text-left">
                    <p className="text-lg font-medium text-green-600">On-time payments</p>
                    <p className="font-thin">
                      impact - <span className="font-bold">high</span>{' '}
                    </p>
                  </div>

                  <p className="font-bold text-green-600 text-2xl">
                    {qrData.data.credit_history.payment_history.on_time_payments}
                  </p>
                </div>

                <div className="flex justify-between p-2">
                  <div className="flex flex-col text-left">
                    <p className="text-lg font-medium ">Late payments</p>
                    <p className="font-thin">
                      impact - <span className="font-bold">high</span>{' '}
                    </p>
                  </div>
                  <p className="font-bold  text-2xl">
                    {qrData.data.credit_history.payment_history.late_payments}
                  </p>
                </div>

                <div className="flex justify-between p-2">
                  <div className="flex flex-col text-left">
                    <p className="text-lg font-medium text-red-600">On-time payments</p>
                    <p className="font-thin">
                      impact - <span className="font-bold">high</span>{' '}
                    </p>
                  </div>
                  <p className="font-bold text-red-500 text-lg">
                    {qrData.data.credit_history.payment_history.missed_payments}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className=" gap-12 w-full">
            <div className="mt-2 w-full">
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-xl font-semibold">Accounts</p>
                <p className="text-sm font-thin mb-2">your active accounts</p>
                <div className="w-full">
                  <div>
                    <div className="flex justify-between">
                      <p className="text-lg font-medium text-green-600">On-time payments</p>
                      <p className="font-bold text-green-600 text-lg">
                        {qrData.data.credit_history.payment_history.on_time_payments}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <p className="text-lg font-medium ">Late payments</p>
                      <p className="font-bold  text-lg">
                        {qrData.data.credit_history.payment_history.late_payments}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <p className="text-lg font-medium text-red-500">Missed payments</p>
                      <p className="font-bold text-red-500 text-lg">
                        {qrData.data.credit_history.payment_history.missed_payments}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2 w-full">
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-xl font-semibold">Credit Activity</p>
                <p className="text-sm font-thin mb-2">your recent credit activity</p>
                <div className=" w-full">
                  <div>
                    <div className="flex justify-between">
                      <p className="text-lg font-medium text-green-600">On-time payments</p>
                      <p className="font-bold text-green-600 text-lg">
                        {qrData.data.credit_history.payment_history.on_time_payments}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <p className="text-lg font-medium text-green-600">On-time payments</p>
                      <p className="font-bold text-green-600 text-lg">
                        {qrData.data.credit_history.payment_history.on_time_payments}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <p className="text-lg font-medium text-green-600">On-time payments</p>
                      <p className="font-bold text-green-600 text-lg">
                        {qrData.data.credit_history.payment_history.on_time_payments}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <p className="text-lg font-medium ">Late payments</p>
                      <p className="font-bold  text-lg">
                        {qrData.data.credit_history.payment_history.late_payments}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <p className="text-lg font-medium text-red-500">Missed payments</p>
                      <p className="font-bold text-red-500 text-lg">
                        {qrData.data.credit_history.payment_history.missed_payments}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2">
          <Button onClick={handleGenerateProof}>Generate Credit Score Proof</Button>
        </div>
      </div>
    </>
  );
};

export default CreditReport;
