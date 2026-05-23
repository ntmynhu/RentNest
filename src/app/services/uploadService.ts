import api from './api'

export interface UploadResult {
  url: string
  publicId: string
}

export const uploadService = {
  /**
   * Upload một ảnh lên Cloudinary qua BE
   * @param file - File ảnh từ input[type=file]
   * @returns URL công khai của ảnh trên Cloudinary
   */
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('image', file)

    const res = await api.post<{ metaData: UploadResult }>('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.metaData.url
  },

  /**
   * Upload nhiều ảnh cùng lúc
   * @param files - Danh sách file ảnh
   * @returns Mảng URL công khai
   */
  async uploadImages(files: File[]): Promise<string[]> {
    const formData = new FormData()
    files.forEach(f => formData.append('images', f))

    const res = await api.post<{ metaData: UploadResult[] }>('/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.metaData.map(r => r.url)
  },
}
