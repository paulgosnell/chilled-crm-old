import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/profile-setup`
        }
      });
      if (error) throw error;
      toast({
        title: "Magic link sent",
        description: "Check your email for the login link.",
      });
    } catch (error: any) {
      console.error('Error sending magic link:', error);
      let errorMessage = "Failed to send magic link. Please try again.";
      if (error.message) {
        errorMessage = error.message;
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-primary text-white flex flex-col items-center justify-center p-8">
        <img 
          src="https://chilledcrm.com/assets/images/image02.png" 
          alt="Chilled CRM" 
          className="h-24 w-auto mb-8"
        />
        <h2 className="text-3xl font-bold mb-4">Welcome to Chilled CRM</h2>
        <p className="text-xl text-center mb-6">
          Streamline your customer relationships with our intuitive and powerful CRM solution.
        </p>
        <p className="text-lg text-center">
          Sign up now using our secure magic link system and start managing your business more effectively today!
        </p>
      </div>

      <div className="w-1/2 bg-background flex items-center justify-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Login to Chilled CRM</CardTitle>
            <CardDescription>Enter your email to receive a magic link</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button 
                className="w-full mt-4 bg-primary text-white hover:bg-primary/90" 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Magic Link'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;