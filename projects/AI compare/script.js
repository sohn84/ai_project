const personaData = {
    family: {
        highlight: '"아이와 함께라면 <strong>A 상품</strong>의 수영장 시설과 여유로운 일정을 가장 추천드려요."',
        list: [
            'A 상품은 호텔 내 키즈 클럽이 잘 갖춰져 있어 부모님도 휴식이 가능합니다.',
            'B 상품은 이동 시간이 짧아 아이들의 피로도가 낮습니다.',
            'C 상품은 체험 활동이 많아 초등학생 자녀에게 적합합니다.'
        ]
    },
    parents: {
        highlight: '"부모님 효도 관광이라면 <strong>B 상품</strong>의 시내 접근성과 한식 특식을 추천드려요."',
        list: [
            'B 상품은 이동 동선이 짧고 호텔 조식이 한식 위주로 잘 나옵니다.',
            'A 상품은 마사지 2회 포함으로 부모님 만족도가 높습니다.',
            'C 상품은 가성비는 좋으나 걷는 일정이 다소 많을 수 있습니다.'
        ]
    },
    couple: {
        highlight: '"커플/친구 여행이라면 <strong>A 상품</strong>의 루프탑 바와 자유시간을 추천드려요."',
        list: [
            'A 상품은 인스타 핫플 방문과 매일 오후 자유시간이 보장됩니다.',
            'B 상품은 야경 투어와 럭셔리 디너 크루즈가 포함되어 있습니다.',
            'C 상품은 액티비티 위주로 에너제틱한 여행에 적합합니다.'
        ]
    },
    value: {
        highlight: '"가성비를 중시하신다면 <strong>C 상품</strong>이 가장 합리적인 선택입니다."',
        list: [
            'C 상품은 핵심 명소를 모두 방문하면서도 가격이 가장 저렴합니다.',
            'B 상품은 중간 가격대에 알찬 식사 구성이 장점입니다.',
            'A 상품은 가격대가 높지만 그만큼의 프리미엄 가치를 제공합니다.'
        ]
    }
};

// Matrix Data State
let products = [
    { name: '다낭 5일 [A]', price: '1,290,000원', hotel: '5성급 (키즈풀)', meals: '전일정 포함', freeTime: '매일 오후', shopping: '0회' },
    { name: '다낭 5일 [B]', price: '1,090,000원', hotel: '4성급 (시내)', meals: '특식 3회', freeTime: '1일 전일', shopping: '2회' },
    { name: '다낭 5일 [C]', price: '890,000원', hotel: '4성급 (가성비)', meals: '특식 1회', freeTime: '없음', shopping: '3회' }
];

const newProductD = {
    name: '다낭 5일 [D]',
    price: '1,150,000원',
    hotel: '5성급 (온천 포함)',
    meals: '특식 5회',
    freeTime: '매일 저녁',
    shopping: '1회',
    desc: '온천과 마사지가 포함된 힐링 패키지입니다.'
};

let pendingSwapProduct = null;

// UI Update Functions
function updateMatrixUI() {
    const productCols = document.querySelectorAll('.product-col');
    const featureRows = document.querySelectorAll('.matrix-body .matrix-row');

    products.forEach((p, i) => {
        productCols[i].querySelector('.name').textContent = p.name;
        productCols[i].querySelector('.price').textContent = p.price;

        featureRows[0].querySelectorAll('.val')[i].textContent = p.hotel;
        featureRows[1].querySelectorAll('.val')[i].textContent = p.hotel; // Note: hotel is row 0
        // Wait, the rows are: 0: Hotel, 1: Meals, 2: FreeTime, 3: Shopping
        featureRows[0].querySelectorAll('.val')[i].textContent = p.hotel;
        featureRows[1].querySelectorAll('.val')[i].textContent = p.meals;
        featureRows[2].querySelectorAll('.val')[i].textContent = p.freeTime;
        featureRows[3].querySelectorAll('.val')[i].textContent = p.shopping;
    });
}

// Chat Logic
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

function addMessage(text, sender = 'ai', isHtml = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    if (isHtml) msgDiv.innerHTML = text;
    else msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleRecommend() {
    addMessage("온천이 포함된 상품을 찾으시는군요! 최근 만족도가 가장 높은 '다낭 5일 [D]' 상품을 추천드려요.");
    const recCardHtml = `
        <div class="recommend-card">
            <div class="rec-title">${newProductD.name}</div>
            <div class="rec-desc">${newProductD.desc}</div>
            <button class="compare-btn" onclick="openSwapModal()">비교군에 추가하기</button>
        </div>
    `;
    addMessage(recCardHtml, 'ai', true);
}

function openSwapModal() {
    pendingSwapProduct = newProductD;
    document.getElementById('swap-modal').style.display = 'flex';
}

function closeSwapModal() {
    document.getElementById('swap-modal').style.display = 'none';
}

document.querySelectorAll('.swap-opt').forEach(opt => {
    opt.addEventListener('click', () => {
        const index = parseInt(opt.dataset.index);
        products[index] = pendingSwapProduct;
        updateMatrixUI();
        closeSwapModal();
        addMessage(`상품 ${String.fromCharCode(65 + index)}가 '${pendingSwapProduct.name}'로 교체되었습니다. 상단 비교표를 확인해 보세요!`);

        // Scroll to top to show the change
        window.scrollTo({ top: 400, behavior: 'smooth' });
    });
});

document.querySelector('.close-modal').addEventListener('click', closeSwapModal);

// Event Listeners
document.querySelectorAll('.q-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        const text = chip.textContent;
        addMessage(text, 'user');
        if (text.includes('온천')) {
            setTimeout(handleRecommend, 800);
        } else {
            setTimeout(() => addMessage("해당 조건에 맞는 상품을 분석 중입니다..."), 800);
        }
    });
});

sendBtn.addEventListener('click', () => {
    const text = chatInput.value.trim();
    if (text) {
        addMessage(text, 'user');
        chatInput.value = '';
        setTimeout(() => addMessage("상세 데이터를 분석하여 답변해 드릴게요. 잠시만 기다려 주세요."), 800);
    }
});

// Existing Persona Logic
document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
        document.querySelector('.chip.active').classList.remove('active');
        chip.classList.add('active');
        const persona = chip.dataset.persona;
        const data = personaData[persona];
        const contentArea = document.getElementById('ai-summary');
        contentArea.style.opacity = '0';
        contentArea.style.transform = 'translateY(10px)';
        setTimeout(() => {
            contentArea.innerHTML = `
                <p class="highlight">${data.highlight}</p>
                <ul class="briefing-list">
                    ${data.list.map(item => `<li><span class="bullet">·</span> ${item}</li>`).join('')}
                </ul>
            `;
            contentArea.style.opacity = '1';
            contentArea.style.transform = 'translateY(0)';
            contentArea.style.transition = 'all 0.4s ease';
        }, 200);
    });
});

window.addEventListener('scroll', () => {
    const header = document.querySelector('.matrix-header-sticky');
    if (window.scrollY > 400) {
        header.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';
    } else {
        header.style.boxShadow = 'none';
    }
});

// Initial UI Sync
updateMatrixUI();
