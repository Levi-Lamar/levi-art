import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Elements, 
  CardElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

// Load Stripe outside of components to avoid recreating on every render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, calculateTotal, clearCart } = useCart();
  const { user } = useAuth();
  
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Create payment intent on the server (mock implementation)
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: calculateTotal() * 100, // Convert to cents
          currency: 'usd'
        })
      });

      const { clientSecret } = await response.json();

      // Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user?.displayName || 'Anonymous',
            email: user?.email
          }
        }
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
      } else {
        // Payment successful - save order to Firestore
        await addDoc(collection(db, 'orders'), {
          userId: user?.uid,
          items: cart,
          total: calculateTotal(),
          paymentIntentId: result.paymentIntent.id,
          status: 'completed',
          createdAt: new Date()
        });

        setSuccess(true);
        clearCart();
        setProcessing(false);
      }
    } catch (err) {
      setError('Payment processing failed');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-dark-card p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-brand-orange">
        Payment Details
      </h2>

      <div className="mb-4">
        <CardElement 
          options={{
            style: {
              base: {
                color: '#ffffff',
                backgroundColor: '#000000',
                '::placeholder': {
                  color: '#aaaaaa'
                }
              },
              invalid: {
                color: '#ff5311'
              }
            }
          }}
        />
      </div>

      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="text-green-500 mb-4">
          Payment successful! Thank you for your purchase.
        </div>
      )}

      <button
        type="submit"
        disabled={processing || !stripe}
        className="w-full bg-brand-orange text-white p-3 rounded 
          hover:bg-orange-600 transition disabled:opacity-50"
      >
        {processing ? 'Processing...' : `Pay $${calculateTotal().toFixed(2)}`}
      </button>
    </form>
  );
};

const StripeCheckout = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default StripeCheckout;
