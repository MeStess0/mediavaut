// src/hooks/useAuth.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(data || null);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const authUser = session?.user ?? null;
      setUser(authUser);
      if (authUser) fetchProfile(authUser.id);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const authUser = session?.user ?? null;
      setUser(authUser);
      if (authUser) fetchProfile(authUser.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error };

    // Insert profile row into users table
    const { error: profileError } = await supabase
      .from("users")
      .insert({ id: data.user.id, username, email });

    if (profileError) return { error: profileError };
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { user, profile, loading, signIn, signUp, signOut } },
    children,
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
