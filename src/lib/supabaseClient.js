import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dpyyhyfreqpohrlnnzms.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRweXloeWZyZXFwb2hybG5uem1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1Njc5MjgsImV4cCI6MjEwNzE0MzkyOH0.IJz_L1swV2u1qOMzOKef03fskmgogeG1MPOQ7-L2TkY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
