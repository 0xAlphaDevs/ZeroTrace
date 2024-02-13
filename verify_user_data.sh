#!/bin/bash

# Step 1: Extract the signature from the signed JSON file and decode it from Base64 format
signature_base64=$(jq -r '.signature' data/user_1_signed_data.json)
echo $signature_base64 | openssl base64 -d -out signature

# Remove the signature from the signed JSON
jq 'del(.signature)' data/user_1_signed_data.json > data.json

# Step 2: Create a SHA256 hash of the original JSON data
openssl dgst -sha256 -binary data.json > hash

# Step 3: Verify the hash using the public key and the decoded signature
openssl pkeyutl -verify -pubin -inkey public_key.pem -sigfile signature -in hash

# Clean up
rm hash signature data.json