import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://mlmvbsemzfgpbhmjvcmr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sbXZic2VtemZncGJobWp2Y21yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMTg3MjgsImV4cCI6MjA3MTg5NDcyOH0.o4selb7fcwJqXZRjWD-hhG3JwG8_KahPHw7-uADUkkA'
);
