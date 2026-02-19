import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
    console.error('Missing VITE_STRIPE_PUBLISHABLE_KEY environment variable');
}

export const stripePromise = loadStripe(stripePublishableKey || '');

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
