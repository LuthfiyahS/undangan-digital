const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzOaelSiD678ntoqPZ8T7YUjdc1b5MPDrcHQAbvzQp11yKa-BCztOCVpFRUV0kJji9B/exec";

const form = document.getElementById("rsvpForm");
const statusText = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");
const kehadiran = document.getElementById("kehadiran");
const jumlah = document.getElementById("jumlah");

// Sesuaikan jumlah tamu dengan status kehadiran
kehadiran.addEventListener("change", () => {
  if (kehadiran.value === "Tidak hadir") {
    jumlah.value = "0";
    jumlah.disabled = true;
  } else {
    jumlah.disabled = false;

    if (jumlah.value === "0") {
      jumlah.value = "1";
    }
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (SCRIPT_URL.startsWith("GANTI_")) {
    statusText.textContent =
      "URL Apps Script belum dikonfigurasi.";
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Mengirim...";
  statusText.textContent = "";

  const data = new URLSearchParams({
    nama: form.elements.nama.value.trim(),
    kehadiran: kehadiran.value,
    jumlah: kehadiran.value === "Tidak hadir"
      ? "0"
      : jumlah.value,
    pesan: form.elements.pesan.value.trim()
  });

  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: data
    });

    // Mode no-cors tidak memberi akses ke respons server.
    // Jadi ini bukan bukti bahwa baris berhasil tersimpan.
    statusText.textContent =
      "Permintaan RSVP telah dikirim. " +
      "Terima kasih! Jika data belum masuk ke spreadsheet, " +
      "silakan coba lagi beberapa saat kemudian.";

    form.reset();
    jumlah.disabled = false;

  } catch (error) {
    statusText.textContent =
      "Pengiriman gagal karena masalah koneksi. " +
      "Silakan periksa internet dan coba lagi.";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Kirim RSVP";
  }
});

// Countdown menuju acara
const targetDate = new Date("2026-12-20T09:00:00+07:00");
const countdown = document.getElementById("countdown");

function updateCountdown() {
  const diff = targetDate.getTime() - Date.now();

  if (diff <= 0) {
    countdown.textContent = "Hari bahagia telah tiba ❤️";
    return;
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  countdown.textContent =
    `${days} hari ${hours} jam ` +
    `${minutes} menit ${seconds} detik`;
}

updateCountdown();
setInterval(updateCountdown, 1000);