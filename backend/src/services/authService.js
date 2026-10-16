import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Client-side supabase client (for operations that don't need admin privileges)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client (bypasses RLS, used for creating users during signup)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

/**
 * Sign up a new user with email and password.
 * Auto-confirms the email (no confirmation flow) so the user can log in immediately.
 */
export async function signup({ email, password }) {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) throw error;
  if (!data.user) throw new Error('Failed to create user');

  return {
    id: data.user.id,
    email: data.user.email,
  };
}

/**
 * Log in a user with email and password.
 * Returns the user and session (including access_token).
 */
export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  if (!data.user || !data.session) throw new Error('Login failed');

  return {
    user: {
      id: data.user.id,
      email: data.user.email,
    },
    session: {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in,
    },
  };
}

/**
 * Verify a Supabase JWT (access token) and return the authenticated user.
 * Used by the auth middleware in jwt mode.
 */
export async function getUserFromToken(accessToken) {
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user) throw new Error('Invalid or expired token');

  return {
    id: data.user.id,
    email: data.user.email,
  };
}