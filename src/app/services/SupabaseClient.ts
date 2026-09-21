import { createClient } from '@supabase/supabase-js';
import { environment } from '../environments/enviroments';

export const supabase = createClient(environment.supabaseUrl, environment.supabasePublishableKey);