import Swal from 'sweetalert2'

export const swalToast = (
  title: string,
  icon: 'success' | 'error' | 'info' | 'warning' = 'success',
  timer = 2000
) => {
  return Swal.fire({
    toast: true,
    position: 'top-end',
    icon,
    title,
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
    showCloseButton: false,
  })
}