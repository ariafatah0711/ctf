import GlobalSwal from "./GlobalSwal";
const Swal = GlobalSwal;

// 🔹 Success simple
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
  });
};

// 🔹 Error simple
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
  });
};

// 🔹 Alert (default info)
export const swalAlert = (
  title: string,
  text: string,
  icon: 'success' | 'error' | 'warning' | 'info' = 'info',
  confirmText: string = 'OK'
) => {
  return Swal.fire({
    icon,
    title,
    text,
    showConfirmButton: true,
    confirmButtonText: confirmText,
  });
};

// 🔹 Confirm dialog
export const swalConfirm = (
  title: string = 'Yakin?',
  text: string = 'Tindakan ini tidak bisa dibatalkan.',
  confirmText: string = 'Ya, lanjutkan!',
  cancelText: string = 'Batal'
) => {
  return Swal.fire({
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });
};

// 🔹 Loading dialog (perlu di-close manual)
export const swalLoading = (
  title: string = 'Memproses...',
  text: string = 'Mohon tunggu sebentar.'
) => {
  return Swal.fire({
    title,
    text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

// 🔹 Input prompt
export const swalPrompt = async (
  title: string = 'Masukkan sesuatu',
  inputLabel: string = '',
  placeholder: string = '',
  confirmText: string = 'Kirim'
) => {
  const { value } = await Swal.fire({
    title,
    input: 'text',
    inputLabel,
    inputPlaceholder: placeholder,
    showCancelButton: true,
    confirmButtonText: confirmText,
  });

  return value;
};

// 🔹 Toast (pojok kanan atas)
export const swalToast = (
  title: string,
  icon: 'success' | 'error' | 'warning' | 'info' = 'success',
  timer: number = 1500
) => {
  return Swal.fire({
    toast: true,
    position: 'top-end',
    icon,
    title,
    showConfirmButton: false,
    timer,
  });
};

// 🔹 Big Info Dialog
export const swalBigInfo = (
  title: string,
  htmlContent: string
) => {
  return Swal.fire({
    icon: 'info',
    title,
    html: htmlContent,
    showCloseButton: true,
    confirmButtonText: 'Mengerti',
    width: '600px',
  });
};
