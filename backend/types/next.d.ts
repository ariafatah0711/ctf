import type { User } from "@supabase/supabase-js";

declare module "next" {
  interface NextApiRequest {
    user?: User;
  }
}