# Levi.art - Personal Art Business Website

## Project Overview
Levi.art is a full-featured personal art business website with e-commerce functionality, allowing users to browse artwork, request commissions, and purchase merchandise.

## Tech Stack
- Frontend: React.js with Next.js
- Styling: Tailwind CSS
- State Management: React Context
- Payment Integrations: Stripe, PayPal, M-Pesa
- Backend (Optional): Firebase

## Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- VS Code
- Stripe, PayPal, and M-Pesa API credentials

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/levi-art.git
cd levi-art
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Variables
Create a `.env.local` file in the project root with the following variables:
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
```

### 4. Run Development Server
```bash
npm run dev
# or
yarn dev
```

### 5. Build for Production
```bash
npm run build
# or
yarn build
```

## Troubleshooting
- Ensure all API credentials are correctly configured
- Check console for any error messages
- Verify Node.js and npm are up to date

## Deployment
- Recommended platforms: Vercel, Netlify
- Follow platform-specific deployment guides

## Features
- Responsive dark-themed design
- Art gallery with filtering
- Commission request system
- Merchandise shop
- Multiple payment options
- Contact form

## License
[Your License Here - e.g., MIT]
