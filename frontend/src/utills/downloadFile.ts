import { saveAs } from "file-saver";
import GlobalSwal from "./GlobalSwal";
const Swal = GlobalSwal;

export default async function downloadFileByUrl(url: string) {
  let loading: any;

  try {
    // Tampilkan loading swal
    loading = Swal.fire({
      title: "Mengunduh...",
      text: "File sedang diunduh.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const response = await fetch(url);

    if (!response.ok) throw new Error("Gagal mengunduh file");

    const blob = await response.blob();
    const fileName = url.split("/").pop() || "file";
    saveAs(blob, fileName);

    Swal.close();
    await Swal.fire({icon: "success", title: "Berhasil!", text: `File ${fileName} berhasil diunduh.`});
  } catch (error) {
    console.error("❌ Error saat mengunduh:", error);
    Swal.close();
    const newWindow = window.open(url, '_blank');
    if (!newWindow) await Swal.fire({icon: "error", title: "Gagal mengunduh", text: "Terjadi kesalahan saat mengunduh file."});
    await Swal.fire({icon: "success", title: "Berhasil!", text: `File berhasil diunduh.`});
  }
}
