// Simple script to test Supabase authentication
import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase URL and anon key
const supabaseUrl = 'https://skprqfkoweseejunbymx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrcHJxZmtvd2VzZWVqdW5ieW14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMzk5NTAsImV4cCI6MjA1OTYxNTk1MH0.NTppuKdLpEodXoOgXIBIiIsQuXrqXpCueY-jFs0NexE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSignUp() {
  console.log('Testing sign up...');
  
  // Use a valid email format
  const testEmail = `test${Math.floor(Math.random() * 10000)}@gmail.com`;
  const testPassword = 'Password123!';
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });
    
    if (error) {
      console.error('Sign up error:', error.message);
    } else {
      console.log('Sign up successful!');
      console.log('User data:', data);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testSignUp();
