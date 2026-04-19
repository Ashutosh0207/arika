import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
)

console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL) // debug

const { data, error } = await supabase.from('rooms').select('*')

console.log('Data:', data)
console.log('Error:', error)