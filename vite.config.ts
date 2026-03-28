import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { Plugin } from 'vite'

function assertAnonKey(): Plugin {
  return {
    name: 'assert-anon-key',
    configResolved(config) {
      const key = config.env['VITE_SUPABASE_ANON_KEY'] ?? ''
      if (key.startsWith('sb_secret_')) {
        throw new Error(
          '[security] VITE_SUPABASE_ANON_KEY starts with "sb_secret_" — ' +
          'you are about to bundle a service role key into the client. ' +
          'Use the publishable anon key instead.'
        )
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), assertAnonKey()],
})
