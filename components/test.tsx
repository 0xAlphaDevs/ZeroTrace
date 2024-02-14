// import React, { useEffect, useState } from 'react';
// import crypto from 'crypto-browserify';
// import { publicKeyInPemFormat } from '../data/public_key.json';
// import { privateKeyInPemFormat } from '../data/private_key.json';
// import userDataSigned from '../data/user_5_very_poor_signed.json';

// function SignAndVerify() {
//   const [isValidSignature, setIsValidSignature] = useState(false);

//   useEffect(() => {
//     // remove signature from userDataSigned
//     console.log(userDataSigned);
//     const testData = JSON.stringify(userDataSigned.data);

//     const privateKey = privateKeyInPemFormat; // Replace with your private key
//     const publicKey = publicKeyInPemFormat; // Replace with your public key

//     // console.log(privateKey);
//     // console.log(publicKey);

//     // Create a SHA256 hash of the test data
//     const hash = crypto.createHash('sha256');
//     hash.update(testData);
//     const hashDigest = hash.digest();

//     // console.log(hashDigest);

//     // Sign the hash with the private key
//     const signer = crypto.createSign('RSA-SHA256');
//     signer.update(hashDigest);
//     const signature = signer.sign(privateKey, 'base64');

//     console.log(signature);

//     // Verify the signature with the public key
//     const verifier = crypto.createVerify('RSA-SHA256');
//     verifier.update(hashDigest);
//     const isValid = verifier.verify(publicKey, userDataSigned.signature, 'base64');

//     setIsValidSignature(isValid);
//   }, []);

//   return (
//     <div>
//       <h1>Signature Verification</h1>
//       <p>The signature is {isValidSignature ? 'valid 🟢' : 'invalid ❌'}</p>
//     </div>
//   );
// }

// export default SignAndVerify;
