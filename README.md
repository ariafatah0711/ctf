# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

# fe
```bash
npm create vite@latest ctf_web --template vue

cd ctf_web
npm install

npm run dev

npm install tailwindcss @tailwindcss/vite
### vite.config.ts
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
###

### style.css
@import "tailwindcss";
```

# be
```bash
npx create-next-app@latest backend
√ Would you like to use TypeScript? ... No
√ Would you like to use ESLint? ... No
√ Would you like to use Tailwind CSS? ... No 
√ Would you like your code inside a `src/` directory? ... No 
√ Would you like to use App Router? (recommended) ... Yes
√ Would you like to use Turbopack for `next dev`? ... Yes
√ Would you like to customize the import alias (`@/*` by default)? ... No 

cd backend
npm install jsonwebtoken bcryptjs

npm install @supabase/supabase-js
```

- [https://supabase.com/docs/guides/local-development/cli/getting-started?queryGroups=platform&platform=windows](https://supabase.com/docs/guides/local-development/cli/getting-started?queryGroups=platform&platform=windows)
```bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# setup
supabase init
# before start active this Expose daemon on tcp://localhost:2375 without TLS
# in docker destkop
supabase start

# cara 1
supabase stop
supabase start
supabase db reset
supabase login
supabase link --project-ref jikyaltqopjdjkqxhpuu
# supabase migration new init-schema
# supabase db dump -f supabase/migrations/backup_schema.sql --db-url "postgresql://postgres:[PASSWORD]@db.jikyaltqopjdjkqxhpuu.supabase.co:5432/postgres"
supabase db pull
supabase db push --local

# migrasi cloud to local
supabase login
# supabase link --project-ref jikyaltqopjdjkqxhpuu
supabase link --project-ref svejrujgvlahkuheumcy
supabase db pull
# if have the error migration u can repair
# like this supabase migration repair --status reverted 20250403210126
supabase db push --local

# migrasi lokal ke cloud
supabase migration new init
supabase db diff --local --file init.sql
supabase db push

# migrasi ke 2
# supabase migration new test_update
supabase db diff --local --file test_update
supabase db push
```