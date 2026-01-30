// نظام معرض الصور والأرباح المتكامل
const GallerySystem = {
    // تهيئة النظام
    init() {
        console.log('📷 Gallery & Earnings System Initialized');
        this.checkDailyReset();
    },

    // إحصائيات عامة
    stats: {
        getTotalEarnings() {
            const data = JSON.parse(localStorage.getItem('earnings') || '{"total":0}');
            return data.total.toFixed(2);
        },
        
        getTodayEarnings() {
            const data = JSON.parse(localStorage.getItem('earnings') || '{"today":0}');
            return data.today.toFixed(2);
        },
        
        getTotalViews() {
            const data = JSON.parse(localStorage.getItem('earnings') || '{"views":0}');
            return data.views;
        }
    },

    // إعادة تعيين الأرباح اليومية
    checkDailyReset() {
        const lastReset = localStorage.getItem('lastReset');
        const today = new Date().toDateString();
        
        if (lastReset !== today) {
            let earnings = JSON.parse(localStorage.getItem('earnings') || '{}');
            earnings.today = 0;
            localStorage.setItem('earnings', JSON.stringify(earnings));
            localStorage.setItem('lastReset', today);
            console.log('✅ Daily earnings reset');
        }
    },

    // إضافة أرباح
    addEarnings(amount, type = 'general') {
        let earnings = JSON.parse(localStorage.getItem('earnings') || '{"total":0,"today":0,"views":0,"clicks":0,"videoViews":0,"completed":0}');
        
        earnings.total += amount;
        earnings.today += amount;
        
        // تحديث العدادات حسب النوع
        switch(type) {
            case 'click': earnings.clicks++; break;
            case 'video': earnings.videoViews++; break;
            case 'view': earnings.views++; break;
            case 'complete': earnings.completed++; break;
        }
        
        localStorage.setItem('earnings', JSON.stringify(earnings));
        console.log(`💰 Added $${amount} from ${type}`);
        return earnings;
    },

    // تسجيل نشاط المستخدم
    logActivity(action, details = {}) {
        const logs = JSON.parse(localStorage.getItem('activity_logs') || '[]');
        logs.push({
            action,
            details,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        });
        localStorage.setItem('activity_logs', JSON.stringify(logs.slice(-100))); // حفظ آخر 100 نشاط
    }
};

// تهيئة تلقائية
GallerySystem.init();

// دوال مساعدة عامة
function formatCurrency(amount) {
    return '$' + parseFloat(amount).toFixed(2);
}

function formatNumber(num) {
    return num.toLocaleString('en-US');
}

// تصدير للاستخدام العام
window.GallerySystem = GallerySystem;
window.formatCurrency = formatCurrency;
window.formatNumber = formatNumber;

console.log('🚀 System Ready - Total Earnings: ' + formatCurrency(GallerySystem.stats.getTotalEarnings()));
