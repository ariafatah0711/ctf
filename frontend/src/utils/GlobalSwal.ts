import Swal from "sweetalert2";
import config from "../config/env";

const GlobalSwal = Swal.mixin({
  inputAttributes: {
    autocomplete: "off", // Menonaktifkan autocomplete
    spellcheck: "false", // Menonaktifkan pemeriksaan ejaan (bisa membantu untuk menghindari saran)
  },
  didOpen: () => {
    document.body.style.overflow = "hidden";

    // Cek theme di localStorage, jika tidak ada, set default ke "dark"
    const theme = localStorage.getItem("theme_") || config.DEFAULT_THEME; // Pakai nilai dari config atau dark kalau nggak ada
    if (theme === "dark") {
      document.querySelector(".swal2-popup")?.classList.add("swal2-dark");
    }
  },
  willClose: () => {
    document.body.style.overflow = "auto";
  },
});

export default GlobalSwal;