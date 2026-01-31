// ==================== نظام الربح المتكامل ====================

const App = {
    data: {
        folders: [],
        photos: [],
        earnings: { usd: 0, btc: 0, today: 0, totalViews: 0, adsWatched: 0 },
        tasks: { completed: [] },
        withdrawals: []
    },

    init() {
        this.loadData();
        this.checkDailyReset();
        this.renderEarnPage();
        this.renderTasks();
        this.renderGallery();
        this.updateStats();
        
        // إظهار تبويب الربح افتراضياً
        switchTab('earn');
        
        console.log('✅ App Initialized');
    },

    loadData() {
        const saved = localStorage.getItem('galleryAppData');
        if (saved) this.data = JSON.parse(saved);
    },

    save() {
        localStorage.setItem('galleryAppData', JSON.stringify(this.data));
        this.updateStats();
    },

    checkDailyReset() {
        const last = localStorage.getItem('lastReset');
        const today = new Date().toDateString();
        if (last !== today) {
            this.data.earnings.today = 0;
            this.data.tasks.completed = [];
            localStorage.setItem('lastReset', today);
            this.save();
        }
    },

    updateStats() {
        document.getElementById('statUsd').textContent = '$' + this.data.earnings.usd.toFixed(2);
        document.getElementById('statBtc').textContent = '₿' + this.data.earnings.btc.toFixed(6);
        document.getElementById('statToday').textContent = '$' + this.data.earnings.today.toFixed(2);
        document.getElementById('statViews').textContent = this.data.earnings.totalViews;
    },

    // ==================== صفحة الربح ====================
    renderEarnPage() {
        const ads = [
            { icon: '📢', title: 'إعلان بانر', desc: 'اضغط لمشاهدة إعلان بانر', reward: 0.005, time: 5 },
            { icon: '🎬', title: 'فيديو إعلاني', desc: 'شاهد فيديو كاملاً', reward: 0.02, time: 30 },
            { icon: '📊', title: 'استبيان قصير', desc: 'أجب على استبيان', reward: 0.05, time: 60 },
            { icon: '🎮', title: 'لعبة تفاعلية', desc: 'العب لعبة بسيطة', reward: 0.03, time: 45 },
            { icon: '🎁', title: 'عرض خاص', desc: 'سجل في موقع شريك', reward: 0.10, time: 120 },
            { icon: '⛏️', title: 'تعدين سريع', desc: 'انقر للتعدين الفوري', reward: 0.001, time: 3 }
        ];

        const grid = document.getElementById('earnGrid');
        grid.innerHTML = ads.map(ad => `
            <div class="ad-card" onclick="App.watchAd('${ad.icon}', '${ad.title}', ${ad.reward}, ${ad.time})">
                <div class="ad-icon">${ad.icon}</div>
                <div class="ad-title">${ad.title}</div>
                <div class="ad-desc">${ad.desc}</div>
                <div style="color:#64748b;margin:0.5rem 0">${ad.time} ثانية</div>
                <div class="ad-reward">+$${ad.reward.toFixed(3)}</div>
            </div>
        `).join('');
    },

    watchAd(icon, title, reward, time) {
        document.getElementById('adModal').classList.add('active');
        document.getElementById('adIcon').textContent = icon;
        document.getElementById('adTitle').textContent = title;
        document.getElementById('adTimer').textContent = time;
        document.getElementById('adBtn').disabled = true;
        document.getElementById('adBtn').textContent = 'انتظر...';
        document.getElementById('adBtn').className = 'btn btn-secondary';
        document.getElementById('adBtn').onclick = null;

        let elapsed = 0;
        const timer = setInterval(() => {
            elapsed++;
            const remaining = time - elapsed;
            
            document.getElementById('adTimer').textContent = remaining;
            document.getElementById('adProgress').style.width = (elapsed / time * 100) + '%';

            if (remaining <= 0) {
                clearInterval(timer);
                document.getElementById('adBtn').disabled = false;
                document.getElementById('adBtn').textContent = `احصل على $${reward.toFixed(3)}`;
                document.getElementById('adBtn').className = 'btn btn-success';
                document.getElementById('adBtn').onclick = () => {
                    this.completeAd(reward);
                };
            }
        }, 1000);
    },

    completeAd(reward) {
        closeModal('adModal');
        
        this.data.earnings.usd += reward;
        this.data.earnings.today += reward;
        this.data.earnings.btc += reward * 0.000015 * 0.1;
        this.data.earnings.adsWatched++;
        this.save();
        
        showNotification(`🎉 ربحت $${reward.toFixed(3)}!`);
        
        // إعادة تعيين العداد
        document.getElementById('adProgress').style.width = '0%';
    },

    // ==================== المهام ====================
    renderTasks() {
        const tasks = [
            { id: 1, icon: '👁️', title: 'شاهد 10 صور', reward: 0.01 },
            { id: 2, icon: '📢', title: 'شاهد 5 إعلانات', reward: 0.025 },
            { id: 3, icon: '🎁', title: 'ادعو صديق', reward: 0.05 },
            { id: 4, icon: '⛏️', title: 'عدّن 50 مرة', reward: 0.03 }
        ];

        const container = document.getElementById('tasksContainer');
        container.innerHTML = tasks.map(t => {
            const completed = this.data.tasks.completed.includes(t.id);
            return `
                <div class="task-item">
                    <div class="task-info">
                        <span class="task-icon">${t.icon}</span>
                        <div>
                            <div style="font-weight:bold">${t.title}</div>
                            <small style="color:#64748b">+$${t.reward.toFixed(3)}</small>
                        </div>
                    </div>
                    <button class="btn ${completed ? 'btn-success' : 'btn-primary'}" 
                            ${completed ? 'disabled' : `onclick="App.claimTask(${t.id}, ${t.reward})"`}>
                        ${completed ? '✅ تم' : 'استلام'}
                    </button>
                </div>
            `;
        }).join('');
    },

    claimTask(id, reward) {
        if (this.data.tasks.completed.includes(id)) return;
        
        this.data.tasks.completed.push(id);
        this.data.earnings.usd += reward;
        this.data.earnings.today += reward;
        this.save();
        this.renderTasks();
        showNotification(`✅ تم استلام $${reward.toFixed(3)}!`);
    },

    // ==================== المعرض ====================
    renderGallery() {
        const grid = document.getElementById('foldersGrid');
        if (!this.data.folders.length) {
            grid.innerHTML = '<p style="color:#64748b;text-align:center;grid-column:1/-1;padding:2rem">لا توجد مجموعات. أنشئ واحدة!</p>';
            return;
        }

        grid.innerHTML = this.data.folders.map(f => {
            const count = this.data.photos.filter(p => p.folderId === f.id).length;
            return `
                <div class="folder-card" onclick="App.openFolder('${f.id}')">
                    <div class="folder-icon">📁</div>
                    <div class="folder-info">
                        <div style="font-weight:bold">${f.name}</div>
                        <small style="color:#64748b">${count} صورة</small>
                    </div>
                </div>
            `;
        }).join('');
    },

    openFolder(folderId) {
        this.currentFolder = folderId;
        const folder = this.data.folders.find(f => f.id === folderId);
        
        document.getElementById('galleryView').classList.add('hidden');
        document.getElementById('photosView').classList.remove('hidden');
        document.getElementById('currentFolderName').textContent = folder.name;

        const photos = this.data.photos.filter(p => p.folderId === folderId);
        const grid = document.getElementById('photosGrid');
        
        if (!photos.length) {
            grid.innerHTML = '<p style="color:#64748b;text-align:center;grid-column:1/-1">لا توجد صور</p>';
        } else {
            grid.innerHTML = photos.map(p => `
                <div class="photo-card" onclick="App.viewPhoto('${p.src}')">
                    <div class="photo-img"><img src="${p.src}" alt="صورة"></div>
                </div>
            `).join('');
        }
    },

    viewPhoto(src) {
        this.data.earnings.totalViews++;
        this.data.earnings.usd += 0.001;
        this.data.earnings.today += 0.001;
        this.save();
        window.open(src, '_blank');
    }
};

// ==================== دوال عامة ====================

function switchTab(tabName) {
    // تحديث الأزرار
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + tabName)?.classList.add('active');
    
    // تحديث المحتوى
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById('tab-content-' + tabName)?.classList.add('active');
    
    console.log('Switched to:', tabName);
}

function showModal(id) {
    document.getElementById(id)?.classList.add('active');
}

function closeModal(id) {
    document.getElementById(id)?.classList.remove('active');
}

function showNotification(msg, type = 'success') {
    const n = document.getElementById('notification');
    n.textContent = msg;
    n.className = 'notification show' + (type === 'error' ? ' error' : '');
    setTimeout(() => n.classList.remove('show'), 3000);
}

function acceptCookies() {
    document.getElementById('cookieBanner').style.display = 'none';
    localStorage.setItem('cookiesAccepted', 'true');
}

// ==================== العملات الرقمية ====================

let selectedCrypto = '';
const cryptoRates = { BTC: 0.000015, ETH: 0.00025, USDT: 1, BNB: 0.0015 };

function selectCrypto(currency, element) {
    selectedCrypto = currency;
    document.querySelectorAll('.crypto-option').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
    document.getElementById('withdrawForm').style.display = 'block';
}

function calculateCrypto() {
    if (!selectedCrypto) return;
    const usd = parseFloat(document.getElementById('withdrawAmount').value) || 0;
    const crypto = (usd * cryptoRates[selectedCrypto]).toFixed(6);
    document.getElementById('cryptoAmount').textContent = crypto + ' ' + selectedCrypto;
}

function submitWithdrawal() {
    const addr = document.getElementById('walletAddress').value.trim();
    const amt = parseFloat(document.getElementById('withdrawAmount').value);
    const min = selectedCrypto === 'USDT' ? 5 : 10;
    
    if (!addr) return showNotification('❌ أدخل عنوان المحفظة', 'error');
    if (amt < min) return showNotification(`❌ الحد الأدنى $${min}`, 'error');
    if (amt > App.data.earnings.usd) return showNotification('❌ رصيد غير كافٍ', 'error');
    
    App.data.earnings.usd -= amt;
    App.data.withdrawals.push({
        id: Date.now(),
        crypto: selectedCrypto,
        amount: amt,
        address: addr,
        status: 'pending',
        date: new Date().toISOString()
    });
    
    App.save();
    showNotification('✅ تم إرسال طلب السحب!');
    
    // إعادة تعيين
    document.getElementById('walletAddress').value = '';
    document.getElementById('withdrawAmount').value = '';
    document.getElementById('cryptoAmount').textContent = '0';
}

// ==================== المعرض ====================

function createFolder() {
    const name = document.getElementById('folderName').value.trim();
    if (!name) return showNotification('❌ أدخل اسم المجلد', 'error');
    
    App.data.folders.push({
        id: Date.now().toString(),
        name: name
    });
    
    App.save();
    App.renderGallery();
    closeModal('folderModal');
    document.getElementById('folderName').value = '';
    showNotification('✅ تم إنشاء المجلد!');
}

function backToFolders() {
    document.getElementById('galleryView').classList.remove('hidden');
    document.getElementById('photosView').classList.add('hidden');
}

function uploadPhotos(input) {
    if (!input.files.length) return;
    
    const folderId = App.currentFolder || (App.data.folders[0]?.id) || createDefaultFolder();
    
    Array.from(input.files).forEach(file => {
        if (!file.type.startsWith('image/')) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            App.data.photos.push({
                id: Date.now().toString(),
                folderId: folderId,
                src: e.target.result
            });
            App.save();
            App.renderGallery();
        };
        reader.readAsDataURL(file);
    });
    
    showNotification('✅ تم رفع الصور!');
}

function createDefaultFolder() {
    const id = Date.now().toString();
    App.data.folders.push({ id, name: 'مجموعة افتراضية' });
    return id;
}

// ==================== التهيئة ====================

document.addEventListener('DOMContentLoaded', () => {
    App.init();
    
    if (localStorage.getItem('cookiesAccepted')) {
        document.getElementById('cookieBanner').style.display = 'none';
    }
});
                                                                    
