Make sure you have Node.js (v18 or later) installed.

1) Install Dependencies using below command
  - npm install
2) Run the Development Server 
  - npm run dev
3) Open in Browser
  - http://localhost:3000


FYI
1) Card Number Validation
  - The card number is validated using the Luhn Algorithm.
  - This ensures that the entered card number is structurally valid before allowing   submission.

2) Card Type Detection
  - Card type is determined based on the BIN (Bank Identification Number) prefixes:

    Visa
     - Starts with 4 → returns "visa"
    American Express (Amex)
     - Starts with 34 or 37 → returns "amex"
    Mastercard
     - Starts with 51–55
     - Starts with 2221–2720 (newer Mastercard range)

3) Retry / Attempt Logic
    - Users can retry a failed or timed-out payment up to 3 times
    - Each retry increments the attempt count
    - The UI displays the current attempt: