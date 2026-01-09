// QR Code Modal Configuration
const QR_CONFIG = {
    wechat: {
        image: 'https://pic.hackdeacon.cn/Official-Account.jpg',
        title: 'WeChat Official Account',
        desc: 'Scan to follow me on WeChat'
    },
    channels: {
        image: 'https://pic.hackdeacon.cn/Channels.jpg',
        title: 'WeChat Channels',
        desc: 'Scan to follow my video channel'
    }
};

const ANIMATION_DURATION = 350;

// Cache DOM elements
const elements = {
    modal: document.getElementById('qrModal'),
    image: document.getElementById('qrImage'),
    title: document.getElementById('qrTitle'),
    desc: document.getElementById('qrDesc'),
    closeBtn: document.querySelector('.qr-modal-close'),
    wechatBtn: document.querySelector('[data-platform="wechat"]'),
    channelsBtn: document.querySelector('[data-platform="channels"]')
};

function showModal(platform) {
    const config = QR_CONFIG[platform];
    if (!config) return;

    elements.image.src = config.image;
    elements.title.textContent = config.title;
    elements.desc.textContent = config.desc;

    elements.modal.style.display = 'flex';
    requestAnimationFrame(() => elements.modal.classList.add('active'));
    document.body.style.overflow = 'hidden';
}

function hideModal() {
    elements.modal.classList.remove('active');

    setTimeout(() => {
        if (!elements.modal.classList.contains('active')) {
            elements.modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }, ANIMATION_DURATION);
}

// Event listeners
elements.wechatBtn?.addEventListener('click', () => showModal('wechat'));
elements.channelsBtn?.addEventListener('click', () => showModal('channels'));
elements.closeBtn?.addEventListener('click', hideModal);

elements.modal?.addEventListener('click', (e) => {
    if (e.target === elements.modal) hideModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && elements.modal?.classList.contains('active')) {
        hideModal();
    }
});
