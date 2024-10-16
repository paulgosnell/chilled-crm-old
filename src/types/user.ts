export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  industry: string;
  product_or_service: string;
  location: string;
  target_market: string;
  subscriptionPlan: 'free_trial' | 'standard' | 'pro' | null;
  trialEndsAt: string | null;
  additionalInfo?: string;
}

export interface User extends UserProfile {
  avatar?: string;
}