// Dynamic import — @supabase/ssr throws at import time if env vars look invalid
// This lazy approach ensures the module is only loaded when credentials are real

function isValidConfig(url: string | undefined, key: string | undefined): boolean {
  if (!url || !key) return false
  if (url.includes('your-')) return false
  if (key.includes('your-') || key.length < 20) return false
  return true
}

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!isValidConfig(supabaseUrl, supabaseKey)) {
    return null
  }

  const { createBrowserClient } = await import('@supabase/ssr')
  return createBrowserClient(supabaseUrl, supabaseKey)
}
