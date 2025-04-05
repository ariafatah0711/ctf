import Swal from "sweetalert2";

const GlobalSwal = Swal.mixin({
  inputAttributes: {
    autocomplete: "off", // Menonaktifkan autocomplete
    spellcheck: "false", // Menonaktifkan pemeriksaan ejaan (bisa membantu untuk menghindari saran)
  },
  didOpen: () => {
    document.body.style.overflow = "hidden";
  },
  willClose: () => {
    document.body.style.overflow = "auto";
  },
});

export default GlobalSwal;