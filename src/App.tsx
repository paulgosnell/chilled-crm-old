import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { UserProfile } from './types/user';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Contacts from './components/Contacts';
import Companies from './components/Companies';
import Deals from './components/Deals';
import Tasks from './components/Tasks';
import SubscriptionPage from './components/SubscriptionPage';
import UserProfileSetup from './components/UserProfileSetup';
import UserProfileUpdate from './components/UserProfileUpdate';
import Help from './components/Help';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './components/HomePage';
import { supabase } from './lib/supabase';

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
    } else {
      setUserProfile(data);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            {!session ? (
              <Route path="*" element={<Navigate to="/" replace />} />
            ) : !userProfile ? (
              <Route
                path="/profile-setup"
                element={<UserProfileSetup onComplete={setUserProfile} />}
              />
            ) : (
              <Route element={<Layout userProfile={userProfile} />}>
                <Route path="/dashboard" element={<Dashboard userProfile={userProfile} />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/deals" element={<Deals />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/subscription" element={<SubscriptionPage />} />
                <Route path="/profile" element={<UserProfileUpdate userProfile={userProfile} onUpdate={setUserProfile} />} />
                <Route path="/help" element={<Help />} />
              </Route>
            )}
            <Route path="*" element={<Navigate to={session ? "/dashboard" : "/"} replace />} />
          </Routes>
          <Toaster />
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;