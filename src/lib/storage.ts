import { createClient } from '@/lib/supabase/client'

type StorageProvider = 'supabase' | 'cloudinary' | 'r2'

interface UploadResult {
  url: string
  provider: StorageProvider
  publicId?: string
}

interface StorageConfig {
  provider: StorageProvider
  folder: string
  maxWidth?: number
  quality?: number
}

const DEFAULT_CONFIG: StorageConfig = {
  provider: 'supabase',
  folder: 'uploads',
  maxWidth: 1920,
  quality: 85,
}

export class StorageService {
  private async getSupabase() {
    return await createClient()
  }

  private async uploadToSupabase(file: File, path: string): Promise<UploadResult> {
    const supabase = await this.getSupabase()
    if (!supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase.storage
      .from('postall-assets')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) throw new Error(`Supabase upload failed: ${error.message}`)

    const { data: { publicUrl } } = supabase.storage
      .from('postall-assets')
      .getPublicUrl(data.path)

    return { url: publicUrl, provider: 'supabase', publicId: data.path }
  }

  private async uploadToCloudinary(file: File, folder: string): Promise<UploadResult> {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    if (!cloudName || cloudName.includes('your-')) throw new Error('Cloudinary not configured')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'postall-uploads')
    formData.append('folder', folder)

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: formData }
    )

    const data = await response.json()
    if (!response.ok) throw new Error(`Cloudinary upload failed: ${data.error?.message}`)

    return { url: data.secure_url, provider: 'cloudinary', publicId: data.public_id }
  }

  private async uploadToR2(file: File, path: string): Promise<UploadResult> {
    const r2PublicUrl = process.env.R2_PUBLIC_URL
    if (!r2PublicUrl || r2PublicUrl.includes('your-')) throw new Error('R2 not configured')

    const workerUrl = `${r2PublicUrl.replace(/\/$/, '')}/api/upload`
    const formData = new FormData()
    formData.append('file', file)
    formData.append('path', path)

    const response = await fetch(workerUrl, { method: 'POST', body: formData })
    const data = await response.json()
    if (!response.ok) throw new Error(`R2 upload failed: ${data.error}`)

    return { url: data.url, provider: 'r2', publicId: path }
  }

  async upload(file: File, filename: string, config: Partial<StorageConfig> = {}): Promise<UploadResult> {
    const cfg = { ...DEFAULT_CONFIG, ...config }
    const ext = file.name.split('.').pop() || 'jpg'
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const path = `${cfg.folder}/${timestamp}_${randomStr}.${ext}`

    try {
      if (cfg.provider === 'supabase') {
        try {
          return await this.uploadToSupabase(file, path)
        } catch {
          return await this.uploadToCloudinary(file, cfg.folder)
        }
      } else if (cfg.provider === 'cloudinary') {
        try {
          return await this.uploadToCloudinary(file, cfg.folder)
        } catch {
          return await this.uploadToR2(file, path)
        }
      } else {
        return await this.uploadToR2(file, path)
      }
    } catch {
      throw new Error('Failed to upload file. Please try again.')
    }
  }

  async uploadMultiple(files: File[], folder: string, config: Partial<StorageConfig> = {}): Promise<UploadResult[]> {
    return Promise.all(
      files.map((file, i) => this.upload(file, `file_${i}`, { ...config, folder }))
    )
  }

  async delete(provider: StorageProvider, publicId: string): Promise<void> {
    try {
      if (provider === 'supabase') {
        const supabase = await this.getSupabase()
        if (supabase) await supabase.storage.from('postall-assets').remove([publicId])
      }
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }
}

export const storage = new StorageService()
