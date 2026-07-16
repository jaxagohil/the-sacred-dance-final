import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";


const supabaseUrl = 'https://ezhqfbedncqrajfhsqhp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6aHFmYmVkbmNxcmFqZmhzcWhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NDUwNDEsImV4cCI6MjA5MjEyMTA0MX0.UJjb9unXptezk8NcpVKsP6PJvnObibRCCoGR-PUMe8o';

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
auth: {
  storage: AsyncStorage,
  persistSession: true,
  autoRefreshToken: true,
  detectSessionInUrl: false,
}
  }
);