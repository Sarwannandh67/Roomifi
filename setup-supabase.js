import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or key. Please check your .env file.');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('Setting up Supabase database for Roomi AI Harmony...');
    
    // Read the SQL migration file
    const sqlPath = path.join(__dirname, 'supabase', 'migrations', '20250407_create_messages_table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = sql
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    // Execute each statement
    for (const statement of statements) {
      console.log(`Executing: ${statement.substring(0, 50)}...`);
      const { error } = await supabase.rpc('exec_sql', { query: statement + ';' });
      
      if (error) {
        console.error('Error executing SQL:', error);
      }
    }
    
    console.log('Database setup complete!');
    
    // Create a default room for testing
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .insert({
        name: 'Roommate Chat',
        description: 'General chat for all roommates'
      })
      .select()
      .single();
    
    if (roomError) {
      console.error('Error creating default room:', roomError);
    } else {
      console.log('Created default room:', room);
    }
    
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

setupDatabase();
