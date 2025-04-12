import GlobalSwal from "./GlobalSwal";
const Swal = GlobalSwal;

export const swal = {
  success: (title = 'Berhasil!', text = '', timer = 1500) =>
    Swal.fire({ icon: 'success', title, text, timer, showConfirmButton: false }),

  error: (title = 'Gagal!', text = '', timer = 2000) =>
    Swal.fire({ icon: 'error', title, text, timer, showConfirmButton: false }),

  alert: (title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info' = 'info', confirmText: string = 'OK') =>
    Swal.fire({ icon, title, text, showConfirmButton: true, confirmButtonText: confirmText }),

  confirm: (title: string = 'Yakin?', text: string = 'Tindakan ini tidak bisa dibatalkan.', confirmText: string = 'Ya, lanjutkan!', cancelText: string = 'Batal') =>
    Swal.fire({ icon: 'warning', title, text, showCancelButton: true, confirmButtonText: confirmText, cancelButtonText: cancelText }),

  loading: (title: string = 'Memproses...', text: string = 'Mohon tunggu sebentar.') =>
    Swal.fire({ title, text, allowOutsideClick: false, allowEscapeKey: false, didOpen: () => Swal.showLoading() }),

  prompt: async (title = 'Masukkan sesuatu', inputLabel = '', placeholder = '', confirmText = 'Kirim') => {
    const { value } = await Swal.fire({ title, input: 'text', inputLabel, inputPlaceholder: placeholder, showCancelButton: true, confirmButtonText: confirmText })
    return value
  },

  toast: (title: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success', timer: number = 1500) =>
    Swal.fire({ toast: true, position: 'top-end', icon, title, showConfirmButton: false, timer }),

  bigInfo: (title: string, htmlContent: string) =>
    Swal.fire({ icon: 'info', title, html: htmlContent, showCloseButton: true, confirmButtonText: 'Mengerti', width: '600px' })
}