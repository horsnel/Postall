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

  const { createServerClient } = await import('@supabase/ssr')
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Server Component — ignore
        }
      },
    },
  })
}
