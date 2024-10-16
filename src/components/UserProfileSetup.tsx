import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/types/user';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/components/ui/use-toast";

interface UserProfileSetupProps {
  onComplete: (profile: UserProfile | null) => void;
}

const UserProfileSetup: React.FC<UserProfileSetupProps> = ({ onComplete }) => {
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    name: '',
    email: '',
    role: '',
    company: '',
    industry: '',
    product_or_service: '',
    location: '',
    target_market: '',
    subscription_plan: null,
    trial_ends_at: null,
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setProfile(prev => ({ ...prev, id: user.id, email: user.email || '' }));
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('users')
        .upsert({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          company: profile.company,
          industry: profile.industry,
          product_or_service: profile.product_or_service,
          location: profile.location,
          target_market: profile.target_market,
          // Set default subscription plan and trial end date
          subscription_plan: 'free_trial',
          trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });

      onComplete(data);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSkip = () => {
    onComplete(null);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-primary text-primary-foreground flex flex-col items-center justify-center p-8">
        <img 
          src="https://chilledcrm.com/assets/images/image07.png" 
          alt="ChilledCRM Logo" 
          className="h-24 w-auto mb-8"
        />
        <h2 className="text-3xl font-bold mb-4">Welcome to ChilledCRM</h2>
        <p className="text-xl text-center mb-6">
          Let's set up your profile to get the most out of your ChilledCRM experience.
        </p>
        <p className="text-lg text-center">
          Providing more information helps us tailor the CRM to your specific needs and industry.
        </p>
      </div>

      <div className="w-1/2 bg-background flex items-center justify-center overflow-y-auto">
        <Card className="w-[450px] max-w-[90%]">
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={profile.name} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input id="role" name="role" value={profile.role} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input id="company" name="company" value={profile.company} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input id="industry" name="industry" value={profile.industry} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="product_or_service">Product or Service</Label>
                <Input id="product_or_service" name="product_or_service" value={profile.product_or_service} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" value={profile.location} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="target_market">Target Market</Label>
                <Input id="target_market" name="target_market" value={profile.target_market} onChange={handleChange} required />
              </div>
              <div className="flex justify-between">
                <Button type="submit">Complete Profile</Button>
                <Button type="button" variant="outline" onClick={handleSkip}>Skip for Now</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfileSetup;