import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = `https://fwswsapiofwadheatzvq.supabase.co`
const SUPABASE_KEY = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3c3dzYXBpb2Z3YWRoZWF0enZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1NjMxNDIsImV4cCI6MjA1MzEzOTE0Mn0.-vzrMx_M0nANqd2CIylPjGJoUybk_2NFwApuZIZqIpE`



// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_KEY;



export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
