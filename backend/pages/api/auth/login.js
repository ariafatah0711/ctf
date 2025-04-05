// // /pages/api/auth/login.js
// import bcrypt from "bcryptjs";
// import supabase from "../../../lib/supabase";
// import jwt from "jsonwebtoken"; // Untuk membuat JWT

// export default async function handler(req, res) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

//   if (req.method === "OPTIONS") {
//     return res.status(200).end();
//   }

//   if (req.method === "POST") {
//     const { username, password } = req.body;

//     // Validasi input
//     if (!username || !password) {
//       return res.status(400).json({ message: "Username and password are required." });
//     }

//     try {
//       // Ambil data pengguna dari Supabase
//       const { data: user, error } = await supabase.from("users").select("*").eq("username", username).single(); // Mengambil data pengguna berdasarkan username

//       if (error || !user) {
//         return res.status(400).json({ message: "Invalid credentials." });
//       }

//       // Cek password yang dimasukkan dengan password yang di-hash di database
//       const isMatch = await bcrypt.compare(password, user.password);

//       if (!isMatch) {
//         return res.status(400).json({ message: "Invalid credentials." });
//       }

//       // Membuat JWT token
//       const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, {
//         expiresIn: "1h", // Token valid selama 1 jam
//       });

//       // Kirimkan token sebagai respons
//       res.status(200).json({ message: "Login successful", token });
//     } catch (error) {
//       return res.status(500).json({ message: "Something went wrong.", error: error.message });
//     }
//   } else {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }
// }

// import supabase from "../../../lib/supabase"; // pakai service_role
import supabaseAdmin from "@/lib/supabaseAdmin";
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password wajib diisi." });
    }

    try {
      const { data, error } = await supabaseAdmin.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return res.status(401).json({ message: "Email atau password salah.", error: error.message });
      }

      return res.status(200).json({
        message: "Login berhasil",
        session: data.session, // berisi access_token, refresh_token
        user: data.user,
      });
    } catch (error) {
      return res.status(500).json({ message: "Terjadi kesalahan.", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
