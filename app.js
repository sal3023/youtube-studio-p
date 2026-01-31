const App = {
    data: {
        folders: [],
        photos: [],
        earnings: { usd: 0, btc: 0, today: 0, totalViews: 0, adsWatched: 0 },
        tasks: { completed: [] },
        referrals: [],
        withdrawals: []
    },

    init() {
        this.loadData();
        this.checkDailyReset();
        this.renderAll();
        this.generateAds();
        this.generateTasks();
    },

    loadData() {
        const saved = localStorage.getItem('appData');
        if (saved) this.data = JSON.parse(saved);
    },

    save() {
        localStorage.setItem('appData', JSON.stringify(this.data));
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
        document.getElementById('refCount').textContent = this.data.referrals.length;
        document.getElementById('refEarn').textContent = '$' + (this.data.referrals.reduce((a,b) => a + b.earn * 0.1, 0)).toFixed(2);
        document.getElementById('refLink').textContent = location.origin + '?ref=' + Math.random().toString(36).substr(2, 8);
    },

    generateAds() {
        const ads = [
            { icon: '📢', title: 'إعلان بانر', reward: 0.005, time: 5 },
            { icon: '🎬', title: 'فيديو', reward: 0.02, time: 30 },
            { icon: '📊', title: 'استبيان', reward: 0.05, time: 60 },
            { icon: '🎮', title: 'لعبة', reward: 0.03, time: 45 },
            { icon: '🎁', title: 'عرض', reward: 0.10, time: 120 },
            { icon: '⛏️', title: 'تعدين', reward: 0.001, time: 3 }
        ];
        document.getElementById('adGrid').innerHTML = ads.map(ad => `
            <div class="ad-card" onclick="App.watchAd('${ad.icon}',${ad.reward},${ad.time})">
                <div class="ad-icon">${ad.icon}</div>
                <div style="font-weight:bold">${ad.title}</div>
                <div style="color:#64748b;font-size:0.9rem">${ad.time} ثانية</div>
                <div class="ad-reward">+$${ad.reward.toFixed(3)}</div>
            </div>
        `).join('');
    },

    generateTasks() {
        const tasks = [
            { id: 1, icon: '👁️', title: 'شاهد 10 صور', reward: 0.01 },
            { id: 2, icon: '📢', title: 'شاهد 5 إعلانات', reward: 0.025 },
            { id: 3, icon: '🎁', title: 'ادعو صديق', reward: 0.05 }
        ];
        document.getElementById('tasksList').innerHTML = tasks.map(t => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:1rem;background:#1e293b;border-radius:12px;margin-bottom:0.5rem">
                <div style="display:flex;align-items:center;gap:1rem">
                    <span style="font-size:1.5rem">${t.icon}</span>
                    <div>
                        <div style="font-weight:bold">${t.title}</div>
                        <small style="color:#64748b">+$${t.reward.toFixed(3)}</small>
                    </div>
                </div>
                <button class="btn ${this.data.tasks.completed.includes(t.id) ? 'btn-success' : 'btn-primary'}" 
                        ${this.data.tasks.completed.includes(t.id) ? 'disabled' : `onclick="App.claimTask(${t.id},${t.reward})"`}>
                    ${this.data.tasks.completed.includes(t.id) ? '✅ تم' : 'استلام'}
                </button>
            </div>
        `).join('');
    },

    watchAd(icon, reward, time) {
        document.getElementById('adModal').classList.add('active');
        document.getElementById('adIcon').textContent = icon;
        document.getElementById('adTimer').textContent = time;
        document.getElementById('adBtn').disabled = true;
        document.getElementById('adBtn').textContent = 'انتظر...';
        
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
                document.getElementById('adBtn').onclick = () => {
                    this.data.earnings.usd += reward;
                    this.data.earnings.today += reward;
                    this.data.earnings.btc += reward * 0.000015 * 0.1;
                    this.data.earnings.adsWatched++;
                    this.save();
                    closeModal('adModal');
                    this.showNotif(`🎉 ربحت $${reward.toFixed(3)}!`);
                };
            }
        }, 1000);
    },

    claimTask(id, reward) {
        if (this.data.tasks.completed.includes(id)) return;
        this.data.tasks.completed.push(id);
        this.data.earnings.usd += reward;
        this.data.earnings.today += reward;
        this.save();
        this.generateTasks();
        this.showNotif(`✅ +$${reward.toFixed(3)}`);
    },

    renderAll() {
        this.updateStats();
        this.renderFolders();
        this.renderHistory();
    },

    renderFolders() {
        const grid = document.getElementById('foldersGrid');
        if (!this.data.folders.length) {
            grid.innerHTML = '<p style="color:#64748b;text-align:center">لا توجد مجموعات</p>';
            return;
        }
        grid.innerHTML = this.data.folders.map(f => {
            const count = this.data.photos.filter(p => p.folder === f.id).length;
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

    openFolder(id) {
        this.currentFolder = id;
        document.getElementById('galleryView').style.display = 'none';
        document.getElementById('photosView').style.display = 'block';
        document.getElementById('currentFolderName').textContent = this.data.folders.find(f => f.id === id)?.name;
        
        const photos = this.data.photos.filter(p => p.folder === id);
        document.getElementById('photosGrid').innerHTML = photos.map(p => `
            <div class="photo-card" onclick="App.viewPhoto('${p.src}')">
                <div class="photo-img"><img src="${p.src}"></div>
            </div>
        `).join('');
    },

    viewPhoto(src) {
        this.data.earnings.totalViews++;
        this.data.earnings.usd += 0.001;
        this.save();
        window.open(src, '_blank');
    },

    renderHistory() {
        const list = document.getElementById('historyList');
        if (!this.data.withdrawals.length) {
            list.innerHTML = '<p style="color:#64748b;text-align:center">لا توجد معاملات</p>';
            return;
        }
        list.innerHTML = this.data.withdrawals.map(w => `
            <div class="history-item">
                <div>
                    <div style="color:#f7931a;font-weight:bold">${w.crypto} ${w.amount}</div>
                    <small style="color:#64748b">${new Date(w.date).toLocaleDateString('ar-SA')}</small>
                </div>
                <span class="status-${w.status}">${w.status === 'pending' ? '⏳ قيد المراجعة' : '✅ مكتمل'}</span>
            </div>
        `).join('');
    },

    showNotif(msg) {
        const n = document.getElementById('notification');
        n.textContent = msg;
        n.classList.add('show');
        setTimeout(() => n.classList.remove('show'), 3000);
    }
};

// دوال عامة
function showTab(tab) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById('content-' + tab)?.classList.add('active');
    document.getElementById('tab-' + tab)?.classList.add('active');
}

function closeModal(id) {
    document.getElementById(id)?.classList.remove('active');
}

function showPrivacy() {
    document.getElementById('privacyModal').classList.add('active');
}

function acceptCookies() {
    document.getElementById('cookieBanner').style.display = 'none';
    localStorage.setItem('cookies', '1');
}

function selectCrypto(c, el) {
    document.querySelectorAll('.crypto-option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    document.getElementById('withdrawForm').style.display = 'block';
    window.selectedCrypto = c;
}

function calculateCrypto() {
    const amt = parseFloat(document.getElementById('withdrawAmount').value) || 0;
    const rates = { BTC: 0.000015, ETH: 0.00025, USDT: 1, BNB: 0.0015 };
    document.getElementById('cryptoAmount').textContent = (amt * rates[window.selectedCrypto]).toFixed(6) + ' ' + window.selectedCrypto;
}

function submitWithdrawal() {
    const addr = document.getElementById('walletAddress').value;
    const amt = parseFloat(document.getElementById('withdrawAmount').value);
    const min = window.selectedCrypto === 'USDT' ? 5 : 10;
    
    if (!addr) return App.showNotif('❌ أدخل العنوان');
    if (amt < min) return App.showNotif(`❌ الحد الأدنى $${min}`);
    if (amt > App.data.earnings.usd) return App.showNotif('❌ رصيد غير كافٍ');
    
    App.data.earnings.usd -= amt;
    App.data.withdrawals.push({
        id: Date.now(),
        crypto: window.selectedCrypto,
        amount: amt,
        address: addr,
        status: 'pending',
        date: new Date().toISOString()
    });
    App.save();
    App.renderHistory();
    App.showNotif('✅ تم إرسال الطلب!');
    
    document.getElementById('walletAddress').value = '';
    document.getElementById('withdrawAmount').value = '';
}

function copyRefLink() {
    navigator.clipboard.writeText(document.getElementById('refLink').textContent);
    App.showNotif('✅ تم النسخ!');
}

function showFolderModal() {
    document.getElementById('folderModal').classList.add('active');
}

function createFolder() {
    const name = document.getElementById('folderName').value.trim();
    if (!name) return;
    App.data.folders.push({ id: Date.now().toString(), name });
    App.save();
    App.renderFolders();
    closeModal('folderModal');
    document.getElementById('folderName').value = '';
}

function backToFolders() {
    document.getElementById('galleryView').style.display = 'block';
    document.getElementById('photosView').style.display = 'none';
}

function uploadPhotos(input) {
    if (!input.files.length) return;
    const folder = App.currentFolder || (App.data.folders[0]?.id) || (() => {
        const id = Date.now().toString();
        App.data.folders.push({ id, name: 'افتراضي' });
        return id;
    })();
    
    Array.from(input.files).forEach(file => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = e => {
            App.data.photos.push({ id: Date.now(), folder, src: e.target.result });
            App.save();
            App.renderFolders();
        };
        reader.readAsDataURL(file);
    });
    App.showNotif('✅ تم الرفع!');
}

document.addEventListener('DOMContentLoaded', () => {
    App.init();
    if (localStorage.getItem('cookies')) document.getElementById('cookieBanner').style.display = 'none';
});
