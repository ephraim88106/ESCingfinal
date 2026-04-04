import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onValue, query, orderByChild } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// ======================================================
// 🔥 Firebase Configuration
// ======================================================
const firebaseConfig = {
    apiKey: "AIzaSyCt-HiQkDoeAxnJN7VwsmEpoxwWQmCC69E",
    authDomain: "esc-info-86e12.firebaseapp.com",
    databaseURL: "https://esc-info-86e12-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "esc-info-86e12",
    storageBucket: "esc-info-86e12.firebasestorage.app",
    messagingSenderId: "411200026634",
    appId: "1:411200026634:web:afd8074af0d02ee93087f3"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const inquiriesRef = ref(db, 'inquiries');

// ======================================================
// ✈️ Telegram Notification Configuration
// ======================================================
const TELEGRAM_BOT_TOKEN = "8613163185:AAGBPtBj6m8Fuo3e_390gZ0GvVg3kDfOfgw";
const TELEGRAM_CHAT_IDS = ["8478291658"];

async function sendTelegramNotification(inquiry) {
    const message = `<b>🔔 [에브라임 - ${inquiry.category}] 새로운 문의 접수</b>\n\n` +
                    `📍 <b>지점:</b> ${inquiry.branch}\n` +
                    `👤 <b>카테고리:</b> ${inquiry.category}\n` +
                    `💺 <b>좌석/구역:</b> ${inquiry.seat}\n` +
                    `📞 <b>연락처:</b> ${inquiry.phone || '미입력'}\n` +
                    `📝 <b>내용:</b> ${inquiry.content}\n` +
                    `⏰ <b>시간:</b> ${inquiry.time}`;

    for (const chatId of TELEGRAM_CHAT_IDS) {
        try {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'HTML'
                })
            });
        } catch (e) {
            console.error("Telegram 알림 전송 실패 (ID: " + chatId + "):", e);
        }
    }
}

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
const samsanPricingArray = [
    { title: "일일 이용권", note: "*환불, 시간 정지 불가", icon: "fas fa-hourglass-half", items: [ {time: "2시간", price: "4,000원"}, {time: "4시간", price: "7,000원"}, {time: "6시간", price: "9,000원"}, {time: "8시간", price: "10,000원"}, {time: "12시간", price: "13,000원"} ] },
    { title: "시간 이용권", note: "*퇴장시 반드시 퇴실 체크", icon: "fas fa-stopwatch", items: [ {time: "30시간", price: "50,000원"}, {time: "50시간", price: "65,000원"}, {time: "100시간", price: "120,000원"}, {time: "200시간", price: "220,000원"} ] },
    { title: "기간권", note: "*퇴장시 반드시 퇴실 체크", icon: "far fa-calendar-alt", items: [ {time: "1주", price: "50,000원"}, {time: "2주", price: "80,000원"}, {time: "4주", price: "130,000원"} ] },
    { title: "사물함 요금", note: "*무인결제기에서 결제 후 사용 가능", icon: "fas fa-box", items: [ {time: "4주", price: "10,000원"} ] }
];
const branchPricingData = { '계양직영점': commonPricingArray, '박촌역점': commonPricingArray, '부천상동점': commonPricingArray, '부천신중동점': sinjungdongPricingArray, '부평삼산점': samsanPricingArray, 'default': [ { title: "안내", note: "", icon: "fas fa-info-circle", items: [ {time: "요금표 준비 중", price: "-"} ] } ] };
const branchRoomData = { '계양직영점': [ { title: "스터디룸1 (4인)", desc: "1시간 7,000원", icon: "fas fa-users" }, { title: "스터디룸2 (6인)", desc: "1시간 10,000원", icon: "fas fa-users-cog" } ], '박촌역점': [ { title: "스터디룸1 (4인)", desc: "1시간 7,000원", icon: "fas fa-users" } ], '부천상동점': [ { title: "스터디룸1 (4인)", desc: "1시간 7,000원", icon: "fas fa-users" } ], '부천신중동점': [ { title: "스터디룸1 (4인)", desc: "1시간 7,000원", icon: "fas fa-users" } ], '부평삼산점': [ { title: "스터디룸1 (4인)", desc: "1시간 7,000원", icon: "fas fa-users" } ], 'default': [ { title: "안내", desc: "스터디룸 정보 준비 중", icon: "fas fa-info-circle" } ] };
const branchWifiData = { '계양직영점': 'hello1234', '박촌역점': 'escbc0909', '부천상동점': 'escsd0909', '부천신중동점': 'escjd0909', '부평삼산점': 'escss0909', 'default': '안내 데스크 문의' };

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
    
    // 하위 메뉴 배너 삽입 (최초 1회, 정보성 페이지 제외)
    const informationalScreens = ['screen-about', 'screen-privacy', 'screen-terms', 'screen-mypage', 'screen-guide'];
    const screen = document.getElementById(screenId);
    
    if (!informationalScreens.includes(screenId) && !screen.querySelector('.promo-banner-container')) {
        const contentDiv = screen.querySelector('.content');
        if (contentDiv) {
            const bannerHtml = `
                <div class="promo-banner-container">
                    <div class="promo-slider">
                        <div class="promo-slide promo-bg-1">
                            <span class="promo-badge">안내</span>
                            <span class="promo-text">☕ 최고급 스페셜티 원두 입고!<br>라운지에서 무료로 즐기세요.</span>
                        </div>
                        <div class="promo-slide promo-bg-2">
                            <span class="promo-badge">응원</span>
                            <span class="promo-text">✨ 당신의 찬란한 꿈을 응원합니다.<br>오늘도 에브라임과 함께!</span>
                        </div>
                        <div class="promo-slide promo-bg-3" onclick="window.open('https://link.coupang.com/a/edUJG5', '_blank')">
                            <span class="promo-badge">Shop</span>
                            <span class="promo-text">📖 집중력 UP! 학습 필수템<br>에브라임 추천 아이템 보러가기</span>
                        </div>
                    </div>
                </div>
                <div class="coupang-disclaimer">이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</div>`;
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
            card.innerHTML = `<div class="history-header"><span class="history-branch">${item.branch} · ${item.category}</span><span class="history-time">${item.time}</span></div><div class="history-body"><div class="history-content">${item.content} <br><span style="font-size:0.8rem; color:#9E9E9E;">(좌석/구역: ${item.seat}${item.phone ? ` · 연락처: ${item.phone}` : ''})</span></div><div class="history-badge ${badgeClass}">${statusText}</div></div>`;
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
        
        // 텔레그램 알림 전송 (비동기)
        sendTelegramNotification(newInquiry);

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
    const phoneVal = document.getElementById('complain-phone').value;
    if (!seatVal) { alert("좌석 번호 또는 구역을 입력해 주세요."); return; }
    let category = "기타";
    if (typeVal.includes("[소음/매너]")) category = "소음";
    else if (typeVal.includes("[온도 조절]")) category = "온도";
    else if (typeVal.includes("[클리닝]")) category = "청소";
    let content = typeVal.replace(/\[.*?\]\s*/, '');
    if (detailVal) content += " - " + detailVal;
    const newInquiry = { id: Date.now().toString().slice(-6), branch: currentBranch, category, seat: seatVal, content, phone: phoneVal || "", time: getFormattedDateTime(), status: 'PENDING' };
    await saveInquiry(newInquiry, 'btn-complain', `[${currentBranch}]\n관리자에게 긴급 알림이 전송되었습니다.\n신속하게 조치하겠습니다.`);
};

// ======================================================
// 🤖 Chatbot Logic
// ======================================================
let chatbotInitialized = false;

window.openChatbot = function() {
    document.getElementById('chatbot-overlay').classList.add('active');
    document.getElementById('chatbot-fab').classList.add('hidden');
    if (!chatbotInitialized) {
        chatbotInitialized = true;
        const msgs = document.getElementById('chatbot-messages');
        msgs.innerHTML = '';
        addBotMessage(`안녕하세요! <b>${currentBranch}</b> 에브라임 AI 안내입니다. 😊\n무엇이든 편하게 물어보세요.`);
        setTimeout(() => addQuickReplies(['요금 안내', '와이파이', '스터디룸', '사물함', '이용 시간', '불편 접수']), 400);
    }
    setTimeout(() => document.getElementById('chatbot-input').focus(), 400);
};

window.closeChatbot = function() {
    document.getElementById('chatbot-overlay').classList.remove('active');
    document.getElementById('chatbot-fab').classList.remove('hidden');
};

function showChatbotFab() {
    if (!document.getElementById('chatbot-overlay').classList.contains('active')) {
        document.getElementById('chatbot-fab').classList.remove('hidden');
    }
}
function hideChatbotFab() {
    document.getElementById('chatbot-fab').classList.add('hidden');
    document.getElementById('chatbot-overlay').classList.remove('active');
    chatbotInitialized = false;
}

// 메인 화면 진입 시 FAB 표시, 나갈 때 숨김
const origGoToMain = window.goToMain;
window.goToMain = function(branchName) {
    origGoToMain(branchName);
    chatbotInitialized = false;
    setTimeout(showChatbotFab, 500);
};

// 뒤로가기로 지점선택 화면 돌아갈 때 숨김
window.addEventListener('popstate', function() {
    const hash = window.location.hash;
    if (hash === '' || hash === '#') {
        hideChatbotFab();
    }
});

function addBotMessage(html) {
    const msgs = document.getElementById('chatbot-messages');
    const div = document.createElement('div');
    div.className = 'chat-msg bot';
    div.innerHTML = html.replace(/\n/g, '<br>');
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
}

function addUserMessage(text) {
    const msgs = document.getElementById('chatbot-messages');
    const div = document.createElement('div');
    div.className = 'chat-msg user';
    div.textContent = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
}

function addQuickReplies(options) {
    const msgs = document.getElementById('chatbot-messages');
    const wrap = document.createElement('div');
    wrap.className = 'chat-quick-replies';
    options.forEach(text => {
        const btn = document.createElement('button');
        btn.className = 'chat-quick-btn';
        btn.textContent = text;
        btn.onclick = function() {
            wrap.remove();
            handleChatInput(text);
        };
        wrap.appendChild(btn);
    });
    msgs.appendChild(wrap);
    msgs.scrollTop = msgs.scrollHeight;
}

function showTypingThenReply(html, quickReplies) {
    const msgs = document.getElementById('chatbot-messages');
    const typing = document.createElement('div');
    typing.className = 'chat-msg bot';
    typing.innerHTML = '<div class="chat-typing"><span></span><span></span><span></span></div>';
    msgs.appendChild(typing);
    msgs.scrollTop = msgs.scrollHeight;
    setTimeout(() => {
        typing.remove();
        addBotMessage(html);
        if (quickReplies) {
            setTimeout(() => addQuickReplies(quickReplies), 200);
        }
    }, 600 + Math.random() * 400);
}

function getChatbotResponse(input) {
    const q = input.toLowerCase().replace(/\s/g, '');
    const branch = currentBranch;

    // 요금 관련
    if (q.includes('요금') || q.includes('가격') || q.includes('얼마') || q.includes('이용권') || q.includes('price')) {
        const data = branchPricingData[branch] || branchPricingData['default'];
        let reply = `<b>${branch} 요금 안내</b>\n\n`;
        data.forEach(section => {
            reply += `<b>${section.title}</b>\n`;
            section.items.forEach(item => {
                const time = item.time.replace(/<[^>]*>/g, '');
                const price = item.price.replace(/<[^>]*>/g, '');
                reply += `<span class="price-line"><span>${time}</span><span><b>${price}</b></span></span>`;
            });
            reply += '\n';
        });
        reply += `\n자세한 사항은 <b>"이용권 요금 안내"</b> 메뉴를 확인해 주세요.`;
        return { text: reply, quick: ['와이파이', '스터디룸', '사물함', '처음으로'] };
    }

    // 와이파이
    if (q.includes('와이파이') || q.includes('wifi') || q.includes('비번') || q.includes('비밀번호') || q.includes('인터넷')) {
        const pw = branchWifiData[branch] || branchWifiData['default'];
        return {
            text: `<b>${branch} Wi-Fi 정보</b>\n\n📶 <b>SSID:</b> ephraim01 ~ 04\n🔑 <b>비밀번호:</b> <b>${pw}</b>\n\n접속이 안 되시면 불편 접수를 이용해 주세요.`,
            quick: ['요금 안내', '스터디룸', '불편 접수', '처음으로']
        };
    }

    // 스터디룸
    if (q.includes('스터디룸') || q.includes('스터디') || q.includes('룸') || q.includes('예약')) {
        const rooms = branchRoomData[branch] || branchRoomData['default'];
        let reply = `<b>${branch} 스터디룸 안내</b>\n\n`;
        rooms.forEach(room => {
            reply += `📌 <b>${room.title}</b>\n${room.desc}\n\n`;
        });
        reply += `예약은 <b>"스터디룸 가이드"</b> 메뉴에서\n[날짜/시간/인원수]를 남겨주시면\n관리자가 확정 안내 드립니다.`;
        return { text: reply, quick: ['요금 안내', '와이파이', '사물함', '처음으로'] };
    }

    // 사물함
    if (q.includes('사물함') || q.includes('locker') || q.includes('락커')) {
        return {
            text: `<b>사물함 이용 안내</b>\n\n📦 신규 신청, 기간 연장, 비밀번호 초기화 등\n모든 사물함 관련 업무는 <b>"사물함 신청"</b> 메뉴에서\n처리 가능합니다.\n\n<b>요금:</b> 4주 10,000원 / 8주 19,000원 / 12주 28,000원\n\n무인결제기에서 결제 후 사용하실 수 있습니다.`,
            quick: ['요금 안내', '와이파이', '불편 접수', '처음으로']
        };
    }

    // 이용 시간 / 운영시간
    if (q.includes('시간') || q.includes('운영') || q.includes('영업') || q.includes('24시') || q.includes('몇시')) {
        return {
            text: `<b>운영 시간 안내</b>\n\n🕐 에브라임은 <b>365일 24시간</b> 운영됩니다.\n\n언제든 편하게 방문해 주세요.\n심야 시간대에도 관리자가 상주합니다.`,
            quick: ['요금 안내', '와이파이', '스터디룸', '처음으로']
        };
    }

    // 불편 접수
    if (q.includes('불편') || q.includes('소음') || q.includes('시끄') || q.includes('온도') || q.includes('춥') || q.includes('더') || q.includes('청소') || q.includes('접수') || q.includes('신고')) {
        return {
            text: `<b>불편 접수 안내</b>\n\n🔔 현장 불편사항은 <b>"불편 사항 접수"</b> 메뉴를 이용해 주세요.\n\n접수 즉시 관리자에게 긴급 알림이 전송되며,\n<b>익명성은 철저히 보장</b>됩니다.\n\n빠르게 조치하겠습니다!`,
            quick: ['요금 안내', '와이파이', '처음으로']
        };
    }

    // 커피/라운지
    if (q.includes('커피') || q.includes('음료') || q.includes('라운지') || q.includes('간식') || q.includes('스낵')) {
        return {
            text: `<b>라운지 서비스 안내</b>\n\n☕ 최고급 스페셜티 원두커피와 다양한 티백,\n간단한 스낵이 <b>무료</b>로 제공됩니다.\n\n개인 텀블러 사용을 권장하며,\n냄새나는 음식물 반입은 제한됩니다.`,
            quick: ['요금 안내', '와이파이', '처음으로']
        };
    }

    // 프린터
    if (q.includes('프린터') || q.includes('프린트') || q.includes('인쇄') || q.includes('복사') || q.includes('복합기')) {
        return {
            text: `<b>복합기(프린터) 이용 안내</b>\n\n🖨️ 이용권 구매 후 인쇄 및 복사가 <b>무료</b>입니다.\n\n단, 환경 보호를 위해 <b>A4 용지는 개인 지참</b>이 필수입니다.`,
            quick: ['요금 안내', '와이파이', '처음으로']
        };
    }

    // 환불
    if (q.includes('환불') || q.includes('취소') || q.includes('결제')) {
        return {
            text: `<b>결제/환불 안내</b>\n\n💳 결제 및 환불 관련 문의는\n<b>"1:1 상세 문의"</b> 메뉴를 이용해 주세요.\n\n공정거래위원회 표준 약관에 따라\n정당한 환불 절차를 준수합니다.\n\n※ 일일 이용권은 환불/시간 정지 불가`,
            quick: ['요금 안내', '처음으로']
        };
    }

    // 처음으로
    if (q.includes('처음') || q.includes('메뉴') || q.includes('다른') || q.includes('도움')) {
        return {
            text: `무엇을 도와드릴까요? 😊\n아래에서 원하시는 항목을 선택하거나,\n직접 질문을 입력해 주세요.`,
            quick: ['요금 안내', '와이파이', '스터디룸', '사물함', '이용 시간', '불편 접수']
        };
    }

    // 인사
    if (q.includes('안녕') || q.includes('하이') || q.includes('hello') || q.includes('hi')) {
        return {
            text: `안녕하세요! 😊\n<b>${branch}</b> 에브라임 AI 안내입니다.\n무엇이든 편하게 물어보세요!`,
            quick: ['요금 안내', '와이파이', '스터디룸', '사물함', '이용 시간', '불편 접수']
        };
    }

    // 감사
    if (q.includes('감사') || q.includes('고마') || q.includes('땡큐') || q.includes('thank')) {
        return {
            text: `천만에요! 😊\n더 궁금한 점이 있으시면 언제든 물어보세요.\n<b>${branch}</b>에서 좋은 시간 보내세요!`,
            quick: ['처음으로']
        };
    }

    // 기본 응답
    return {
        text: `죄송합니다, 해당 내용은 정확히 파악하지 못했어요. 😅\n\n아래 항목을 선택하시거나,\n<b>"불편 접수"</b> 또는 메인의 <b>"1:1 상세 문의"</b>를\n이용해 주시면 관리자가 직접 답변 드리겠습니다.`,
        quick: ['요금 안내', '와이파이', '스터디룸', '사물함', '불편 접수', '처음으로']
    };
}

function handleChatInput(text) {
    addUserMessage(text);
    const response = getChatbotResponse(text);
    showTypingThenReply(response.text, response.quick);
}

window.sendChatMessage = function() {
    const input = document.getElementById('chatbot-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    handleChatInput(text);
};

document.addEventListener('keydown', function(e) {
    if (e.target.id === 'chatbot-input' && e.key === 'Enter') {
        e.preventDefault();
        window.sendChatMessage();
    }
});

window.submitForm = async function(screenId, category, selectId, detailId, seatId, phoneId) {
    const selectVal = selectId ? document.getElementById(selectId).value : "";
    const detailVal = detailId ? document.getElementById(detailId).value : "";
    const seatVal = seatId ? document.getElementById(seatId).value : "N/A";
    const phoneVal = phoneId ? document.getElementById(phoneId).value : "";
    if (!selectVal && !detailVal) { alert("문의하실 내용을 작성해 주세요."); return; }
    if (phoneId && !phoneVal) { alert("답변을 받으실 연락처를 입력해 주세요."); return; }
    let content = selectVal || "";
    if (selectVal && detailVal) content += " - " + detailVal;
    else if (!selectVal && detailVal) content = detailVal;
    const btnId = { 'screen-payment': 'btn-payment', 'screen-room': 'btn-room', 'screen-locker': 'btn-locker', 'screen-inquiry': 'btn-inquiry' }[screenId] || '';
    const newInquiry = { id: Date.now().toString().slice(-6), branch: currentBranch, category, seat: seatVal || "N/A", content, phone: phoneVal || "", time: getFormattedDateTime(), status: 'PENDING' };
    await saveInquiry(newInquiry, btnId, `[${currentBranch}]\n성공적으로 접수되었습니다.\n관리자가 확인 후 안내해 드리겠습니다.`);
};
