
// BENAR:
const SUPABASE_URL = 'https://xyzasdfghjklqwerty.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX... (kunci yang sangat panjang) ...';

// Inisialisasi Supabase Client
const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Data Default Perpustakaan
const defaultLibraryData = {
    buku: [
        { id: 'b1', title: 'Budi Daya Anggur & Perawatan Tanaman', cat: 'Pertanian', desc: 'Buku yang menyajikan informasi tentang pengenalan anggur dan tata cara budi daya yang efektif.', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', content: 'Buku ini berisi panduan lengkap mulai dari pemilihan bibit anggur berkualitas, persiapan media tanam dalam pot maupun lahan terbuka, pemangkasan ranting untuk mempercepat pembuahan, hingga penanggulangan hama.' },
        { id: 'b2', title: 'Aneka Resep Masakan Tradisional & Padang', cat: 'Kuliner', desc: 'Jenis-jenis masakan Nusantara beserta rahasia resep dan cara membuatnya dengan mudah.', img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', content: 'Pelajari resep rahasia bumbu rendang asli, sate padang, ayam pop, gulai tunjang, serta teknik memasak agar cita rasa rempah tradisional meresap sempurna.' },
        { id: 'b3', title: 'Beternak Jangkrik & Itik Modern', cat: 'Peternakan', desc: 'Tata cara peternakan dan pengembangbiakan hewan ternak beromzet tinggi untuk masyarakat desa.', img: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', content: 'Teknik modern pembuatan kandang kotak jangkrik, pemberian pakan berprotein tinggi, manajemen suhu ruangan, serta analisa pasca-panen agar hasil peternakan maksimal.' },
        { id: 'b4', title: 'Bercocok Tanam Cabai Rawit & Padi', cat: 'Perkebunan', desc: 'Langkah-langkah penanaman padi dan cabai dengan pupuk organik ramah lingkungan.', img: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', content: 'Cara mengatasi penyakit patek pada cabai, pembuatan pupuk organik cair (POC) mandiri dari limbah dapur, dan sistem irigasi hemat air untuk persawahan.' }
    ],
    audio: [
        { id: 'a1', title: 'Seri Fabel Si Kancil & Buaya', cat: 'Cerita Anak', desc: 'Cerita Inspiratif Anak Nusantara penuh pesan moral dan kecerdasan.', img: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
        { id: 'a2', title: 'Misteri Dibalik Seruan Adzan', cat: 'Religi', desc: 'Kisah Islami & Pembelajaran spiritual mendalam untuk ketenangan hati.', img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
        { id: 'a3', title: '1 Jam Ngomong Bahasa Korea', cat: 'Edukasi', desc: 'Belajar Bahasa Asing Praktis untuk percakapan sehari-hari dan karier.', img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' }
    ],
    video: [
        { id: 'v1', title: 'Profil Video Desa Sungai Raja 2026', cat: 'Dokumentasi', desc: 'Dokumentasi potensi alam, infrastruktur, dan budaya masyarakat.', img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { id: 'v2', title: 'Cerita Rakyat: Telaga Biru', cat: 'Legenda', desc: 'Animasi kisah legenda Nusantara warisan leluhur yang menginspirasi.', img: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { id: 'v3', title: 'Cerita Rakyat: Sultan Domas', cat: 'Sejarah', desc: 'Kisah kepahlawanan lokal dalam mempertahankan tanah air.', img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ]
};

// Data Default Berita
const defaultNewsData = [
    { id: 'n1', title: 'Musdes Rapat Perpustakaan Digital & Pengembangan Desa Cerdas 2026', date: '04 Juni 2026', img: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', desc: 'Pemerintah Desa Sungai Raja menggelar Musyawarah Desa...', content: 'Pemerintah Desa Sungai Raja resmi meluncurkan pembaruan sistem perpustakaan digital terintegrasi.' },
    { id: 'n2', title: 'Penyaluran Bantuan Langsung Tunai (BLT) Dana Desa Tahap II Tahun 2026', date: '28 Mei 2026', img: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', desc: 'Pembagian dana bantuan langsung tunai berlangsung tertib di Balai Desa...', content: 'Pemerintah Desa Sungai Raja telah sukses menyalurkan BLT Dana Desa kepada 85 KPM.' }
];

// Data Default Galeri
const defaultGalleryData = [
    { id: 'g1', title: 'Gotong Royong Irigasi Sawah', cat: 'Gotong Royong', img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: 'g2', title: 'Musyawarah Desa (Musdes) 2026', cat: 'Pemerintahan', img: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: 'g3', title: 'Penyaluran BLT Dana Desa', cat: 'Kesejahteraan', img: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: 'g4', title: 'Lahan Persawahan Subur', cat: 'Potensi Alam', img: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
];

// Data Default Profil/Data Desa (Bisa diedit Admin)
const defaultProfileData = {
    sejarah: 'Desa Sungai Raja resmi dibentuk pada tahun 1991, terletak di wilayah strategis Kecamatan Na IX-X, Kabupaten Labuhanbatu Utara, Provinsi Sumatera Utara. Nama "Sungai Raja" diambil dari sejarah aliran sungai utama yang dahulu menjadi urat nadi transportasi dan perdagangan para tokoh adat dan raja-raja lokal.',
    visi: 'Mewujudkan Desa Sungai Raja yang Mandiri, Cerdas, dan Sejahtera Berlandaskan Gotong Royong.',
    misi: 'Digitalisasi pelayanan publik yang cepat & tepat.\nPeningkatan infrastruktur pertanian & irigasi.\nPemberdayaan UMKM dan BUMDes.\nPeningkatan wawasan literasi masyarakat.',
    kodeDesa: '21454',
    tahun: '1991',
    kecamatan: 'Na IX-X',
    kabupaten: 'Labuhanbatu Utara',
    provinsi: 'Sumatera Utara',
    luas: '5.113,1 Ha'
};

// Load data dari LocalStorage
let libraryData = JSON.parse(localStorage.getItem('sr_libraryData')) || defaultLibraryData;
let newsData = JSON.parse(localStorage.getItem('sr_newsData')) || defaultNewsData;
let galleryData = JSON.parse(localStorage.getItem('sr_galleryData')) || defaultGalleryData;
let profileData = JSON.parse(localStorage.getItem('sr_profileData')) || defaultProfileData;
let currentRole = localStorage.getItem('sr_currentRole') || 'pembaca';
let currentTab = 'buku';

function saveStorage() {
    localStorage.setItem('sr_libraryData', JSON.stringify(libraryData));
    localStorage.setItem('sr_newsData', JSON.stringify(newsData));
    localStorage.setItem('sr_galleryData', JSON.stringify(galleryData));
    localStorage.setItem('sr_profileData', JSON.stringify(profileData));
    localStorage.setItem('sr_currentRole', currentRole);
}