import React, { useEffect, useState } from 'react';
import FileInput from './fileInput.jsx';
//@ts-ignore
import crypto from 'crypto-browserify';
import { uploadQRpng } from './uploadPng.js';
import { publicKeyInPemFormat } from '../data/public_key.json';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog.jsx';
import { Button } from './ui/button.jsx';
import CreditReport from './creditReport.jsx';

export default function Qr() {
  const [qrData, setQrData] = useState<any>(null);
  const [isValidSignature, setIsValidSignature] = useState(false);
  const [showCreditReportDialog, setShowCreditReportDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // remove signature from userDataSigned
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
    setIsLoading(false);
  };

  const handleGenerateProof = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  return (
    <div className="">
      <Dialog>
        <DialogTrigger onClick={handleReset}>
          <Button>Log in</Button>
        </DialogTrigger>
        <DialogContent>
          {showCreditReportDialog ? (
            <CreditReport qrData={qrData} />
          ) : (
            <DialogHeader>
              <DialogTitle>Upload Credit Report QR</DialogTitle>
              <DialogDescription>
                Upload your Credit report secure QR Code to verify signature and gnerate proof.
              </DialogDescription>
              <div className="">
                <FileInput
                  onChange={async e => {
                    const { qrValue } = await uploadQRpng(e);

                    if (qrValue === 'no_qr_found') {
                      alert('No QR code found. Please Upload a valid QR code.');
                      setQrData(null);
                      return;
                    } else {
                      const qrData = JSON.parse(qrValue);
                      // validate object schema
                      setQrData(qrData);
                    }
                  }}
                />
              </div>
              <div className="flex flex-col items-center gap-8">
                {qrData && (
                  <div
                    className={` p-2  shadow-md rounded-lg ${
                      isValidSignature ? 'bg-green-200  ' : 'bg-red-200 '
                    }`}
                  >
                    <p>
                      Digital Signature Verification{' '}
                      {isValidSignature ? 'successful ✅' : 'failed ❌'}
                    </p>
                  </div>
                )}
                {isValidSignature && (
                  <div>
                    <Button onClick={handleSeeCreditReport}>View your credit report</Button>
                  </div>
                )}
              </div>
            </DialogHeader>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
