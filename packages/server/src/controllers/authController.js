import { supabase } from '../config/supabase';

export const register = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ message: 'User registered successfully', data });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ message: 'User logged in successfully', data });
};
