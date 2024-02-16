import React, { useEffect, useState } from 'react';
import FileInput from './fileInput.jsx';
//@ts-ignore
import crypto from 'crypto-browserify';
import { uploadQRpng } from './uploadPng.js';
import { publicKeyInPemFormat } from '../data/public_key.json';
import {
  Dialog, DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog.jsx';
import { Button } from './ui/button.jsx';

export default function Qr() {
  const [qrData, setQrData] = useState<any>(null);
  const [isValidSignature, setIsValidSignature] = useState(false);
  const [showCreditReportDialog, setShowCreditReportDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    // remove signature from userDataSigned
    console.log(qrData);
    if (!qrData) return;
    const testData = JSON.stringify(qrData.data);


    const publicKey = publicKeyInPemFormat; // Replace with your public key

    // console.log(privateKey);
    // console.log(publicKey);

    // Create a SHA256 hash of the test data
    const hash = crypto.createHash('sha256');
    hash.update(testData);
    const hashDigest = hash.digest();

    // Verify the signature with the public key
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(hashDigest);
    const isValid = verifier.verify(publicKey, qrData.signature, 'base64');

    setIsValidSignature(isValid);
  }, [qrData]);

  const handleSeeCreditReport = () => {
    setShowCreditReportDialog(true);
  };

  const handleReset = () => {
    // Reset states when the dialog is closed
    setQrData(null);
    setIsValidSignature(false);
    setShowCreditReportDialog(false);
    setIsLoading(false)
  };

  const handleGenerateProof = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  return (
    <div className='p-8'>
      <Dialog  >
        <DialogTrigger onClick={handleReset}>
          <Button>Upload Qr</Button>
        </DialogTrigger>
        <DialogContent >
          {isLoading ? (
            <DialogHeader>
              <div className='flex  flex-col items-center gap-2 absolute left-48 top-44'>
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-green-400"></div>
                <p> Generating Proof...</p>
              </div>
            </DialogHeader>
          ) :
            showCreditReportDialog ? (
              <DialogHeader>
                <DialogTitle>Your Credit Report</DialogTitle>
                <div className='p-2'>
                  <div className='flex justify-between'>
                    <p>{qrData.data.customer_name}</p>
                    <p>{qrData.data.customer_id}</p>
                  </div>
                  <div>
                    Credit Score:  {qrData.data.credit_score}
                  </div>
                  <div>
                    <p>Your Credit Activity</p>
                    <div>
                      Accounts
                      {qrData.data.accounts.account_number}
                    </div>
                  </div>
                  <div>
                    <p>Key Factors</p>
                    <div>
                      Credit Utilization: {qrData.data.credit_history.credit_utilization}
                    </div>
                    <div>
                      Credit Age: {qrData.data.credit_history.length_of_credit_history}
                    </div>
                    <div>
                      On-time Payments: {qrData.data.credit_history.payment_history.on_time_payments}
                    </div>
                  </div>
                </div>
                <div className='absolute bottom-10 right-40'>
                  <Button onClick={handleGenerateProof}>Generate Credit Proof</Button>
                </div>
              </DialogHeader>
            ) : (
              <DialogHeader >
                <DialogTitle>Upload Credit QR</DialogTitle>
                <DialogDescription>Upload your Credit secure QR Code to verify signature</DialogDescription>
                <div className='absolute left-28 top-24 '>
                  <FileInput
                    onChange={async e => {
                      const { qrValue } = await uploadQRpng(e);
                      const qrData = JSON.parse(qrValue);
                      setQrData(qrData);
                    }}
                  />
                </div>
                {qrData && (
                  <div className={`flex gap-1 absolute right-16 bottom-10 shadow-md p-4 rounded-lg ${isValidSignature ? 'bg-green-200 absolute right-16 bottom-10 ' : 'bg-red-200 '}`}>
                    <p> The signature is {isValidSignature ? 'valid ✅' : 'invalid ❌'}</p>
                  </div>
                )}
                {isValidSignature && (
                  <div className='absolute right-40 bottom-28'>
                    <Button onClick={handleSeeCreditReport}>View your credit report</Button>
                  </div>
                )}
              </DialogHeader>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
