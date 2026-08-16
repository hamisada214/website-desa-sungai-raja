document.addEventListener('DOMContentLoaded', () => {
    // 1. Highlight menu navigasi aktif
    const currentPath = window.location.pathname.split("/").pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('text-primary', 'font-bold');
            link.classList.remove('text-gray-700');
        }
    });

    // 2. Render data dari Supabase sesuai halaman saat ini
    if (document.getElementById('library-content')) renderLibrary('buku');
    if (document.getElementById('full-news-container') || document.getElementById('home-news-container')) renderNews();
    if (document.getElementById('gallery-container')) renderGallery();
    if (document.getElementById('profile-content-box')) renderProfile();
    
    applyRoleUI(currentRole);

    // 3. Event listener upload gambar dengan kompresi otomatis
    const imgFileInput = document.getElementById('crud-img-file');
    if (imgFileInput) {
        imgFileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            const preview = document.getElementById('crud-img-preview');
            const imgDataInput = document.getElementById('crud-img-data');

            if (file) {
                if (!file.type.startsWith('image/')) {
                    alert('File yang dipilih bukan gambar!');
                    event.target.value = '';
                    return;
                }

                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = new Image();
                    img.src = e.target.result;
                    img.onload = function() {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        
                        const MAX_WIDTH = 800;
                        const MAX_HEIGHT = 800;
                        let width = img.width;
                        let height = img.height;

                        if (width > height) {
                            if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                        } else {
                            if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
                        }

                        canvas.width = width;
                        canvas.height = height;
                        ctx.drawImage(img, 0, 0, width, height);

                        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);

                        const imgElement = preview.querySelector('img');
                        const iconElement = preview.querySelector('i');
                        imgElement.src = compressedBase64;
                        imgElement.classList.remove('hidden');
                        if (iconElement) iconElement.classList.add('hidden');
                        preview.classList.remove('border-dashed');

                        imgDataInput.value = compressedBase64;
                    };
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            document.getElementById('mobile-menu').classList.toggle('hidden');
        });
    }
});

// ==========================================
// 1. RENDER GALERI (CLOUD)
// ==========================================
async function renderGallery() {
    const container = document.getElementById('gallery-container');
    if (!container) return;
    container.innerHTML = '<div class="col-span-full text-center py-8 text-gray-400">Memuat galeri...</div>';

    const { data: galleryData, error } = await db.from('galeri').select('*').order('id', { ascending: false });

    if (error) { container.innerHTML = '<div class="col-span-full text-center py-8 text-red-500">Gagal memuat galeri.</div>'; return; }
    container.innerHTML = '';
    
    window.globalGalleryData = galleryData;

    if (galleryData.length === 0) {
        container.innerHTML = '<div class="col-span-full text-center py-8 text-gray-400">Belum ada foto galeri.</div>';
        return;
    }

    galleryData.forEach(item => {
        const adminButtons = currentRole === 'admin' ? `
            <div class="flex space-x-2 mt-3 pt-2 border-t border-gray-100">
                <button onclick="openEditModal('galeri', '${item.id}')" class="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold py-1 rounded"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                <button onclick="deleteItem('galeri', '${item.id}')" class="flex-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold py-1 rounded"><i class="fa-solid fa-trash"></i> Hapus</button>
            </div>` : '';

        container.innerHTML += `
            <div class="bg-white rounded-2xl shadow-md overflow-hidden group border border-gray-100 p-3 flex flex-col justify-between">
                <div>
                    <div class="relative overflow-hidden aspect-video rounded-xl cursor-pointer" onclick="openGalleryModal('${item.title}', '${item.img}')">
                        <img src="${item.img}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                    </div>
                    <div class="p-2">
                        <span class="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold uppercase">${item.cat}</span>
                        <h4 class="font-bold text-gray-800 text-sm mt-1">${item.title}</h4>
                    </div>
                </div>
                ${adminButtons}
            </div>`;
    });
}

// ==========================================
// 2. RENDER BERITA (CLOUD)
// ==========================================
async function renderNews() {
    const homeContainer = document.getElementById('home-news-container');
    const fullContainer = document.getElementById('full-news-container');
    if (homeContainer) homeContainer.innerHTML = '<div class="col-span-full text-center py-8 text-gray-400">Memuat berita...</div>';
    if (fullContainer) fullContainer.innerHTML = '<div class="col-span-full text-center py-8 text-gray-400">Memuat berita...</div>';

    const { data: newsData, error } = await db.from('berita').select('*').order('id', { ascending: false });

    if (error) return;
    if (homeContainer) homeContainer.innerHTML = '';
    if (fullContainer) fullContainer.innerHTML = '';

    window.globalNewsData = newsData;

    newsData.forEach((item, index) => {
        const adminButtons = currentRole === 'admin' ? `
            <div class="flex space-x-2">
                <button onclick="openEditModal('berita', '${item.id}')" class="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded text-xs font-bold">Edit</button>
                <button onclick="deleteItem('berita', '${item.id}')" class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-bold">Hapus</button>
            </div>` : '';

        const cardHtml = `
            <article class="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 flex flex-col justify-between">
                <div>
                    <img src="${item.img}" class="w-full h-52 object-cover">
                    <div class="p-6">
                        <span class="text-xs text-gray-400 font-medium"><i class="fa-regular fa-calendar mr-1"></i> ${item.date}</span>
                        <h3 class="font-bold text-lg text-gray-800 mt-2 cursor-pointer hover:text-primary" onclick="openNews('${item.id}')">${item.title}</h3>
                        <p class="text-sm text-gray-600 mt-3 line-clamp-3">${item.desc}</p>
                    </div>
                </div>
                <div class="px-6 pb-6 pt-2 flex items-center justify-between border-t border-gray-50 mt-2">
                    <button onclick="openNews('${item.id}')" class="inline-flex items-center text-sm font-bold text-primary"><span>Selengkapnya</span><i class="fa-solid fa-arrow-right ml-2 text-xs"></i></button>
                    ${adminButtons}
                </div>
            </article>`;
        
        if (homeContainer && index < 3) homeContainer.innerHTML += cardHtml;
        if (fullContainer) fullContainer.innerHTML += cardHtml;
    });
}

// ==========================================
// 3. RENDER PERPUSTAKAAN (CLOUD)
// ==========================================
async function renderLibrary(tab, keyword = '') {
    const container = document.getElementById('library-content');
    if (!container) return;
    container.innerHTML = '<div class="col-span-full text-center py-8 text-gray-400">Memuat media...</div>';

    const { data: libraryData, error } = await db.from('perpustakaan').select('*').eq('type', tab).order('id', { ascending: false });

    if (error) return;
    container.innerHTML = '';
    window.globalLibraryData = libraryData;

    const filteredData = libraryData.filter(item => item.title.toLowerCase().includes(keyword.toLowerCase()) || item.cat.toLowerCase().includes(keyword.toLowerCase()));

    if (filteredData.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-12 text-gray-400 font-medium">Media tidak ditemukan.</div>`;
        return;
    }

    filteredData.forEach(item => {
        const adminButtons = currentRole === 'admin' ? `
            <div class="flex space-x-2 mt-3 pt-3 border-t border-gray-100">
                <button onclick="openEditModal('perpustakaan', '${item.id}')" class="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold py-1.5 rounded">Edit</button>
                <button onclick="deleteItem('perpustakaan', '${item.id}', '${tab}')" class="flex-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold py-1.5 rounded">Hapus</button>
            </div>` : '';

        let cardHtml = '';
        if (tab === 'buku') {
            cardHtml = `<div class="bg-white rounded-xl shadow border border-gray-100 overflow-hidden flex flex-col justify-between"><img src="${item.img}" class="w-full h-48 object-cover"><div class="p-4 flex-1 flex flex-col justify-between"><div><span class="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold uppercase">${item.cat}</span><h4 class="font-bold text-gray-800 text-sm mt-2 line-clamp-2">${item.title}</h4></div><div><button onclick="openMedia('${tab}', '${item.id}')" class="mt-4 w-full bg-primary text-white text-xs font-semibold py-2 rounded">Mulai Membaca</button>${adminButtons}</div></div></div>`;
        } else if (tab === 'audio') {
            cardHtml = `<div class="bg-white p-5 rounded-xl shadow border border-gray-100 flex flex-col justify-between"><div class="flex items-center space-x-4"><div class="w-16 h-16 bg-amber-500 rounded-lg flex items-center justify-center text-white text-2xl shrink-0"><i class="fa-solid fa-headphones-simple"></i></div><div><span class="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold uppercase">${item.cat}</span><h4 class="font-bold text-gray-800 text-sm mt-1">${item.title}</h4></div></div><div><button onclick="openMedia('${tab}', '${item.id}')" class="mt-4 w-full bg-amber-600 text-white text-xs font-semibold py-2 rounded">Dengarkan</button>${adminButtons}</div></div>`;
        } else if (tab === 'video') {
            cardHtml = `<div class="bg-white rounded-xl shadow border border-gray-100 overflow-hidden flex flex-col justify-between"><div><div class="relative cursor-pointer" onclick="openMedia('${tab}', '${item.id}')"><img src="${item.img}" class="w-full h-44 object-cover"><div class="absolute inset-0 bg-black/40 flex items-center justify-center"><span class="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-primary"><i class="fa-solid fa-play"></i></span></div></div><div class="p-4"><span class="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold uppercase">${item.cat}</span><h4 class="font-bold text-gray-800 text-sm mt-1">${item.title}</h4></div></div><div class="px-4 pb-4"><button onclick="openMedia('${tab}', '${item.id}')" class="w-full bg-rose-600 text-white text-xs font-semibold py-2 rounded">Tonton</button>${adminButtons}</div></div>`;
        }
        container.innerHTML += cardHtml;
    });
}

// ==========================================
// 4. RENDER PROFIL DESA (CLOUD)
// ==========================================
async function renderProfile() {
    const box = document.getElementById('profile-content-box');
    if (!box) return;

    const { data: profileList, error } = await db.from('profil').select('*').limit(1);
    if (error || profileList.length === 0) return;

    const pData = profileList[0];
    window.globalProfileData = pData; 

    document.getElementById('profile-sejarah-text').innerText = pData.sejarah || '';
    document.getElementById('profile-visi-text').innerText = pData.visi || '';
    
    const misiList = document.getElementById('profile-misi-list');
    misiList.innerHTML = '';
    (pData.misi || '').split('\n').forEach(misi => { if(misi.trim()) misiList.innerHTML += `<li>${misi}</li>`; });

    ['kode', 'tahun', 'kec', 'kab', 'prov', 'luas'].forEach(id => {
        const el = document.getElementById('val-' + id);
        if(el) el.innerText = ': ' + (pData[id === 'kode' ? 'kode_desa' : id === 'kec' ? 'kecamatan' : id === 'kab' ? 'kabupaten' : id === 'prov' ? 'provinsi' : id] || '');
    });

    if(document.getElementById('val-jml-penduduk')) {
        document.getElementById('val-jml-penduduk').innerText = pData.jml_penduduk || '-';
        document.getElementById('val-jml-l').innerText = pData.jml_laki || '-';
        document.getElementById('val-jml-p').innerText = pData.jml_perempuan || '-';
    }

    const renderList = (elId, dataString, templateFn) => {
        const el = document.getElementById(elId);
        if(!el) return;
        el.innerHTML = '';
        (dataString || '').split('\n').forEach(line => {
            let parts = line.split(':');
            if(parts.length >= 2) el.innerHTML += templateFn(parts[0].trim(), parts.slice(1).join(':').trim());
        });
    };

    renderList('val-batas-wilayah', pData.batas_wilayah, (k, v) => `<li class="flex items-start"><span class="font-bold w-24 shrink-0 text-gray-500">${k}</span> <span>: ${v}</span></li>`);
    renderList('val-list-dusun', pData.list_dusun, (k, v) => `<div class="flex justify-between border-b border-gray-50 pb-2"><span class="font-bold text-gray-800">${k}</span><span class="text-gray-500 font-semibold">${v}</span></div>`);
    renderList('val-perangkat', pData.list_perangkat, (k, v) => `<li class="flex"><span class="font-semibold w-36 shrink-0 text-gray-500">${k}</span> <span class="font-extrabold text-gray-900">: ${v}</span></li>`);
    renderList('val-bpd', pData.list_bpd, (k, v) => {
        if(k.toLowerCase().includes('ketua')) return `<li class="flex items-center mt-2"><span class="font-semibold w-32 shrink-0 text-gray-500">${k}</span> <span class="bg-teal-100 text-teal-900 px-3 py-1 rounded-md font-bold">: ${v}</span></li>`;
        return `<li class="flex"><span class="font-semibold w-32 shrink-0 text-gray-500">${k}</span> <span class="font-semibold text-gray-800">: ${v}</span></li>`;
    });
}

// ==========================================
// 5. SIMPAN ATAU EDIT DATA CRUD (LEBIH AMAN)
// ==========================================
async function handleCRUDSave(event) {
    event.preventDefault();
    const id = document.getElementById('crud-id').value; 
    const type = document.getElementById('crud-type').value;
    const title = document.getElementById('crud-title').value;
    const catOrDate = document.getElementById('crud-cat').value;
    const img = document.getElementById('crud-img-data').value;
    const desc = document.getElementById('crud-desc').value;
    const contentOrUrl = document.getElementById('crud-content').value;

    showToast("Memproses...", id ? "Memperbarui data..." : "Menyimpan data baru...");
    
    const submitBtn = document.getElementById('crud-submit-btn-text');
    if(submitBtn) submitBtn.innerText = "Menyimpan...";

    try {
        if (type === 'galeri') {
            const dataObj = { title: title, cat: catOrDate, img: img };
            let response;
            if (id) { response = await db.from('galeri').update(dataObj).eq('id', id); } 
            else { response = await db.from('galeri').insert([dataObj]); }
            if (response.error) throw response.error;
            renderGallery();
        } 
        else if (type === 'berita') {
            const dataObj = { title: title, date: catOrDate, img: img, desc: desc, content: contentOrUrl };
            let response;
            if (id) { response = await db.from('berita').update(dataObj).eq('id', id); } 
            else { response = await db.from('berita').insert([dataObj]); }
            if (response.error) throw response.error;
            renderNews();
        } 
        else { // buku, audio, video
            const dataObj = { type: type, title: title, cat: catOrDate, img: img, desc: desc, extra_content: contentOrUrl };
            let response;
            if (id) { response = await db.from('perpustakaan').update(dataObj).eq('id', id); } 
            else { response = await db.from('perpustakaan').insert([dataObj]); }
            if (response.error) throw response.error;
            renderLibrary(type);
        }

        showToast("Berhasil!", id ? "Data berhasil diperbarui." : "Data tersimpan ke cloud.");
        closeModal('modal-crud');
    } catch (error) {
        alert("Terjadi kesalahan saat menyimpan: " + error.message);
    } finally {
        if(submitBtn) submitBtn.innerText = "Simpan Data"; 
    }
}

// ==========================================
// 6. SIMPAN EDIT PROFIL DESA (CLOUD)
// ==========================================
async function handleProfileSave(event) {
    event.preventDefault();
    showToast("Memproses...", "Perbarui Profil Desa di cloud...");

    const updatedData = {
        id: 1, 
        sejarah: document.getElementById('edit-sejarah').value,
        visi: document.getElementById('edit-visi').value,
        misi: document.getElementById('edit-misi').value,
        kode_desa: document.getElementById('edit-kode').value,
        tahun: document.getElementById('edit-tahun').value,
        kecamatan: document.getElementById('edit-kec').value,
        kabupaten: document.getElementById('edit-kab').value,
        provinsi: document.getElementById('edit-prov').value,
        luas: document.getElementById('edit-luas').value,
        jml_penduduk: document.getElementById('edit-jml-penduduk').value,
        jml_laki: document.getElementById('edit-jml-l').value,
        jml_perempuan: document.getElementById('edit-jml-p').value,
        batas_wilayah: document.getElementById('edit-batas-wilayah').value,
        list_dusun: document.getElementById('edit-list-dusun').value,
        list_perangkat: document.getElementById('edit-list-perangkat').value,
        list_bpd: document.getElementById('edit-list-bpd').value
    };

    const { error } = await db.from('profil').upsert(updatedData);
    if (error) { alert("Gagal memperbarui profil: " + error.message); return; }

    closeModal('modal-edit-profile');
    renderProfile();
    showToast("Berhasil!", "Profil Desa berhasil diperbarui.");
}

// ==========================================
// 7. HAPUS DATA (CLOUD)
// ==========================================
async function deleteItem(type, id, subType = '') {
    if (confirm("Hapus data ini secara permanen dari database cloud?")) {
        let tableName = type === 'perpustakaan' ? 'perpustakaan' : type;
        const { error } = await db.from(tableName).delete().eq('id', id);

        if (error) { alert("Gagal menghapus: " + error.message); return; }

        if (type === 'galeri') renderGallery();
        else if (type === 'berita') renderNews();
        else renderLibrary(subType);

        showToast("Terhapus", "Data berhasil dihapus dari cloud.");
    }
}

// --- FUNGSI MODAL & PERAN ADMIN ---
function openModal(modalId) { const el = document.getElementById(modalId); if (el) el.classList.remove('hidden'); }
function closeModal(modalId) { const el = document.getElementById(modalId); if (el) el.classList.add('hidden'); }
function closeMobileMenu() { const el = document.getElementById('mobile-menu'); if(el) el.classList.add('hidden'); }
function openGalleryModal(title, imgSrc) {
    document.getElementById('gallery-zoom-title').innerText = title;
    document.getElementById('gallery-zoom-img').src = imgSrc;
    openModal('modal-gallery');
}

function openNews(id) {
    const item = (window.globalNewsData || []).find(i => i.id == id);
    if (!item) return;
    document.getElementById('news-modal-content').innerHTML = `
        <img src="${item.img}" class="w-full h-64 object-cover rounded-2xl shadow mb-6">
        <span class="text-xs text-gray-400 font-semibold"><i class="fa-regular fa-calendar mr-1"></i> ${item.date}</span>
        <h2 class="font-extrabold text-2xl text-gray-900 mt-1 mb-4">${item.title}</h2>
        <div class="text-sm text-gray-700 leading-relaxed space-y-4 border-t pt-4"><p class="whitespace-pre-wrap">${item.content}</p></div>
        <div class="mt-6 pt-4 border-t flex justify-end"><button onclick="closeModal('modal-news')" class="bg-primary text-white text-xs font-bold px-6 py-2.5 rounded-xl">Tutup Berita</button></div>`;
    openModal('modal-news');
}

function openMedia(type, id) {
    const item = (window.globalLibraryData || []).find(i => i.id == id);
    if (!item) return;
    const container = document.getElementById('media-content');
    if (type === 'buku') {
        container.innerHTML = `<div class="flex flex-col md:flex-row gap-6 items-center md:items-start"><img src="${item.img}" class="w-40 h-56 object-cover rounded-xl shadow-lg shrink-0"><div><span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded font-bold">${item.cat}</span><h3 class="font-extrabold text-xl text-gray-900 mt-2">${item.title}</h3><p class="text-xs text-gray-500 mt-1">${item.desc}</p><div class="mt-4 text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border max-h-48 overflow-y-auto"><p class="font-bold mb-1">Sinopsis / Ringkasan Buku:</p>${item.extra_content}</div><div class="mt-6 flex space-x-3"><button onclick="closeModal('modal-media')" class="bg-gray-200 text-gray-700 text-xs font-bold px-4 py-2.5 rounded-lg">Tutup</button></div></div></div>`;
    } else if (type === 'audio') {
        container.innerHTML = `<div class="text-center py-4"><div class="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl"><i class="fa-solid fa-headphones-simple"></i></div><span class="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded font-bold">${item.cat}</span><h3 class="font-extrabold text-xl text-gray-900 mt-2">${item.title}</h3><p class="text-xs text-gray-500 mt-1 max-w-md mx-auto">${item.desc}</p><div class="mt-6 bg-gray-50 p-4 rounded-xl border max-w-md mx-auto"><audio controls class="w-full"><source src="${item.extra_content}" type="audio/mpeg"></audio></div><button onclick="closeModal('modal-media')" class="mt-6 bg-gray-800 text-white text-xs font-bold px-6 py-2.5 rounded-lg">Selesai</button></div>`;
    } else if (type === 'video') {
        container.innerHTML = `<div><span class="bg-rose-100 text-rose-800 text-xs px-2.5 py-1 rounded font-bold">${item.cat}</span><h3 class="font-extrabold text-lg text-gray-900 mt-1 mb-3">${item.title}</h3><div class="w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-black"><iframe src="${item.extra_content}" class="w-full h-full border-0" allowfullscreen></iframe></div></div>`;
    }
    openModal('modal-media');
}

function selectRole(role) {
    if (role === 'pembaca') { closeModal('modal-role-select'); applyRoleUI('pembaca'); showToast("Mode Pembaca", "Aktif"); }
    else if (role === 'admin') { closeModal('modal-role-select'); openModal('modal-admin-login'); }
}

function handleAdminLogin(event) {
    event.preventDefault();
    if (document.getElementById('admin-user').value === 'admin' && document.getElementById('admin-pass').value === 'admin123') {
        closeModal('modal-admin-login');
        applyRoleUI('admin');
        showToast("Login Berhasil!", "Mode Administrator Aktif.");
        event.target.reset();
    } else { alert("Login salah!"); }
}

function applyRoleUI(role) {
    currentRole = role;
    localStorage.setItem('sr_currentRole', role);
    const badge = document.getElementById('role-badge');
    const badgeText = document.getElementById('role-badge-text');
    
    if (badge && badgeText) {
        if (role === 'admin') {
            badge.className = 'bg-amber-600 text-white px-3 py-1 rounded-full font-bold shadow animate-pulse';
            badgeText.innerText = "Mode: Administrator ⚡";
        } else {
            badge.className = 'bg-blue-800 text-amber-300 px-3 py-1 rounded-full font-bold shadow';
            badgeText.innerText = "Mode: Pembaca";
        }
    }

    ['admin-add-library-btn', 'admin-add-news-btn', 'admin-add-gallery-btn', 'admin-edit-profile-btn'].forEach(id => {
        const btn = document.getElementById(id);
        if(btn) {
            if(role === 'admin') btn.classList.remove('hidden');
            else btn.classList.add('hidden');
        }
    });

    if (document.getElementById('library-content')) renderLibrary(currentTab);
    if (document.getElementById('full-news-container') || document.getElementById('home-news-container')) renderNews();
    if (document.getElementById('gallery-container')) renderGallery();
}

function openCRUDModal(type) {
    document.getElementById('crud-id').value = '';
    document.getElementById('crud-type').value = type;
    document.getElementById('crud-modal-title').innerText = `Tambah ${type.toUpperCase()} Baru`;
    document.getElementById('crud-title').value = '';
    document.getElementById('crud-cat').value = '';
    document.getElementById('crud-desc').value = '';
    document.getElementById('crud-content').value = '';
    document.getElementById('crud-img-file').value = '';
    document.getElementById('crud-img-data').value = '';

    const preview = document.getElementById('crud-img-preview');
    preview.querySelector('img').src = '';
    preview.querySelector('img').classList.add('hidden');
    preview.querySelector('i').classList.remove('hidden');
    preview.classList.add('border-dashed');

    openModal('modal-crud');
}

function openEditModal(type, id) {
    let item;
    if (type === 'berita') item = (window.globalNewsData || []).find(i => i.id == id);
    else if (type === 'galeri') item = (window.globalGalleryData || []).find(i => i.id == id);
    else item = (window.globalLibraryData || []).find(i => i.id == id);
    
    if (!item) return;

    openCRUDModal(type); 
    document.getElementById('crud-id').value = item.id; 
    document.getElementById('crud-modal-title').innerText = `Edit: ${item.title}`;

    document.getElementById('crud-title').value = item.title;
    document.getElementById('crud-cat').value = type === 'berita' ? item.date : item.cat;
    
    const preview = document.getElementById('crud-img-preview');
    const imgElement = preview.querySelector('img');
    const iconElement = preview.querySelector('i');
    
    if(item.img) {
        imgElement.src = item.img;
        imgElement.classList.remove('hidden');
        iconElement.classList.add('hidden');
        preview.classList.remove('border-dashed');
        document.getElementById('crud-img-data').value = item.img;
    }

    document.getElementById('crud-desc').value = item.desc || '';
    document.getElementById('crud-content').value = item.content || item.extra_content || '';
}

function openEditProfileModal() {
    const pData = window.globalProfileData || {};

    ['sejarah', 'visi', 'misi'].forEach(id => { document.getElementById('edit-' + id).value = pData[id] || ''; });
    ['kode', 'tahun', 'kec', 'kab', 'prov', 'luas'].forEach(id => {
        document.getElementById('edit-' + id).value = pData[id === 'kode' ? 'kode_desa' : id === 'kec' ? 'kecamatan' : id === 'kab' ? 'kabupaten' : id === 'prov' ? 'provinsi' : id] || '';
    });

    document.getElementById('edit-jml-penduduk').value = pData.jml_penduduk || '';
    document.getElementById('edit-jml-l').value = pData.jml_laki || '';
    document.getElementById('edit-jml-p').value = pData.jml_perempuan || '';
    document.getElementById('edit-batas-wilayah').value = pData.batas_wilayah || '';
    document.getElementById('edit-list-dusun').value = pData.list_dusun || '';
    document.getElementById('edit-list-perangkat').value = pData.list_perangkat || '';
    document.getElementById('edit-list-bpd').value = pData.list_bpd || '';

    openModal('modal-edit-profile');
}

function switchTab(tabName) {
    currentTab = tabName;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active', 'text-primary', 'font-semibold'));
    const activeBtn = document.getElementById('btn-' + tabName);
    if(activeBtn) activeBtn.classList.add('active', 'text-primary', 'font-semibold');
    renderLibrary(tabName);
}

function handleSearch() { renderLibrary(currentTab, document.getElementById('search-input').value); }

function showToast(title, message) {
    const toast = document.getElementById('toast');
    if (toast) {
        document.getElementById('toast-title').innerText = title;
        document.getElementById('toast-msg').innerText = message;
        toast.classList.remove('hidden');
        setTimeout(() => { toast.classList.add('hidden'); }, 4000);
    }
}