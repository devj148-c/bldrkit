import Stripe from 'stripe'

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null

export const PLANS = {
  FREE: { name: 'Free', price: 0, features: ['1 user', '50 customers', 'Basic features'] },
  PRO: { name: 'Pro', price: 49, features: ['5 users', 'Unlimited customers', 'All modules', 'Email support'] },
  BUSINESS: { name: 'Business', price: 99, features: ['25 users', 'Unlimited everything', 'Priority support', 'API access'] },
  SCALE: { name: 'Scale', price: 249, features: ['Unlimited users', 'White-label', 'Dedicated support', 'Custom integrations'] },
} as const
