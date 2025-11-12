const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_SERVER, process.env.SUPABASE_KEY);

module.exports = supabase;
