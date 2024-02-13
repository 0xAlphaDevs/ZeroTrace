#!/bin/bash

# Step 1: Create a SHA256 hash of the JSON file
openssl dgst -sha256 -binary data/user_1.json > hash

# Step 2: Sign the hash with the private key
openssl pkeyutl -sign -inkey private_key.pem -in hash -out signature

# Add the Base64-encoded signature to the original JSON in one step
jq --arg signature "$(openssl base64 -in signature)" '. + {signature: $signature}' data/user_1.json > data/user_1_signed_data.json

# Clean up
rm hash signature