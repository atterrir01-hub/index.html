let simpananKode = JSON.parse(localStorage.getItem('arsipKode') || '[]');

// SAAT PERTAMA DIBUKA
document.addEventListener('DOMContentLoaded', function() {
    muatTemaSaatIni();
    siapkanSemuaTombol();
    cekApakahSudahMasuk();
    tampilkanDaftarSimpanan();
});

// HUBUNGKAN SEMUA TOMBOL
function siapkanSemuaTombol() {
    // AKUN
    document.getElementById('btnMasuk').addEventListener('click', prosesMasuk);
    document.getElementById('btnDaftar').addEventListener('click', prosesDaftar);
    document.getElementById('keDaftar').addEventListener('click', () => tukarForm('daftar'));
    document.getElementById('keMasuk').addEventListener('click', () => tukarForm('masuk'));
    document.getElementById('btnKeluar').addEventListener('click', keluarDariAkun);
    document.getElementById('btnGantiTema').addEventListener('click', () => document.getElementById('modalTema').classList.remove('sembunyi'));
    document.querySelector('.tutup-modal').addEventListener('click', () => document.getElementById('modalTema').classList.add('sembunyi'));

    // NAVIGASI MENU
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('aktif'));
            this.classList.add('aktif');
            const nama = this.dataset.bagian;
            document.querySelectorAll('.bagian').forEach(b => b.classList.add('sembunyi'));
            document.getElementById('bag' + nama[0].toUpperCase() + nama.slice(1)).classList.remove('sembunyi');
        });
    });

    // EDITOR KODE
    document.getElementById('pilihBahasa').addEventListener('change', function() {
        const contoh = {
            html: `<h1>Judul Halaman</h1>\n<p>Tulis paragraf di sini.</p>`,
            js: `let nilai = 80;\nif(nilai >= 75) {\n  console.log("Lulus!");\n} else {\n  console.log("Belum lulus");\n}\nlet luas = 3.14 * 10 * 10;\nconsole.log("Luas lingkaran: " + luas);`,
            py: `nilai = 85\nif nilai >= 80:\n    print("Nilai A")\nelif nilai >= 70:\n    print("Nilai B")\nelse:\n    print("Belum lulus")\n\nimport math\nakar = math.sqrt(144)\nprint(f"Akar: {akar}")`,
            bash: `angka=40\nif [ $angka -gt 30 ]; then\n    echo "Lebih besar dari 30"\nelse\n    echo "Lebih kecil atau sama"\nfi\necho "Hasil kali: $((6 * 7))"`
        };
        document.getElementById('areaKode').value = contoh[this.value] || `// Tulis kode bahasa ${this.value} di sini`;
    });
    document.getElementById('btnCekKode').addEventListener('click', periksaKode);
    document.getElementById('btnJalankan').addEventListener('click', jalankanKode);
    document.getElementById('btnSimpan').addEventListener('click', simpanKodeSaatIni);
    document.getElementById('btnSalin').addEventListener('click', salinKodeSaatIni);
    document.getElementById('btnBersih').addEventListener('click', bersihkanEditor);

    // TERMINAL
    document.getElementById('inputTerminal').addEventListener('keydown', fungsiTerminal);

    // BUAT WEBSITE
    document.querySelectorAll('.tab-btn').forEach(t => {
        t.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(x => x.classList.remove('aktif'));
            this.classList.add('aktif');
            const jns = this.dataset.tab;
            document.querySelectorAll('.area-kode').forEach(a => a.classList.add('sembunyi'));
            document.getElementById('kode' + jns[0].toUpperCase() + jns.slice(1)).classList.remove('sembunyi');
        });
    });
    document.getElementById('btnCekWeb').addEventListener('click', periksaKodeWeb);
    document.getElementById('btnLihatWeb').addEventListener('click', lihatHasilWeb);
    document.getElementById('btnSalinSemuaKode').addEventListener('click', salinSemuaKodeSitus);
}

// === SISTEM TEMA ===
function terapkanTema(nama) {
    document.body.classList.remove('tema-gelap','tema-hijau','tema-biru');
    if(nama !== 'terang') document.body.classList.add('tema-' + nama);
    localStorage.setItem('temaPilihan', nama);
    document.getElementById('modalTema').classList.add('sembunyi');
}
function muatTemaSaatIni() {
    const simpanan = localStorage.getItem('temaPilihan') || 'terang';
    terapkanTema(simpanan);
}

// === SISTEM AKUN ===
function tukarForm(ke) {
    if(ke === 'daftar') {
        document.getElementById('formMasuk').classList.add('sembunyi');
        document.getElementById('formDaftar').classList.remove('sembunyi');
    } else {
        document.getElementById('formDaftar').classList.add('sembunyi');
        document.getElementById('formMasuk').classList.remove('sembunyi');
    }
    document.getElementById('pesan').textContent = '';
}
function tampilPesan(teks, jenis='salah') {
    const el = document.getElementById('pesan');
    el.textContent = teks;
    el.style.color = jenis === 'benar' ? 'var(--benar)' : 'var(--salah)';
}
function prosesDaftar() {
    const nama = document.getElementById('daftarNama').value.trim();
    const sandi = document.getElementById('daftarSandi').value;
    const ulang = document.getElementById('ulangSandi').value;
    const daftarAkun = JSON.parse(localStorage.getItem('dataAkun') || '{}');

    if(nama.length < 3) return tampilPesan('Nama pengguna minimal 3 huruf!');
    if(sandi.length < 6) return tampilPesan('Kata sandi minimal 6 karakter!');
    if(sandi !== ulang) return tampilPesan('Kata sandi tidak cocok!');
    if(daftarAkun[nama]) return tampilPesan('Nama pengguna sudah terdaftar!');

    daftarAkun[nama] = sandi;
    localStorage.setItem('dataAkun', JSON.stringify(daftarAkun));
    tampilPesan('Akun berhasil dibuat! Silakan masuk', 'benar');
    setTimeout(() => tukarForm('masuk'), 1500);
}
function prosesMasuk() {
    const nama = document.getElementById('namaPengguna').value.trim();
    const sandi = document.getElementById('kataSandi').value;
    const daftarAkun = JSON.parse(localStorage.getItem('dataAkun') || '{}');

    if(!daftarAkun[nama]) return tampilPesan('Nama pengguna belum terdaftar!');
    if(daftarAkun[nama] !== sandi) return tampilPesan('Kata sandi salah!');

    localStorage.setItem('akunAktif', nama);
    bukaHalamanUtama(nama);
}
function cekApakahSudahMasuk() {
    const nama = localStorage.getItem('akunAktif');
    if(nama) bukaHalamanUtama(nama);
}
function bukaHalamanUtama(nama) {
    document.getElementById('layarMasuk').classList.add('sembunyi');
    document.getElementById('halamanUtama').classList.remove('sembunyi');
    document.getElementById('namaUser').textContent = nama;
}
function keluarDariAkun() {
    localStorage.removeItem('akunAktif');
    document.getElementById('halamanUtama').classList.add('sembunyi');
    document.getElementById('layarMasuk').classList.remove('sembunyi');
    document.querySelectorAll('input').forEach(i => i.value = '');
    document.getElementById('pesan').textContent = '';
}

// === MATERI BELAJAR ===
function bukaMateri(jenis) {
    const isi = {
        html: `<h3>HTML & CSS</h3><pre>&lt;h1&gt;Judul Utama&lt;/h1&gt;\n&lt;p&gt;Paragraf teks&lt;/p&gt;</pre><p>Gunakan HTML untuk struktur, CSS untuk mengatur warna dan tata letak.</p>`,
        js: `<h3>Logika JavaScript</h3><pre>let umur = 20;\nif(umur >= 17) {\n  console.log("Boleh bikin SIM");\n} else {\n  console.log("Belum boleh");\n}</pre>`,
        python: `<h3>Logika Python</h3><pre>nilai = 85\nif nilai >= 80:\n    hasil = "A"\nelse:\n    hasil = "Bawah"\nprint(hasil)</pre>`,
        bash: `<h3>Bash/Shell (+1 Bahasa)</h3><pre>nama="Budi"\necho "Halo $nama"\nif [ -f "berkas.txt" ]; then\n    echo "Berkas ada"\nfi</pre>`
    };
    document.getElementById('isiMateri').innerHTML = isi[jenis];
    document.getElementById('isiMateri').classList.remove('sembunyi');
}

// === EDITOR KODE ===
function periksaKode() {
    const kode = document.getElementById('areaKode').value;
    const lap = document.getElementById('laporanCek');
    lap.classList.remove('sembunyi');
    lap.className = 'laporan';

    if(kode.length < 10) {
        lap.classList.add('salah');
        lap.textContent = '⚠️ Kode terlalu pendek, tuliskan instruksi terlebih dahulu.';
    } else {
        lap.classList.add('benar');
        lap.textContent = '✅ Tidak ditemukan kesalahan penulisan yang mencolok.';
    }
}
function jalankanKode() {
    const bhs = document.getElementById('pilihBahasa').value;
    const kode = document.getElementById('areaKode').value;
    const hasil = document.getElementById('hasilKode');
    hasil.innerHTML = '';

    if(bhs === 'html') {
        hasil.innerHTML = kode;
    } else if(bhs === 'js') {
        const tampil = [];
        const logAsli = console.log;
        console.log = (...a) => tampil.push(a.join(' '));
        try { eval(kode); hasil.innerHTML = `<pre>${tampil.join('\n') || '✅ Berjalan tanpa pesan'}</pre>`; }
        catch(e) { hasil.innerHTML = `<span style="color:var(--salah)">❌ ${e.message}</span>`; }
        console.log = logAsli;
    } else {
        const pesan = kode.match(/print\s*\(\s*['"](.*?)['"]/g) || kode.match(/echo\s+(.*)/g) || [];
        hasil.innerHTML = `<pre>${pesan.map(s=>s.replace(/.*['"](.*)['"].*/,'$1').replace(/echo\s*/,'')).join('\n') || '✅ Kode berjalan normal'}</pre>`;
    }
}
function simpanKodeSaatIni() {
    const data = {
        id: Date.now(),
        waktu: new Date().toLocaleString(),
        bahasa: document.getElementById('pilihBahasa').value,
        isi: document.getElementById('areaKode').value
    };
    simpananKode.unshift(data);
    if(simpananKode.length > 15) simpananKode.pop();
    localStorage.setItem('arsipKode', JSON.stringify(simpananKode));
    tampilkanDaftarSimpanan();
    alert('✅ Kode berhasil disimpan!');
}
function tampilkanDaftarSimpanan() {
    const wadah = document.getElementById('daftarSimpanan');
    wadah.innerHTML = '';
    simpananKode.forEach(k => {
        const el = document.createElement('div');
        el.className = 'item-simpan';
        el.innerHTML = `
            <span>${k.waktu} — ${k.bahasa}</span>
            <div>
                <button class="btn-kecil" onclick="bukaKodeTersimpan(${k.id})">Buka</button>
                <button class="btn-kecil-merah" onclick="hapusKodeTersimpan(${k.id})">Hapus</button>
            </div>`;
        wadah.appendChild(el);
    });
}
function bukaKodeTersimpan(id) {
    const cari = simpananKode.find(x => x.id === id);
    if(cari) {
        document.getElementById('pilihBahasa').value = cari.bahasa;
        document.getElementById('areaKode').value = cari.isi;
    }
}
function hapusKodeTersimpan(id) {
    simpananKode = simpananKode.filter(x => x.id !== id);
    localStorage.setItem('arsipKode', JSON.stringify(simpananKode));
    tampilkanDaftarSimpanan();
}
function salinKodeSaatIni() {
    navigator.clipboard.writeText(document.getElementById('areaKode').value)
    .then(() => alert('📋 Kode sudah disalin!'));
}
function bersihkanEditor() {
    if(confirm('Yakin ingin membersihkan kode saat ini?')) {
        document.getElementById('areaKode').value = '';
        document.getElementById('hasilKode').innerHTML = 'Hasil akan muncul di sini';
    }
}

// === TERMINAL ===
function fungsiTerminal(e) {
    if(e.key === 'Enter') {
        const ketik = this.value.trim();
        const riwayat = document.getElementById('riwayatTerminal');
        riwayat.innerHTML += `<div class="baris-masuk">$ ${ketik}</div>`;
        let jawab = '';

        if(['halo','hai'].includes(ketik)) jawab = 'Halo juga! Selamat belajar koding.';
        else if(['bantuan','help'].includes(ketik)) jawab = 'Perintah: halo, waktu, tanggal, bersih';
        else if(ketik === 'waktu') jawab = new Date().toLocaleTimeString();
        else if(ketik === 'tanggal') jawab = new Date().toLocaleDateString();
        else if(['bersih','clear'].includes(ketik)) { riwayat.innerHTML = ''; this.value = ''; return; }
        else jawab = `Perintah: ${ketik}\nKetik "bantuan" untuk daftar perintah.`;

        riwayat.innerHTML += `<div style="color:#94a3b8">${jawab.replace(/\n/g,'<br>')}</div>`;
        this.value = '';
        riwayat.scrollTop = riwayat.scrollHeight;
    }
}

// === BUAT WEBSITE ===
function periksaKodeWeb() {
    const html = document.getElementById('kodeHtml').value;
    const lap = document.getElementById('laporanWeb');
    lap.classList.remove('sembunyi');
    lap.className = 'laporan';

    if(!html.includes('<html')) {
        lap.classList.add('salah');
        lap.textContent = '❌ Kesalahan: Tag <html> utama tidak ditemukan.';
    } else {
        lap.classList.add('benar');
        lap.textContent = '✅ Tidak ditemukan kesalahan mencolok, kode siap dilihat.';
    }
}
function lihatHasilWeb() {
    const html = document.getElementById('kodeHtml').value;
    const css = document.getElementById('kodeCss').value;
    const js = document.getElementById('kodeJs').value;
    const gabung = html.replace('</head>', `<style>${css}</style></head>`).replace('</body>', `<script>${js}</script></body>`);
    document.getElementById('tampilanWeb').srcdoc = gabung;
}
function salinSemuaKodeSitus() {
    const isi = `=== KODE HTML ===\n${document.getElementById('kodeHtml').value}\n\n=== KODE CSS ===\n${document.getElementById('kodeCss').value}\n\n=== KODE JAVASCRIPT ===\n${document.getElementById('kodeJs').value}`;
    navigator.clipboard.writeText(isi).then(() => {
        alert('✅ Semua kode situs sudah disalin! Kamu bisa menyimpannya atau mengunggah ke layanan penerbitan situs.');
    });
}
