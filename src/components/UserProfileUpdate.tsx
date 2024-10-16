import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/types/user';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/components/ui/use-toast";

interface UserProfileUpdateProps {
  userProfile: UserProfile;
  onUpdate: (updatedProfile: UserProfile) => void;
}

const UserProfileUpdate: React.FC<UserProfileUpdateProps> = ({ userProfile, onUpdate }) => {
  const [profile, setProfile] = useState<UserProfile>({
    ...userProfile,
    additionalInfo: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchAdditionalInfo = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('additional_info')
        .eq('id', userProfile.id)
        .single();

      if (error) {
        console.error('Error fetching additional info:', error);
      } else if (data) {
        setProfile(prev => ({ ...prev, additionalInfo: data.additional_info || '' }));
      }
    };

    fetchAdditionalInfo();
  }, [userProfile.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          name: profile.name,
          role: profile.role,
          company: profile.company,
          industry: profile.industry,
          product_or_service: profile.product_or_service,
          location: profile.location,
          target_market: profile.target_market,
          additional_info: profile.additionalInfo,
        })
        .eq('id', profile.id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });

      onUpdate(data);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Your Profile</CardTitle>
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
          <div>
            <Label htmlFor="additionalInfo">Additional Information</Label>
            <Textarea 
              id="additionalInfo" 
              name="additionalInfo" 
              value={profile.additionalInfo} 
              onChange={handleChange}
              placeholder="Provide any additional information that might help the AI create better insights for your CRM"
              rows={4}
            />
          </div>
          <Button type="submit">Update Profile</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserProfileUpdate;