import React, { useEffect, useState } from 'react';
import FileInput from './fileInput.jsx';
//@ts-ignore
import crypto from 'crypto-browserify';
import { uploadQRpng } from './uploadPng.js';
import { publicKeyInPemFormat } from '../data/public_key.json';
import {
  Dialog, DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog.jsx';
import { Button } from './ui/button.jsx';

export default function Qr() {
  const [qrData, setQrData] = useState<any>(null);
  const [isValidSignature, setIsValidSignature] = useState(false);
  const [showCreditReportDialog, setShowCreditReportDialog] = useState(false);

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

  return (
    <div className='p-8'>
      <Dialog>
        <DialogTrigger>
          <Button>Upload Qr</Button>
        </DialogTrigger>
        <DialogContent>
          {showCreditReportDialog ? (
            <DialogHeader>
              <DialogTitle>Your Credit Report</DialogTitle>
              <DialogDescription>
                {/* Display your QR data here */}
                <p>{qrData.data.customer_name}</p>
              </DialogDescription>
              <DialogFooter>
                <Button>Generate Credit Proof</Button>
              </DialogFooter>
            </DialogHeader>
          ) : (
            <DialogHeader>
              <DialogTitle>Upload your Credit secure QR Code:</DialogTitle>
              <DialogDescription>
                <FileInput
                  onChange={async e => {
                    const { qrValue } = await uploadQRpng(e);
                    const qrData = JSON.parse(qrValue);
                    setQrData(qrData);
                  }}
                />
              </DialogDescription>
              <DialogFooter>
                <h1>Signature Verification</h1>
                <p>The signature is {isValidSignature ? 'valid 🟢' : 'invalid ❌'}</p>
                {isValidSignature && (
                  <Button onClick={handleSeeCreditReport}>See your credit report</Button>
                )}
              </DialogFooter>
            </DialogHeader>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
