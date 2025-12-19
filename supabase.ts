
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ibvxqgjjdggayhsjmdqp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlidnhxZ2pqZGdnYXloc2ptZHFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwOTU2MTQsImV4cCI6MjA4MTY3MTYxNH0.xF13SwG0V6uy836_6yUe0LM2WrQOjr6P-B0ifQQWdaI';

export const supabase = createClient(supabaseUrl, supabaseKey);
