// Array untuk menyimpan semua tugas
let daftarSemuaTugas = [];

// Variabel untuk menyimpan filter yang aktif saat ini
let filterSaatIni = "semua";

// Set tanggal minimum agar pengguna tidak bisa memilih tanggal yang sudah lewat
document.getElementById("inputTanggal").min = new Date()
  .toISOString()
  .split("T")[0];

// Fungsi untuk menampilkan pesan error
function tampilkanError(pesan) {
  let divError = document.getElementById("pesanError");
  divError.textContent = "⚠️ " + pesan;
  divError.style.display = "block";

  // Sembunyikan pesan error setelah 3 detik
  setTimeout(function () {
    divError.style.display = "none";
  }, 3000);
}

// Fungsi untuk menambah tugas baru
function tambahTugas() {
  let inputTugas = document.getElementById("inputTugas");
  let inputTanggal = document.getElementById("inputTanggal");
  let teksTugas = inputTugas.value.trim();
  let tanggalTugas = inputTanggal.value;

  // Validasi: pastikan teks tugas diisi
  if (!teksTugas) {
    tampilkanError("Tugas harus diisi!");
    return;
  }

  // Validasi: pastikan tanggal diisi
  if (!tanggalTugas) {
    tampilkanError("Tanggal harus diisi!");
    return;
  }

  // Buat objek tugas baru
  let tugasBaru = {
    id: Date.now(), // Menggunakan timestamp sebagai ID unik
    teks: teksTugas,
    tanggal: tanggalTugas,
    selesai: false,
  };

  // Tambahkan tugas ke dalam array
  daftarSemuaTugas.push(tugasBaru);

  // Kosongkan input setelah menambah tugas
  inputTugas.value = "";
  inputTanggal.value = "";

  // Perbarui tampilan
  perbaruiTampilan();
}

// Fungsi untuk mengubah status tugas (selesai/belum selesai)
function ubahStatusTugas(id) {
  let tugas = daftarSemuaTugas.find((t) => t.id === id);
  if (tugas) {
    tugas.selesai = !tugas.selesai;
    perbaruiTampilan();
  }
}

// Fungsi untuk menghapus satu tugas
function hapusTugas(id) {
  daftarSemuaTugas = daftarSemuaTugas.filter((t) => t.id !== id);
  perbaruiTampilan();
}

// Fungsi untuk menghapus semua tugas
function hapusSemuaTugas() {
  if (confirm("Apakah Anda yakin ingin menghapus semua tugas?")) {
    daftarSemuaTugas = [];
    perbaruiTampilan();
  }
}

// Fungsi untuk menerapkan filter
function filterTugas() {
  let pilihFilter = document.getElementById("pilihFilter");
  filterSaatIni = pilihFilter.value;
  perbaruiTampilan();
}

// Fungsi untuk mengecek apakah tugas sudah terlewat waktu
function apakahTugasTerlewat(tugas) {
  let hariIni = new Date().toISOString().split("T")[0];
  return !tugas.selesai && tugas.tanggal < hariIni;
}

// Fungsi untuk mendapatkan status tugas
function dapatkanStatusTugas(tugas) {
  if (tugas.selesai) {
    return { teks: "Selesai", kelas: "status-completed" };
  } else if (apakahTugasTerlewat(tugas)) {
    return { teks: "Terlewat", kelas: "status-overdue" };
  } else {
    return { teks: "Menunggu", kelas: "status-pending" };
  }
}

// Fungsi untuk memformat tanggal
function formatTanggal(stringTanggal) {
  return new Date(stringTanggal).toLocaleDateString("id-ID");
}

// Fungsi untuk memfilter tugas berdasarkan filter yang dipilih
function dapatkanTugasYangDifilter() {
  return daftarSemuaTugas.filter(function (tugas) {
    switch (filterSaatIni) {
      case "menunggu":
        return !tugas.selesai;
      case "selesai":
        return tugas.selesai;
      case "terlewat":
        return apakahTugasTerlewat(tugas);
      default: // 'semua'
        return true;
    }
  });
}

// Fungsi untuk memperbarui tampilan
function perbaruiTampilan() {
  let divDaftarTugas = document.getElementById("daftarTugas");
  let btnHapusSemua = document.getElementById("btnHapusSemua");

  // Tampilkan tombol "HAPUS SEMUA" hanya jika ada tugas
  btnHapusSemua.style.display = daftarSemuaTugas.length > 0 ? "block" : "none";

  // Dapatkan tugas yang sudah difilter
  let tugasYangDifilter = dapatkanTugasYangDifilter();

  // Jika tidak ada tugas yang ditampilkan
  if (tugasYangDifilter.length === 0) {
    let pesanKosong = "Tidak ada tugas";

    // Pesan yang berbeda berdasarkan filter
    if (filterSaatIni !== "semua" && daftarSemuaTugas.length > 0) {
      switch (filterSaatIni) {
        case "menunggu":
          pesanKosong = "Tidak ada tugas yang menunggu";
          break;
        case "selesai":
          pesanKosong = "Tidak ada tugas yang selesai";
          break;
        case "terlewat":
          pesanKosong = "Tidak ada tugas yang terlewat";
          break;
      }
    }
    divDaftarTugas.innerHTML =
      '<div class="empty-state">' + pesanKosong + "</div>";
    return;
  }

  // Buat HTML untuk menampilkan tugas
  let html = "";
  tugasYangDifilter.forEach(function (tugas) {
    let terlewat = apakahTugasTerlewat(tugas);
    let status = dapatkanStatusTugas(tugas);
    let kelasItem = tugas.selesai ? "completed" : "";
    let kelasTeks = tugas.selesai ? "completed" : terlewat ? "overdue" : "";

    html +=
      '<div class="todo-item ' +
      kelasItem +
      '">' +
      '<div class="todo-text ' +
      kelasTeks +
      '">' +
      tugas.teks +
      "</div>" +
      '<div class="todo-date">' +
      formatTanggal(tugas.tanggal) +
      "</div>" +
      '<div><span class="status-badge ' +
      status.kelas +
      '">' +
      status.teks +
      "</span></div>" +
      '<div class="actions">' +
      '<button class="action-btn ' +
      (tugas.selesai ? "undo-btn" : "complete-btn") +
      '" onclick="ubahStatusTugas(' +
      tugas.id +
      ')">' +
      (tugas.selesai ? "Batal" : "Selesai") +
      "</button>" +
      '<button class="action-btn delete-btn" onclick="hapusTugas(' +
      tugas.id +
      ')">Hapus</button>' +
      "</div>" +
      "</div>";
  });

  divDaftarTugas.innerHTML = html;
}

// Event listener untuk tombol Enter pada input teks
document
  .getElementById("inputTugas")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      tambahTugas();
    }
  });

// Tampilkan halaman pertama kali
perbaruiTampilan();
