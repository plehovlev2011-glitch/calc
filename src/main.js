import {styles as typescaleStyles} from '@material/web/typography/md-typescale-styles.js';

// Рабочие импорты
import '@material/web/button/filled-button.js';
import '@material/web/button/text-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/textfield/filled-text-field.js';
import '@material/web/tabs/primary-tab.js';
import '@material/web/tabs/tabs.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/switch/switch.js';
import '@material/web/dialog/dialog.js';
import '@material/web/progress/circular-progress.js';

// Добавляем стили Material Typography
document.adoptedStyleSheets.push(typescaleStyles.styleSheet);

const API_URL = 'https://script.google.com/macros/s/AKfycbwIiLDTJGm3F-EG0SMPWqdXL06NXLPZ-IyuUKTQOnyGds4LCDqPE-rKz-twWmg8JO9h/exec';

class App {
  constructor() {
    this.container = document.getElementById('app');
    this.currentUser = null;
  }

  async init() {
    const savedCode = localStorage.getItem('cafeUserCode');
    
    if (savedCode) {
      try {
        const user = await this.getUser(savedCode);
        if (user) {
          this.currentUser = user;
          this.showCabinet();
          return;
        }
      } catch (e) {
        const cached = localStorage.getItem('cafeUserData');
        if (cached) {
          this.currentUser = JSON.parse(cached);
          this.showCabinet();
          return;
        }
      }
    }
    
    this.showAuth();
  }

  async getUser(code) {
    const response = await fetch(`${API_URL}?action=getUser&code=${code}`);
    const data = await response.json();
    return data.ok ? data.user : null;
  }

  showAuth() {
    this.container.innerHTML = `
      <div style="min-height: 100dvh; display: flex; align-items: center; justify-content: center; padding: 24px;">
        <div style="max-width: 400px; width: 100%;">
          <div style="text-align: center; margin-bottom: 32px;">
            <img src="/logo.webp" alt="ПЕРЕЦ" style="width: 64px; height: 64px; border-radius: 16px;">
            <h1 class="md-typescale-display-small" style="font-family: 'Unbounded'; font-weight: 200; letter-spacing: 2px; margin-top: 16px; color: #C62828;">ПЕРЕЦ</h1>
          </div>
          
          <div style="display: flex; gap: 8px; background: #F5DDDB; border-radius: 100px; padding: 4px; margin-bottom: 24px;">
            <button id="tab-login-btn" style="flex: 1; padding: 10px; border: none; border-radius: 100px; font-family: 'Unbounded'; font-weight: 300; font-size: 12px; cursor: pointer; background: white; color: #C62828;">Войти</button>
            <button id="tab-register-btn" style="flex: 1; padding: 10px; border: none; border-radius: 100px; font-family: 'Unbounded'; font-weight: 300; font-size: 12px; cursor: pointer; background: transparent;">Регистрация</button>
          </div>
          
          <div id="login-panel">
            <md-filled-text-field id="login-phone" label="Логин" type="text" style="width: 100%;"></md-filled-text-field>
            <md-filled-text-field id="login-password" label="Пароль" type="password" style="width: 100%; margin-top: 16px;"></md-filled-text-field>
            <div id="login-error" style="color: #BA1A1A; font-size: 14px; margin-top: 12px; display: none;"></div>
            <md-filled-button id="login-btn" style="width: 100%; margin-top: 24px;">Войти</md-filled-button>
            <md-text-button style="width: 100%; margin-top: 8px;">Проблемы с авторизацией?</md-text-button>
          </div>
          
          <div id="register-panel" style="display: none;">
            <md-filled-text-field id="reg-name" label="Имя" type="text" style="width: 100%; margin-top: 24px;"></md-filled-text-field>
            <md-filled-text-field id="reg-phone" label="Логин" type="text" style="width: 100%; margin-top: 16px;"></md-filled-text-field>
            <md-filled-text-field id="reg-password" label="Пароль (минимум 8 символов)" type="password" style="width: 100%; margin-top: 16px;"></md-filled-text-field>
            <div id="register-error" style="color: #BA1A1A; font-size: 14px; margin-top: 12px; display: none;"></div>
            <md-filled-button id="register-btn" style="width: 100%; margin-top: 24px;">Создать аккаунт</md-filled-button>
          </div>
        </div>
      </div>
    `;

    this.attachAuthEvents();
  }

  attachAuthEvents() {
    const loginTab = this.container.querySelector('#tab-login-btn');
    const registerTab = this.container.querySelector('#tab-register-btn');
    const loginPanel = this.container.querySelector('#login-panel');
    const registerPanel = this.container.querySelector('#register-panel');
    
    loginTab.addEventListener('click', () => {
      loginTab.style.background = 'white';
      loginTab.style.color = '#C62828';
      registerTab.style.background = 'transparent';
      registerTab.style.color = '#534341';
      loginPanel.style.display = 'block';
      registerPanel.style.display = 'none';
    });
    
    registerTab.addEventListener('click', () => {
      registerTab.style.background = 'white';
      registerTab.style.color = '#C62828';
      loginTab.style.background = 'transparent';
      loginTab.style.color = '#534341';
      loginPanel.style.display = 'none';
      registerPanel.style.display = 'block';
    });

    const loginBtn = this.container.querySelector('#login-btn');
    loginBtn.addEventListener('click', () => this.handleLogin());

    const registerBtn = this.container.querySelector('#register-btn');
    registerBtn.addEventListener('click', () => this.handleRegister());
  }

  async handleLogin() {
    const phone = this.container.querySelector('#login-phone').value;
    const password = this.container.querySelector('#login-password').value;
    const errorEl = this.container.querySelector('#login-error');
    
    errorEl.style.display = 'none';
    
    if (!phone || !password) {
      errorEl.textContent = 'Заполните все поля';
      errorEl.style.display = 'block';
      return;
    }
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'login', phone, password })
      });
      const data = await response.json();
      
      if (data.ok && data.user) {
        this.currentUser = data.user;
        localStorage.setItem('cafeUserCode', data.user.code);
        localStorage.setItem('cafeUserData', JSON.stringify(data.user));
        this.showCabinet();
      } else {
        errorEl.textContent = data.error || 'Ошибка входа';
        errorEl.style.display = 'block';
      }
    } catch (e) {
      errorEl.textContent = 'Ошибка соединения';
      errorEl.style.display = 'block';
    }
  }

  async handleRegister() {
    const name = this.container.querySelector('#reg-name').value;
    const phone = this.container.querySelector('#reg-phone').value;
    const password = this.container.querySelector('#reg-password').value;
    const errorEl = this.container.querySelector('#register-error');
    
    errorEl.style.display = 'none';
    
    if (!name || !phone || password.length < 8) {
      errorEl.textContent = 'Заполните все поля (пароль минимум 8 символов)';
      errorEl.style.display = 'block';
      return;
    }
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'register', name, phone, password })
      });
      const data = await response.json();
      
      if (data.ok) {
        const newUser = { code: data.code, name, bonuses: 0, chips: 0 };
        this.currentUser = newUser;
        localStorage.setItem('cafeUserCode', data.code);
        localStorage.setItem('cafeUserData', JSON.stringify(newUser));
        this.showCabinet();
      } else {
        errorEl.textContent = data.error || 'Ошибка регистрации';
        errorEl.style.display = 'block';
      }
    } catch (e) {
      errorEl.textContent = 'Ошибка соединения';
      errorEl.style.display = 'block';
    }
  }

  showCabinet() {
    this.container.innerHTML = `
      <div style="max-width: 1200px; margin: 0 auto; padding-bottom: 80px;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #D8C2BF;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="/logo.webp" alt="ПЕРЕЦ" style="width: 32px; height: 32px;">
            <span style="font-family: 'Unbounded'; font-weight: 200; font-size: 14px; letter-spacing: 2px;">ПЕРЕЦ</span>
          </div>
          <md-icon-button id="settings-btn">
            <md-icon>settings</md-icon>
          </md-icon-button>
        </div>
        
        <div id="tab-home" style="padding: 16px;">
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #533483 100%); border-radius: 28px; padding: 24px; color: white; margin-bottom: 16px;">
            <div style="font-family: 'Unbounded'; font-weight: 200; font-size: 10px; letter-spacing: 2px; opacity: 0.75; margin-bottom: 4px;">БОНУСНЫЙ СЧЁТ</div>
            <div style="display: flex; align-items: baseline; gap: 8px;">
              <span style="font-family: 'Unbounded'; font-weight: 200; font-size: 48px; line-height: 1;">${this.currentUser.bonuses}</span>
              <span style="font-family: 'Unbounded'; font-weight: 200; font-size: 16px; opacity: 0.8;">бонусов</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 20px;">
              <div style="font-size: 11px; opacity: 0.55;">1 бонус = 1 ₽ скидки</div>
              <div style="font-family: 'Unbounded'; font-weight: 300; font-size: 12px; letter-spacing: 3px; background: rgba(255,255,255,0.12); backdrop-filter: blur(4px); padding: 5px 12px; border-radius: 100px;">№ ${this.currentUser.code}</div>
            </div>
          </div>
          
          <div id="chips-container" style="background: #F5DDDB; border-radius: 28px; padding: 20px; margin: 16px 0;">
            <div style="text-align: center;">Загрузка карты обедов...</div>
          </div>
          
          <div style="margin-top: 20px;">
            <div style="font-family: 'Unbounded'; font-weight: 200; font-size: 10px; letter-spacing: 2px; color: #857370; margin-bottom: 12px;">КАРТА</div>
            <div style="background: white; border-radius: 16px; padding: 20px; text-align: center; border: 1px solid #D8C2BF;">
              <svg id="barcode-svg"></svg>
              <div style="font-size: 12px; color: #857370; margin-top: 8px;">Покажите на кассе для начисления бонусов</div>
            </div>
          </div>
          
          <div style="margin-top: 20px;">
            <div style="font-family: 'Unbounded'; font-weight: 200; font-size: 10px; letter-spacing: 2px; color: #857370; margin-bottom: 12px;">АКЦИИ</div>
            <div style="display: flex; gap: 12px; overflow-x: auto; padding-bottom: 4px;">
              <div style="flex: 0 0 240px; background: #FFDAD6; border-radius: 24px; padding: 16px;">
                <div style="font-family: 'Unbounded'; font-weight: 300; font-size: 13px; color: #2C1512;">Накопительная система</div>
                <div style="font-size: 12px; color: #2C1512; opacity: 0.75;">Каждый 10-й обед в подарок!</div>
              </div>
              <div style="flex: 0 0 240px; background: #FFDAD6; border-radius: 24px; padding: 16px;">
                <div style="font-family: 'Unbounded'; font-weight: 300; font-size: 13px; color: #2C1512;">Банкетный бонус</div>
                <div style="font-size: 12px; color: #2C1512; opacity: 0.75;">При заказе банкета — двойные бонусы</div>
              </div>
              <div style="flex: 0 0 240px; background: #FFDAD6; border-radius: 24px; padding: 16px;">
                <div style="font-family: 'Unbounded'; font-weight: 300; font-size: 13px; color: #2C1512;">День рождения</div>
                <div style="font-size: 12px; color: #2C1512; opacity: 0.75;">Именной подарок в твой праздник</div>
              </div>
            </div>
          </div>
        </div>
        
        <div id="tab-history" style="padding: 16px; display: none;">
          <div style="font-family: 'Unbounded'; font-weight: 200; font-size: 10px; letter-spacing: 2px; color: #857370; margin-bottom: 16px;">ИСТОРИЯ ОПЕРАЦИЙ</div>
          <div id="history-list"></div>
        </div>
        
        <div id="tab-banket" style="padding: 16px; display: none;">
          <img src="/banketBanner.webp" alt="Банкет" style="width: 100%; border-radius: 28px; margin-bottom: 16px;">
          <h2 style="font-family: 'Unbounded'; font-weight: 200; font-size: 18px; margin-bottom: 16px;">Отметьте у нас</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px;">
            <div style="display: flex; gap: 12px; padding: 16px; background: #F5DDDB; border-radius: 16px;">
              <span class="material-icons" style="color: #C62828;">groups</span>
              <div><h4 style="font-family: 'Unbounded'; font-weight: 300; font-size: 13px;">Зал до 80 гостей</h4><p style="font-size: 12px;">Уютное пространство</p></div>
            </div>
            <div style="display: flex; gap: 12px; padding: 16px; background: #F5DDDB; border-radius: 16px;">
              <span class="material-icons" style="color: #C62828;">restaurant_menu</span>
              <div><h4 style="font-family: 'Unbounded'; font-weight: 300; font-size: 13px;">Меню под праздник</h4><p style="font-size: 12px;">Торт в подарок</p></div>
            </div>
            <div style="display: flex; gap: 12px; padding: 16px; background: #F5DDDB; border-radius: 16px;">
              <span class="material-icons" style="color: #C62828;">card_giftcard</span>
              <div><h4 style="font-family: 'Unbounded'; font-weight: 300; font-size: 13px;">Двойные бонусы</h4><p style="font-size: 12px;">Для всех гостей</p></div>
            </div>
            <div style="display: flex; gap: 12px; padding: 16px; background: #F5DDDB; border-radius: 16px;">
              <span class="material-icons" style="color: #C62828;">music_note</span>
              <div><h4 style="font-family: 'Unbounded'; font-weight: 300; font-size: 13px;">Музыка и декор</h4><p style="font-size: 12px;">Поможем оформить</p></div>
            </div>
          </div>
          <md-filled-button id="banket-order-btn" style="width: 100%;">Заказать банкет</md-filled-button>
        </div>
        
        <div id="tab-delivery" style="padding: 16px; display: none;">
          <div id="delivery-content"></div>
        </div>
        
        <div id="bottom-nav" style="position: fixed; bottom: 0; left: 0; right: 0; background: #FFFBFA; border-top: 1px solid #D8C2BF; display: flex; padding-bottom: env(safe-area-inset-bottom, 0px);">
          <button class="nav-item active" data-tab="home" style="flex: 1; display: flex; flex-direction: column; align-items: center; padding: 10px 8px; background: none; border: none; cursor: pointer;">
            <span class="material-icons" style="font-size: 20px;">home</span>
            <span style="font-size: 10px; font-family: 'Unbounded'; font-weight: 200;">Главная</span>
          </button>
          <button class="nav-item" data-tab="history" style="flex: 1; display: flex; flex-direction: column; align-items: center; padding: 10px 8px; background: none; border: none; cursor: pointer;">
            <span class="material-icons" style="font-size: 20px;">history</span>
            <span style="font-size: 10px; font-family: 'Unbounded'; font-weight: 200;">История</span>
          </button>
          <button class="nav-item" data-tab="banket" style="flex: 1; display: flex; flex-direction: column; align-items: center; padding: 10px 8px; background: none; border: none; cursor: pointer;">
            <span class="material-icons" style="font-size: 20px;">celebration</span>
            <span style="font-size: 10px; font-family: 'Unbounded'; font-weight: 200;">Банкет</span>
          </button>
          <button class="nav-item" data-tab="delivery" style="flex: 1; display: flex; flex-direction: column; align-items: center; padding: 10px 8px; background: none; border: none; cursor: pointer;">
            <span class="material-icons" style="font-size: 20px;">delivery_dining</span>
            <span style="font-size: 10px; font-family: 'Unbounded'; font-weight: 200;">Доставка</span>
          </button>
        </div>
        
        <md-dialog id="settings-dialog">
          <div slot="headline">Настройки</div>
          <div slot="content">
            <div style="margin-bottom: 16px;">
              <div style="font-size: 12px; color: #857370;">Имя</div>
              <div style="font-size: 16px; font-weight: 500;">${this.currentUser.name}</div>
            </div>
            <div style="margin-bottom: 16px;">
              <div style="font-size: 12px; color: #857370;">Номер карты</div>
              <div style="font-size: 16px; font-weight: 500;">${this.currentUser.code}</div>
            </div>
            <div style="margin-bottom: 16px;">
              <div style="font-size: 12px; color: #857370;">Бонусы</div>
              <div style="font-size: 16px; font-weight: 500;">${this.currentUser.bonuses}</div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px;">
              <span>Тёмная тема</span>
              <md-switch id="theme-switch"></md-switch>
            </div>
          </div>
          <div slot="actions">
            <md-text-button id="logout-btn">Выйти</md-text-button>
            <md-filled-button id="close-settings-btn">Закрыть</md-filled-button>
          </div>
        </md-dialog>
      </div>
    `;
    
    this.renderBarcode();
    this.loadChips();
    this.loadHistory();
    this.attachCabinetEvents();
  }

  renderBarcode() {
    const barcodeSvg = this.container.querySelector('#barcode-svg');
    if (barcodeSvg && typeof JsBarcode !== 'undefined') {
      JsBarcode(barcodeSvg, this.currentUser.code, {
        format: 'CODE128',
        width: 2.5,
        height: 68,
        displayValue: true,
        text: `Карта № ${this.currentUser.code}`,
        background: '#ffffff',
        lineColor: '#000000',
        margin: 10
      });
    } else {
      setTimeout(() => this.renderBarcode(), 100);
    }
  }

  async loadChips() {
    const container = this.container.querySelector('#chips-container');
    try {
      const response = await fetch(`${API_URL}?action=getUser&code=${this.currentUser.code}`);
      const data = await response.json();
      const chips = data.user?.chips || 0;
      
      container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <div>
            <div style="font-family: 'Unbounded'; font-weight: 300; font-size: 13px;">Карта обедов</div>
            <div style="font-size: 11px; color: #857370; margin-top: 2px;">10 фишек = 11-й обед в подарок</div>
          </div>
          <div style="font-family: 'Unbounded'; font-weight: 300; font-size: 11px; padding: 4px 12px; border-radius: 100px; background: #FFCDD2; color: #C62828;">${chips} / 10</div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(10, 1fr); gap: 6px; margin-bottom: 10px;">
          ${Array.from({ length: 10 }, (_, i) => `
            <div style="aspect-ratio: 1; border-radius: 50%; border: 1.5px solid #D8C2BF; display: flex; align-items: center; justify-content: center; ${i < chips ? 'background: #C62828; border-color: #C62828; color: white; transform: scale(1.08);' : ''}">
              ${i < chips ? '★' : ''}
            </div>
          `).join('')}
        </div>
        <div style="font-size: 12px; color: #857370; text-align: center;">
          ${chips >= 10 ? '🎉 Подарок готов! Сообщи кассиру, следующий обед бесплатно! 🎉' : `До подарка: ещё ${10 - chips} фишек`}
        </div>
      `;
    } catch (e) {
      container.innerHTML = '<div style="text-align: center;">Ошибка загрузки карты обедов</div>';
    }
  }

  async loadHistory() {
    const container = this.container.querySelector('#history-list');
    try {
      const response = await fetch(`${API_URL}?action=getTransactions&code=${this.currentUser.code}`);
      const data = await response.json();
      
      if (!data.ok || !data.transactions.length) {
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: #857370;">Операций пока нет</div>';
        return;
      }
      
      container.innerHTML = data.transactions.map(t => `
        <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: #F5DDDB; border-radius: 16px; margin-bottom: 8px;">
          <div style="width: 38px; height: 38px; border-radius: 100px; background: ${t.type === 'add' ? '#C8E6C9' : '#FFCDD2'}; display: flex; align-items: center; justify-content: center;">
            <span class="material-icons" style="font-size: 20px; color: ${t.type === 'add' ? '#2E7D32' : '#C62828'};">${t.type === 'add' ? 'arrow_upward' : 'arrow_downward'}</span>
          </div>
          <div style="flex: 1;">
            <div style="font-size: 13px; font-weight: 500;">${t.comment || 'Операция'}</div>
            <div style="font-size: 11px; color: #857370;">${String(t.createdAt).slice(0, 16)}</div>
          </div>
          <div style="font-family: 'Unbounded'; font-weight: 300; font-size: 15px; color: ${t.type === 'add' ? '#2E7D32' : '#C62828'};">${t.type === 'add' ? '+' : '-'}${t.amount}</div>
        </div>
      `).join('');
    } catch (e) {
      container.innerHTML = '<div style="text-align: center;">Ошибка загрузки истории</div>';
    }
  }

  attachCabinetEvents() {
    const navItems = this.container.querySelectorAll('.nav-item');
    const tabHome = this.container.querySelector('#tab-home');
    const tabHistory = this.container.querySelector('#tab-history');
    const tabBanket = this.container.querySelector('#tab-banket');
    const tabDelivery = this.container.querySelector('#tab-delivery');
    
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const tab = item.dataset.tab;
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        tabHome.style.display = 'none';
        tabHistory.style.display = 'none';
        tabBanket.style.display = 'none';
        tabDelivery.style.display = 'none';
        
        if (tab === 'home') tabHome.style.display = 'block';
        if (tab === 'history') tabHistory.style.display = 'block';
        if (tab === 'banket') tabBanket.style.display = 'block';
        if (tab === 'delivery') tabDelivery.style.display = 'block';
        
        if (tab === 'delivery') this.renderDelivery();
      });
    });
    
    const settingsBtn = this.container.querySelector('#settings-btn');
    const settingsDialog = this.container.querySelector('#settings-dialog');
    const closeSettingsBtn = this.container.querySelector('#close-settings-btn');
    const logoutBtn = this.container.querySelector('#logout-btn');
    
    settingsBtn.addEventListener('click', () => settingsDialog.show());
    closeSettingsBtn.addEventListener('click', () => settingsDialog.close());
    
    logoutBtn.addEventListener('click', () => {
      settingsDialog.close();
      localStorage.removeItem('cafeUserCode');
      localStorage.removeItem('cafeUserData');
      setTimeout(() => {
        this.currentUser = null;
        this.showAuth();
      }, 100);
    });
    
    const banketBtn = this.container.querySelector('#banket-order-btn');
    if (banketBtn) {
      banketBtn.addEventListener('click', () => {
        window.open('https://docs.google.com/forms/d/e/1FAIpQLScOlQBG0HjHlC0NetplG0BT8g2Tw474YH4s0S5XKX4lZGv3Zg/viewform', '_blank');
      });
    }
  }

  renderDelivery() {
    const container = this.container.querySelector('#delivery-content');
    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const isWeekday = day >= 1 && day <= 5;
    const isOpen = isWeekday && (hours > 9 || (hours === 9 && minutes >= 20)) && (hours < 13 || (hours === 13 && minutes <= 30));
    
    container.innerHTML = `
      <div style="margin-top: 16px;">
        <div style="background: ${isOpen ? '#C8E6C9' : '#FFCDD2'}; border-radius: 28px; padding: 24px; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
            <span class="material-icons" style="font-size: 24px; color: ${isOpen ? '#2E7D32' : '#C62828'};">${isOpen ? 'check_circle' : 'cancel'}</span>
            <span style="font-family: 'Unbounded'; font-weight: 300; font-size: 18px;">Доставка ${isOpen ? 'работает' : 'закрыта'}</span>
          </div>
          <div style="font-size: 13px; opacity: 0.8;">${isOpen ? 'Принимаем заказы до 13:30' : 'Доставка работает Пн–Пт с 9:20 до 13:30'}</div>
        </div>
        
        <div style="background: #F5DDDB; border-radius: 24px; padding: 16px 20px; margin-bottom: 20px;">
          <div style="font-family: 'Unbounded'; font-weight: 300; font-size: 13px; margin-bottom: 12px;">Часы работы</div>
          <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #D8C2BF;">
            <span>Понедельник — Пятница</span>
            <span style="font-family: 'Unbounded'; font-weight: 300; color: #C62828;">9:20 — 13:30</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 6px 0;">
            <span>Суббота — Воскресенье</span>
            <span style="color: #857370;">Выходной</span>
          </div>
        </div>
        
        ${isOpen ? `
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <a href="https://chibbis.ru/kirov/restaurant/perets/" target="_blank" style="display: flex; align-items: center; gap: 16px; padding: 18px 20px; background: #F5DDDB; border-radius: 24px; text-decoration: none; color: inherit;">
              <div style="width: 48px; height: 48px; border-radius: 16px; background: #FF6B35; display: flex; align-items: center; justify-content: center;">
                <span class="material-icons" style="color: white; font-size: 26px;">local_pizza</span>
              </div>
              <div style="flex: 1;">
                <div style="font-family: 'Unbounded'; font-weight: 300; font-size: 15px;">Chibbis</div>
                <div style="font-size: 12px; color: #857370;">chibbis.ru</div>
              </div>
              <span class="material-icons" style="color: #857370;">open_in_new</span>
            </a>
            <a href="https://eda.yandex.ru/kirov/r/stolovaja_pjerjec_kazan" target="_blank" style="display: flex; align-items: center; gap: 16px; padding: 18px 20px; background: #F5DDDB; border-radius: 24px; text-decoration: none; color: inherit;">
              <div style="width: 48px; height: 48px; border-radius: 16px; background: #FC3F1D; display: flex; align-items: center; justify-content: center;">
                <span class="material-icons" style="color: white; font-size: 26px;">directions_car</span>
              </div>
              <div style="flex: 1;">
                <div style="font-family: 'Unbounded'; font-weight: 300; font-size: 15px;">Яндекс Еда</div>
                <div style="font-size: 12px; color: #857370;">eda.yandex.ru</div>
              </div>
              <span class="material-icons" style="color: #857370;">open_in_new</span>
            </a>
          </div>
        ` : ''}
      </div>
    `;
  }
}

const app = new App();
app.init();
