#!/bin/bash

# Path to the JSON file
jsonFile="data/user_5_very_poor_signed.json"

# Parse the JSON file and stringify it
jsonString=$(jq -c . "$jsonFile")

# Generate QR code and save it in the data directory
qrencode -o data/user_5_qr.png "$jsonString"