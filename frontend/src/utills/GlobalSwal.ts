import Swal from "sweetalert2";

const GlobalSwal = Swal.mixin({
  inputAttributes: {
    autocomplete: "off", // Menonaktifkan autocomplete
    spellcheck: "false", // Menonaktifkan pemeriksaan ejaan (bisa membantu untuk menghindari saran)
  },
  didOpen: () => {
    document.body.style.overflow = "hidden";

    const theme = localStorage.getItem("theme")
    if (theme === "dark") {
      document.querySelector(".swal2-popup")?.classList.add("swal2-dark")
    }
  },
  willClose: () => {
    document.body.style.overflow = "auto";
  },
});

export default GlobalSwal;