import { createClient } from "@supabase/supabase-js";
import supabase from "../config/supabase.js";

const authClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
);

function formatUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.name ?? "",
  };
}

export async function signup({ name, email, password }) {
  const { data, error } = await authClient.auth.signUp({
    email,
    password,
    options: {
      data: { name: name ?? "" },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    user: data.user ? formatUser(data.user) : null,
    requiresEmailConfirmation: !data.session,
  };
}

export async function login({ email, password }) {
  const { data, error } = await authClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    user: formatUser(data.user),
  };
}
