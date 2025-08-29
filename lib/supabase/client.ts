import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://gousljuyeminzscozcxl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvdXNsanV5ZW1pbnpzY296Y3hsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NjgxOTgsImV4cCI6MjA3MjA0NDE5OH0.LUJv7MOAds7bj_r9GmV2ZJum3tQ3mj8Gv_qSoSkBuqc'
);
