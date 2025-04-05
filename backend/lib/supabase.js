// /lib/superbase.js
// import { createClient } from "@supabase/supabase-js";

// // Inisialisasi Supabase Client
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // URL Supabase
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // Anon Key Supabase
// const supabaseRoleKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey, supabaseRoleKey);

// export default supabase;
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default supabase;
