import Swal from 'sweetalert2'

export const swalSuccess = (
  title: string = 'Berhasil!',
  text: string = '',
  timer: number = 1500
) => {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    timer,
    showConfirmButton: false,
  })
}

export const swalError = (
  title: string = 'Gagal!',
  text: string = '',
  timer: number = 2000
) => {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    timer,
    showConfirmButton: false,
  })
}

export const swalAlert = (
  title: string,
  text: string,
  icon: 'success' | 'error' | 'warning' | 'info'
) => {
  return Swal.fire({
    icon,
    title,
    text,
    showConfirmButton: true,
  })
}
