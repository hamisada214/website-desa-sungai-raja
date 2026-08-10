document.addEventListener('DOMContentLoaded', () => {
    // Highlight menu navigasi aktif
    const currentPath = window.location.pathname.split("/").pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('text-primary', 'font-bold');
            link.classList.remove('text-gray-700');
        }
    });

    if (document.getElementById('library-content')) renderLibrary('buku');
    if (document.getElementById('full-news-container') || document.getElementById('home-news-container')) renderNews();
    if (document.getElementById('gallery-container')) renderGallery();
    if (document.getElementById('profile-content-box')) renderProfile();
    
    applyRoleUI(currentRole);

    // Event listener upload gambar
    const imgFileInput = document.getElementById('crud-img-file');
    if (imgFileInput) {
        imgFileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            const preview = document.getElementById('crud-img-preview');
            const imgDataInput = document.getElementById('crud-img-data');

            if (file) {
                if (!file.type.startsWith('image/')) {
                    alert('File bukan gambar!');
                    event.target.value = '';
                    return;
                }
                const reader = new FileReader();
                reader.onload = function(e) {
                    const imgElement = preview.querySelector('img');
                    const iconElement = preview.querySelector('i');
                    imgElement.src = e.target.result;
                    imgElement.classList.remove('hidden');
                    iconElement.classList.add('hidden');
                    preview.classList.remove('border-dashed');
                    imgDataInput.value = e.target.result;
                }
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

// --- RENDER GALERI ---
function renderGallery() {
    const container = document.getElementById('gallery-container');
    if (!container) return;
    container.innerHTML = '';

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
                        <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-2xl"><i class="fa-solid fa-magnifying-glass-plus"></i></div>
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

// --- RENDER PROFIL / DATA DESA ---
function renderProfile() {
    const box = document.getElementById('profile-content-box');
    if (!box) return;
    
    document.getElementById('profile-sejarah-text').innerText = profileData.sejarah;
    document.getElementById('profile-visi-text').innerText = profileData.visi;
    
    const misiList = document.getElementById('profile-misi-list');
    misiList.innerHTML = '';
    profileData.misi.split('\n').forEach(misi => {
        if(misi.trim()) misiList.innerHTML += `<li>${misi}</li>`;
    });

    document.getElementById('val-kode').innerText = ': ' + profileData.kodeDesa;
    document.getElementById('val-tahun').innerText = ': ' + profileData.tahun;
    document.getElementById('val-kec').innerText = ': ' + profileData.kecamatan;
    document.getElementById('val-kab').innerText = ': ' + profileData.kabupaten;
    document.getElementById('val-prov').innerText = ': ' + profileData.provinsi;
    document.getElementById('val-luas').innerText = ': ' + profileData.luas;
}

// --- RENDER PERPUSTAKAAN & BERITA (Sama seperti sebelumnya) ---
function renderLibrary(tab, keyword = '') {
    const container = document.getElementById('library-content');
    if (!container) return;
    container.innerHTML = '';
    
    if(document.getElementById('count-buku')) document.getElementById('count-buku').innerText = libraryData.buku.length;
    if(document.getElementById('count-audio')) document.getElementById('count-audio').innerText = libraryData.audio.length;
    if(document.getElementById('count-video')) document.getElementById('count-video').innerText = libraryData.video.length;

    const filteredData = libraryData[tab].filter(item => 
        item.title.toLowerCase().includes(keyword.toLowerCase()) ||
        item.cat.toLowerCase().includes(keyword.toLowerCase())
    );

    if (filteredData.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-12 text-gray-400 font-medium">Media tidak ditemukan.</div>`;
        return;
    }

    filteredData.forEach(item => {
        const adminButtons = currentRole === 'admin' ? `
            <div class="flex space-x-2 mt-3 pt-3 border-t border-gray-100">
                <button onclick="openEditModal('${tab}', '${item.id}')" class="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold py-1.5 rounded transition flex items-center justify-center space-x-1"><i class="fa-solid fa-pen-to-square"></i><span>Edit</span></button>
                <button onclick="deleteItem('${tab}', '${item.id}')" class="flex-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold py-1.5 rounded transition flex items-center justify-center space-x-1"><i class="fa-solid fa-trash"></i><span>Hapus</span></button>
            </div>` : '';

        let cardHtml = '';
        if (tab === 'buku') {
            cardHtml = `<div class="bg-white rounded-xl shadow border border-gray-100 overflow-hidden flex flex-col justify-between"><img src="${item.img}" class="w-full h-48 object-cover"><div class="p-4 flex-1 flex flex-col justify-between"><div><span class="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold uppercase">${item.cat}</span><h4 class="font-bold text-gray-800 text-sm mt-2 line-clamp-2">${item.title}</h4></div><div><button onclick="openMedia('${tab}', '${item.id}')" class="mt-4 w-full bg-primary text-white text-xs font-semibold py-2 rounded">Baca</button>${adminButtons}</div></div></div>`;
        } else if (tab === 'audio') {
            cardHtml = `<div class="bg-white p-5 rounded-xl shadow border border-gray-100 flex flex-col justify-between"><div class="flex items-center space-x-4"><div class="w-16 h-16 bg-amber-500 rounded-lg flex items-center justify-center text-white text-2xl shrink-0"><i class="fa-solid fa-headphones-simple"></i></div><div><span class="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold uppercase">${item.cat}</span><h4 class="font-bold text-gray-800 text-sm mt-1">${item.title}</h4></div></div><div><button onclick="openMedia('${tab}', '${item.id}')" class="mt-4 w-full bg-amber-600 text-white text-xs font-semibold py-2 rounded">Dengarkan</button>${adminButtons}</div></div>`;
        } else if (tab === 'video') {
            cardHtml = `<div class="bg-white rounded-xl shadow border border-gray-100 overflow-hidden flex flex-col justify-between"><div><div class="relative cursor-pointer" onclick="openMedia('${tab}', '${item.id}')"><img src="${item.img}" class="w-full h-44 object-cover"><div class="absolute inset-0 bg-black/40 flex items-center justify-center"><span class="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-primary"><i class="fa-solid fa-play"></i></span></div></div><div class="p-4"><span class="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold uppercase">${item.cat}</span><h4 class="font-bold text-gray-800 text-sm mt-1">${item.title}</h4></div></div><div class="px-4 pb-4"><button onclick="openMedia('${tab}', '${item.id}')" class="w-full bg-rose-600 text-white text-xs font-semibold py-2 rounded">Tonton</button>${adminButtons}</div></div>`;
        }
        container.innerHTML += cardHtml;
    });
}

function renderNews() {
    const homeContainer = document.getElementById('home-news-container');
    const fullContainer = document.getElementById('full-news-container');
    if (homeContainer) homeContainer.innerHTML = '';
    if (fullContainer) fullContainer.innerHTML = '';

    newsData.forEach((item, index) => {
        const adminButtons = currentRole === 'admin' ? `
            <div class="flex space-x-2">
                <button onclick="openEditModal('berita', '${item.id}')" class="bg-amber-500 text-white px-3 py-1 rounded text-xs font-bold">Edit</button>
                <button onclick="deleteItem('berita', '${item.id}')" class="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold">Hapus</button>
            </div>` : '';

        const cardHtml = `<article class="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 flex flex-col justify-between"><div><img src="${item.img}" class="w-full h-52 object-cover"><div class="p-6"><span class="text-xs text-gray-400">${item.date}</span><h3 class="font-bold text-lg text-gray-800 mt-2 cursor-pointer" onclick="openNews('${item.id}')">${item.title}</h3><p class="text-sm text-gray-600 mt-3 line-clamp-3">${item.desc}</p></div></div><div class="px-6 pb-6 pt-2 flex justify-between border-t mt-2"><button onclick="openNews('${item.id}')" class="text-sm font-bold text-primary">Selengkapnya</button>${adminButtons}</div></article>`;
        
        if (homeContainer && index < 3) homeContainer.innerHTML += cardHtml;
        if (fullContainer) fullContainer.innerHTML += cardHtml;
    });
}

// --- MODAL & PERAN ---
function openModal(modalId) { const el = document.getElementById(modalId); if (el) el.classList.remove('hidden'); }
function closeModal(modalId) { const el = document.getElementById(modalId); if (el) el.classList.add('hidden'); }
function closeMobileMenu() { const el = document.getElementById('mobile-menu'); if(el) el.classList.add('hidden'); }
function openGalleryModal(title, imgSrc) {
    document.getElementById('gallery-zoom-title').innerText = title;
    document.getElementById('gallery-zoom-img').src = imgSrc;
    openModal('modal-gallery');
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
        showToast("Login Berhasil!", "Mode Admin Aktif.");
        event.target.reset();
    } else { alert("Login salah! Gunakan admin / admin123"); }
}

function applyRoleUI(role) {
    currentRole = role;
    saveStorage();
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

    // Tampilkan tombol tambah admin jika ada
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

// --- CRUD MASTER SYSTEM ---
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
    if (type === 'berita') item = newsData.find(i => i.id === id);
    else if (type === 'galeri') item = galleryData.find(i => i.id === id);
    else item = libraryData[type].find(i => i.id === id);
    
    if (!item) return;

    openCRUDModal(type);
    document.getElementById('crud-id').value = item.id;
    document.getElementById('crud-modal-title').innerText = `Edit: "${item.title}"`;

    document.getElementById('crud-title').value = item.title;
    document.getElementById('crud-cat').value = type === 'berita' ? item.date : item.cat;
    
    const preview = document.getElementById('crud-img-preview');
    const imgElement = preview.querySelector('img');
    const iconElement = preview.querySelector('i');
    imgElement.src = item.img;
    imgElement.classList.remove('hidden');
    iconElement.classList.add('hidden');
    preview.classList.remove('border-dashed');
    document.getElementById('crud-img-data').value = item.img;

    document.getElementById('crud-desc').value = item.desc || '';
    if (type === 'berita' || type === 'buku') document.getElementById('crud-content').value = item.content || '';
    if (type === 'audio') document.getElementById('crud-content').value = item.audio || '';
    if (type === 'video') document.getElementById('crud-content').value = item.video || '';
}

function handleCRUDSave(event) {
    event.preventDefault();
    const id = document.getElementById('crud-id').value;
    const type = document.getElementById('crud-type').value;
    
    const title = document.getElementById('crud-title').value;
    const catOrDate = document.getElementById('crud-cat').value;
    const img = document.getElementById('crud-img-data').value || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
    const desc = document.getElementById('crud-desc').value;
    const contentOrUrl = document.getElementById('crud-content').value;

    if (id) {
        if (type === 'berita') {
            const idx = newsData.findIndex(i => i.id === id);
            if (idx !== -1) newsData[idx] = { id, title, date: catOrDate, img, desc, content: contentOrUrl };
        } else if (type === 'galeri') {
            const idx = galleryData.findIndex(i => i.id === id);
            if (idx !== -1) galleryData[idx] = { id, title, cat: catOrDate, img };
        } else {
            const idx = libraryData[type].findIndex(i => i.id === id);
            if (idx !== -1) {
                let updated = { id, title, cat: catOrDate, img, desc };
                if (type === 'buku') updated.content = contentOrUrl;
                if (type === 'audio') updated.audio = contentOrUrl;
                if (type === 'video') updated.video = contentOrUrl;
                libraryData[type][idx] = updated;
            }
        }
        showToast("Berhasil", "Data diperbarui.");
    } else {
        const newId = type[0] + Date.now().toString().slice(-4);
        if (type === 'berita') {
            newsData.unshift({ id: newId, title, date: catOrDate, img, desc, content: contentOrUrl });
        } else if (type === 'galeri') {
            galleryData.unshift({ id: newId, title, cat: catOrDate, img });
        } else {
            let newItem = { id: newId, title, cat: catOrDate, img, desc };
            if (type === 'buku') newItem.content = contentOrUrl;
            if (type === 'audio') newItem.audio = contentOrUrl;
            if (type === 'video') newItem.video = contentOrUrl;
            libraryData[type].unshift(newItem);
        }
        showToast("Berhasil", "Data ditambahkan.");
    }

    saveStorage();
    closeModal('modal-crud');
    
    if (type === 'berita') renderNews();
    else if (type === 'galeri') renderGallery();
    else renderLibrary(type);
}

function deleteItem(type, id) {
    if (confirm("Hapus data ini?")) {
        if (type === 'berita') { newsData = newsData.filter(i => i.id !== id); renderNews(); }
        else if (type === 'galeri') { galleryData = galleryData.filter(i => i.id !== id); renderGallery(); }
        else { libraryData[type] = libraryData[type].filter(i => i.id !== id); renderLibrary(type); }
        saveStorage();
        showToast("Dihapus", "Data berhasil dihapus.");
    }
}

// --- EDIT PROFIL / DATA DESA ---
function openEditProfileModal() {
    document.getElementById('edit-sejarah').value = profileData.sejarah;
    document.getElementById('edit-visi').value = profileData.visi;
    document.getElementById('edit-misi').value = profileData.misi;
    document.getElementById('edit-kode').value = profileData.kodeDesa;
    document.getElementById('edit-tahun').value = profileData.tahun;
    document.getElementById('edit-kec').value = profileData.kecamatan;
    document.getElementById('edit-kab').value = profileData.kabupaten;
    document.getElementById('edit-prov').value = profileData.provinsi;
    document.getElementById('edit-luas').value = profileData.luas;
    openModal('modal-edit-profile');
}

function handleProfileSave(event) {
    event.preventDefault();
    profileData.sejarah = document.getElementById('edit-sejarah').value;
    profileData.visi = document.getElementById('edit-visi').value;
    profileData.misi = document.getElementById('edit-misi').value;
    profileData.kodeDesa = document.getElementById('edit-kode').value;
    profileData.tahun = document.getElementById('edit-tahun').value;
    profileData.kecamatan = document.getElementById('edit-kec').value;
    profileData.kabupaten = document.getElementById('edit-kab').value;
    profileData.provinsi = document.getElementById('edit-prov').value;
    profileData.luas = document.getElementById('edit-luas').value;

    saveStorage();
    closeModal('modal-edit-profile');
    renderProfile();
    showToast("Berhasil", "Profil dan Data Desa diperbarui.");
}

function switchTab(tabName) {
    currentTab = tabName;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active', 'text-primary', 'font-semibold'));
    document.querySelectorAll('.tab-btn span').forEach(badge => { badge.className = 'ml-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold'; });
    const activeBtn = document.getElementById('btn-' + tabName);
    if(activeBtn) {
        activeBtn.classList.add('active', 'text-primary', 'font-semibold');
        activeBtn.querySelector('span').className = 'ml-1 bg-blue-100 text-primary px-2 py-0.5 rounded-full text-xs font-bold';
    }
    if(document.getElementById('add-btn-type-label')) {
        document.getElementById('add-btn-type-label').innerText = tabName === 'buku' ? 'Buku' : (tabName === 'audio' ? 'Audio' : 'Video');
    }
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