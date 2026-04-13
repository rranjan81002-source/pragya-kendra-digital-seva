import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qwcekipuwjltepotbtrl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_eyZ_2s0q1UU45i8XVxfJBw_9ZVa4Qnb';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
