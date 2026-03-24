import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onValue, query, orderByChild } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// ======================================================
// 🔥 Firebase Configuration
// ======================================================
const firebaseConfig = {
    apiKey: "AIzaSyCt-HiQkDoeAxnJN7VwsmEpoxwWQmCC69E",
    authDomain: "esc-info-92948.firebaseapp.com",
    databaseURL: "https://esc-info-92948-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "esc-info-92948",
    storageBucket: "esc-info-92948.firebasestorage.app",
    messagingSenderId: "411200026634",
    appId: "1:411200026634:web:afd8074af0d02ee93087f3"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const inquiriesRef = ref(db, 'inquiries');

let currentBranch = "";
let activeSubScreen = "";
let myInquiryKeys = JSON.parse(sessionStorage.getItem('myInquiryKeys') || '[]');
let allInquiries = {};

// Firebase 실시간 데이터 수신
onValue(query(inquiriesRef, orderByChild('timestamp')), (snapshot) => {
    allInquiries = {};
    snapshot.forEach((child) => {
        allInquiries[child.key] = child.val();
    });
});

// ---- 데이터 정의 ----
const commonPricingArray = [
    { title: "일일 이용권", note: "*환불, 시간 정지 불가", icon: "fas fa-hourglass-half", items: [ {time: "3시간", price: "6,000원"}, {time: "4시간", price: "7,000원"}, {time: "6시간", price: "9,000원"}, {time: "8시간", price: "10,000원"}, {time: "12시간", price: "13,000원"} ] },
    { title: "시간 이용권", note: "*퇴장시 반드시 퇴실 체크", icon: "fas fa-stopwatch", items: [ {time: "30시간", price: "50,000원"}, {time: "50시간", price: "65,000원"}, {time: "100시간", price: "120,000원"}, {time: "200시간", price: "220,000원"} ] },
    { title: "기간권", note: "*퇴장시 반드시 퇴실 체크", icon: "far fa-calendar-alt", items: [ {time: "2주", price: "90,000원"}, {time: "4주", price: "140,000원"}, {time: "8주", price: "270,000원"}, {time: "12주", price: "400,000원"}, {time: "16주", price: "530,000원"} ] },
    { title: "고정석 이용권", note: "", icon: "fas fa-chair", items: [ {time: "2주", price: "130,000원"}, {time: "4주", price: "190,000원"}, {time: "8주", price: "370,000원"}, {time: "12주", price: "540,000원"}, {time: "16주", price: "700,000원"} ] },
    { title: "사물함 요금", note: "*무인결제기에서 결제 후 사용 가능", icon: "fas fa-box", items: [ {time: "4주", price: "10,000원"}, {time: "8주", price: "19,000원"}, {time: "12주", price: "28,000원"} ] }
];
const sinjungdongPricingArray = [
    { title: "일일 이용권", note: "*환불, 시간 정지 불가", icon: "fas fa-hourglass-half", items: [ {time: "3시간", price: "6,000원"}, {time: "4시간", price: "7,000원"}, {time: "6시간", price: "9,000원"}, {time: "8시간", price: "10,000원"}, {time: "12시간", price: "13,000원"} ] },
    { title: "시간 이용권 (할인 특가)", note: "*퇴장시 반드시 퇴실 체크", icon: "fas fa-stopwatch", items: [ {time: "100시간 <span style='font-size:0.75rem; color:#9E9E9E; display:block; margin-top:2px;'>유효기간 100일</span>", price: "<span style='text-decoration:line-through; font-size:0.8rem; color:#BDBDBD; margin-right:6px;'>12만</span>109,000원"}, {time: "150시간 <span style='font-size:0.75rem; color:#9E9E9E; display:block; margin-top:2px;'>유효기간 110일</span>", price: "<span style='text-decoration:line-through; font-size:0.8rem; color:#BDBDBD; margin-right:6px;'>17.5만</span>150,000원"}, {time: "200시간 <span style='font-size:0.75rem; color:#9E9E9E; display:block; margin-top:2px;'>유효기간 120일</span>", price: "<span style='text-decoration:line-through; font-size:0.8rem; color:#BDBDBD; margin-right:6px;'>22만</span>180,000원"}, {time: "300시간", price: "310,000원"} ] },
    { title: "기간권", note: "*퇴장시 반드시 퇴실 체크", icon: "far fa-calendar-alt", items: [ {time: "4주", price: "120,000원"}, {time: "8주", price: "230,000원"}, {time: "12주", price: "335,000원"} ] },
    { title: "고정석 이용권", note: "", icon: "fas fa-chair", items: [ {time: "2주", price: "130,000원"}, {time: "4주", price: "190,000원"}, {time: "8주", price: "370,000원"}, {time: "12주", price: "540,000원"}, {time: "16주", price: "700,000원"} ] },
    { title: "사물함 요금", note: "*무인결제기에서 결제 후 사용 가능", icon: "fas fa-box", items: [ {time: "4주", price: "10,000원"}, {time: "8주", price: "19,000원"}, {time: "12주", price: "28,000원"} ] }
];
const branchPricingData = { '계양직영점': commonPricingArray, '박촌역점': commonPricingArray, '부천상동점': commonPricingArray, '부천신중동점': sinjungdongPricingArray, 'default': [ { title: "안내", note: "", icon: "fas fa-info-circle", items: [ {time: "요금표 준비 중", price: "-"} ] } ] };
const branchRoomData = { '계양직영점': [ { title: "스터디룸1 (4인)", desc: "1시간 7,000원", icon: "fas fa-users" }, { title: "스터디룸2 (6인)", desc: "1시간 10,000원", icon: "fas fa-users-cog" } ], '박촌역점': [ { title: "스터디룸1 (4인)", desc: "1시간 7,000원", icon: "fas fa-users" } ], '부천상동점': [ { title: "스터디룸1 (4인)", desc: "1시간 7,000원", icon: "fas fa-users" } ], '부천신중동점': [ { title: "스터디룸1 (4인)", desc: "1시간 7,000원", icon: "fas fa-users" } ], 'default': [ { title: "안내", desc: "스터디룸 정보 준비 중", icon: "fas fa-info-circle" } ] };
const branchWifiData = { '계양직영점': 'hello1234', '박촌역점': 'escbc0909', '부천상동점': 'escsd0909', '부천신중동점': 'escjd0909', 'default': '안내 데스크 문의' };

// ---- 초기화 및 이벤트 리스너 ----
document.addEventListener('DOMContentLoaded', () => {
    // 앞 페이지 프로모션 배너 자동 페이드 전환
    const slides = document.querySelectorAll('.front-promo-slide');
    if (slides.length > 0) {
        let current = 0;
        setInterval(() => {
            slides[current].classList.remove('active');
            current = (current + 1) % slides.length;
            slides[current].classList.add('active');
        }, 4000);
    }

    if (window.location.hash) { history.replaceState(null, '', window.location.pathname); }
});

// ---- 전역 함수 정의 (window 객체에 할당) ----
window.goToMain = function(branchName) {
    currentBranch = branchName;
    document.getElementById('display-branch').innerText = branchName;
    document.getElementById('screen-branch').classList.remove('active');
    setTimeout(() => { document.getElementById('screen-main').classList.add('active'); }, 100);
    history.pushState({ page: 'main' }, '', '#main');
};

window.renderPaymentInfo = function() {
    document.getElementById('display-price-branch').innerText = currentBranch;
    const container = document.getElementById('payment-content-area');
    container.innerHTML = '';
    const pricingData = branchPricingData[currentBranch] || branchPricingData['default'];
    pricingData.forEach(section => {
        let listHtml = '';
        section.items.forEach(item => { listHtml += `<li><span class="price-time">${item.time}</span><span class="price-amt">${item.price}</span></li>`; });
        container.innerHTML += `<div class="price-card"><div class="price-header"><i class="${section.icon}"></i> ${section.title}</div>${section.note ? `<div class="price-note">${section.note}</div>` : ''}<ul class="price-list">${listHtml}</ul></div>`;
    });
};

window.renderRoomInfo = function() {
    document.getElementById('display-room-branch').innerText = currentBranch;
    const container = document.getElementById('room-content-area');
    container.innerHTML = '';
    const roomData = branchRoomData[currentBranch] || branchRoomData['default'];
    roomData.forEach(room => { container.innerHTML += `<div class="info-card"><i class="${room.icon}" style="color:var(--primary-color);"></i><div class="info-text-wrap"><div class="info-title">${room.title}</div><div class="info-desc">${room.desc}</div></div></div>`; });
};

window.renderWifiInfo = function() {
    document.getElementById('display-wifi-pw').innerText = branchWifiData[currentBranch] || branchWifiData['default'];
};

window.openSubScreen = function(screenId) {
    if(screenId === 'screen-payment') { window.renderPaymentInfo(); }
    if(screenId === 'screen-room') { window.renderRoomInfo(); }
    if(screenId === 'screen-faq') { window.renderWifiInfo(); }
    
    // 정보성 페이지(About, Privacy, Terms)의 경우 별도 데이터 렌더링 필요 없음

    // 하위 메뉴 배너 삽입 (최초 1회, 정보성 페이지 제외)
    const informationalScreens = ['screen-about', 'screen-privacy', 'screen-terms', 'screen-mypage', 'screen-guide'];
    const screen = document.getElementById(screenId);
    
    if (!informationalScreens.includes(screenId) && !screen.querySelector('.promo-banner-container')) {
        const contentDiv = screen.querySelector('.content');
        if (contentDiv) {
            const bannerHtml = `
                <div class="promo-banner-container" style="cursor:default;">
                    <div class="promo-slider">
                        <div class="promo-slide promo-bg-1">
                            <span class="promo-badge">안내</span>
                            <span class="promo-text">☕ 최고급 스페셜티 원두 입고!<br>라운지에서 무료로 즐기세요.</span>
                        </div>
                        <div class="promo-slide promo-bg-2">
                            <span class="promo-badge">응원</span>
                            <span class="promo-text">✨ 당신의 찬란한 꿈을 응원합니다.<br>오늘도 에브라임과 함께!</span>
                        </div>
                    </div>
                </div>`;
            contentDiv.insertAdjacentHTML('afterbegin', bannerHtml);
        }
    }

    screen.classList.add('active');
    activeSubScreen = screenId;
    history.pushState({ page: 'sub', id: screenId }, '', '#' + screenId);
};

window.goBackAction = function() { history.back(); };

window.addEventListener('popstate', function() {
    const hash = window.location.hash;
    if (hash === '#main') {
        if (activeSubScreen !== "") {
            document.getElementById(activeSubScreen).querySelectorAll('input, textarea').forEach(input => input.value = '');
            document.getElementById(activeSubScreen).classList.remove('active');
            activeSubScreen = "";
        }
        document.getElementById('screen-branch').classList.remove('active');
        setTimeout(() => { document.getElementById('screen-main').classList.add('active'); }, 100);
    } else if (hash === '' || hash === '#') {
        document.getElementById('screen-main').classList.remove('active');
        if (activeSubScreen !== "") { document.getElementById(activeSubScreen).classList.remove('active'); activeSubScreen = ""; }
        setTimeout(() => { document.getElementById('screen-branch').classList.add('active'); currentBranch = ""; }, 100);
    }
});

document.addEventListener('keydown', function(event) {
    const tagName = event.target.tagName.toLowerCase();
    if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') return;
    if (event.key === 'Backspace') { event.preventDefault(); if (activeSubScreen !== "" || currentBranch !== "") { history.back(); } }
});

window.openMyPage = function() {
    const listContainer = document.getElementById('mypage-list');
    listContainer.innerHTML = '';
    const myItems = myInquiryKeys.map(k => allInquiries[k]).filter(Boolean).reverse();
    if (myItems.length === 0) {
        listContainer.innerHTML = '<div class="empty-history"><i class="far fa-folder-open" style="font-size: 2.5rem; color: #E0E0E0; margin-bottom: 15px; display:block;"></i>아직 문의 또는 요청하신 내역이 없습니다.</div>';
    } else {
        myItems.forEach(item => {
            const statusText = item.status === 'PENDING' ? '처리 대기' : '조치 완료';
            const badgeClass = item.status === 'PENDING' ? 'badge-pending' : 'badge-completed';
            const card = document.createElement('div');
            card.className = 'history-card';
            card.innerHTML = `<div class="history-header"><span class="history-branch">${item.branch} · ${item.category}</span><span class="history-time">${item.time}</span></div><div class="history-body"><div class="history-content">${item.content} <br><span style="font-size:0.8rem; color:#9E9E9E;">(좌석/구역: ${item.seat})</span></div><div class="history-badge ${badgeClass}">${statusText}</div></div>`;
            listContainer.appendChild(card);
        });
    }
    window.openSubScreen('screen-mypage');
};

function getFormattedDateTime() {
    const now = new Date();
    return `${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
}

function setLoading(btnId, isLoading) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.disabled = isLoading;
    btn.innerHTML = isLoading ? '<i class="fas fa-spinner fa-spin"></i> 전송 중...' : btn.dataset.originalText;
}

async function saveInquiry(newInquiry, btnId, successMsg) {
    const btn = document.getElementById(btnId);
    if (btn) btn.dataset.originalText = btn.innerHTML;
    setLoading(btnId, true);
    try {
        const newRef = await push(inquiriesRef, { ...newInquiry, timestamp: Date.now() });
        myInquiryKeys.push(newRef.key);
        sessionStorage.setItem('myInquiryKeys', JSON.stringify(myInquiryKeys));
        alert(successMsg);
        history.back();
    } catch (e) {
        console.error(e);
        alert("전송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
        setLoading(btnId, false);
    }
}

window.submitComplain = async function() {
    const seatVal = document.getElementById('complain-seat').value;
    const typeVal = document.getElementById('complain-type').value;
    const detailVal = document.getElementById('complain-detail').value;
    if (!seatVal) { alert("좌석 번호 또는 구역을 입력해 주세요."); return; }
    let category = "기타";
    if (typeVal.includes("[소음/매너]")) category = "소음";
    else if (typeVal.includes("[온도 조절]")) category = "온도";
    else if (typeVal.includes("[클리닝]")) category = "청소";
    let content = typeVal.replace(/\[.*?\]\s*/, '');
    if (detailVal) content += " - " + detailVal;
    const newInquiry = { id: Date.now().toString().slice(-6), branch: currentBranch, category, seat: seatVal, content, time: getFormattedDateTime(), status: 'PENDING' };
    await saveInquiry(newInquiry, 'btn-complain', `[${currentBranch}]\n관리자에게 긴급 알림이 전송되었습니다.\n신속하게 조치하겠습니다.`);
};

window.submitForm = async function(screenId, category, selectId, detailId, seatId) {
    const selectVal = selectId ? document.getElementById(selectId).value : "";
    const detailVal = detailId ? document.getElementById(detailId).value : "";
    const seatVal = seatId ? document.getElementById(seatId).value : "N/A";
    if (!selectVal && !detailVal) { alert("문의하실 내용을 작성해 주세요."); return; }
    let content = selectVal || "";
    if (selectVal && detailVal) content += " - " + detailVal;
    else if (!selectVal && detailVal) content = detailVal;
    const btnId = { 'screen-payment': 'btn-payment', 'screen-room': 'btn-room', 'screen-locker': 'btn-locker', 'screen-inquiry': 'btn-inquiry' }[screenId] || '';
    const newInquiry = { id: Date.now().toString().slice(-6), branch: currentBranch, category, seat: seatVal || "N/A", content, time: getFormattedDateTime(), status: 'PENDING' };
    await saveInquiry(newInquiry, btnId, `[${currentBranch}]\n성공적으로 접수되었습니다.\n관리자가 확인 후 안내해 드리겠습니다.`);
};
