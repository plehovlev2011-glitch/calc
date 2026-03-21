import {styles as typescaleStyles} from '@material/web/typography/md-typescale-styles.js';

// Импортируем все нужные компоненты
import '@material/web/button/filled-button.js';
import '@material/web/button/text-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/textfield/filled-text-field.js';
import '@material/web/tabs/primary-tab.js';
import '@material/web/tabs/tabs.js';
import '@material/web/navigationbar/navigation-bar.js';
import '@material/web/navigationbar/navigation-tab.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/switch/switch.js';
import '@material/web/dialog/dialog.js';
import '@material/web/snackbar/snackbar.js';
import '@material/web/card/card.js';
import '@material/web/chip/assist-chip.js';
import '@material/web/chip/chip-set.js';
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
          
          <md-tabs id="auth-tabs">
            <md-primary-tab>Войти</md-primary-tab>
            <md-primary-tab>Регистрация</md-primary-tab>
          </md-tabs>
          
          <div id="login-panel" style="margin-top: 24px;">
            <md-filled-text-field id="login-phone" label="Логин" type="text" style="width: 100%;"></md-filled-text-field>
            <md-filled-text-field id="login-password" label="Пароль" type="password" style="width: 100%; margin-top: 16px;"></md-filled-text-field>
            <div id="login-error" style="color: #BA1A1A; font-size: 14px; margin-top: 12px; display: none;"></div>
            <md-filled-button id="login-btn" style="width: 100%; margin-top: 24px;">Войти</md-filled-button>
            <md-text-button style="width: 100%; margin-top: 8px;">Проблемы с авторизацией?</md-text-button>
          </div>
          
          <div id="register-panel" style="display: none; margin-top: 24px;">
            <md-filled-text-field id="reg-name" label="Имя" type="text" style="width: 100%;"></md-filled-text-field>
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
    const tabs = this.container.querySelector('#auth-tabs');
    const loginPanel = this.container.querySelector('#login-panel');
    const registerPanel = this.container.querySelector('#register-panel');
    
    tabs.addEventListener('change', (e) => {
      const activeIndex = e.detail.activeTabIndex;
      loginPanel.style.display = activeIndex === 0 ? 'block' : 'none';
      registerPanel.style.display = activeIndex === 0 ? 'none' : 'block';
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
      <div style="max-width: 1200px; margin: 0 auto;">
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
        </div>
        
        <div id="tab-history" style="padding: 16px; display: none;">
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
        
        <md-navigation-bar id="bottom-nav" style="position: fixed; bottom: 0; width: 100%; max-width: 1200px; left: 50%; transform: translateX(-50%);">
          <md-navigation-tab id="nav-home" icon="home" label="Главная"></md-navigation-tab>
          <md-navigation-tab id="nav-history" icon="history" label="История"></md-navigation-tab>
          <md-navigation-tab id="nav-banket" icon="celebration" label="Банкет"></md-navigation-tab>
          <md-navigation-tab id="nav-delivery" icon="delivery_dining" label="Доставка"></md-navigation-tab>
        </md-navigation-bar>
        
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
        
        <md-snackbar id="snackbar"></md-snackbar>
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
    const navHome = this.container.querySelector('#nav-home');
    const navHistory = this.container.querySelector('#nav-history');
    const navBanket = this.container.querySelector('#nav-banket');
    const navDelivery = this.container.querySelector('#nav-delivery');
    const tabHome = this.container.querySelector('#tab-home');
    const tabHistory = this.container.querySelector('#tab-history');
    const tabBanket = this.container.querySelector('#tab-banket');
    const tabDelivery = this.container.querySelector('#tab-delivery');
    
    const switchTab = (tab) => {
      tabHome.style.display = 'none';
      tabHistory.style.display = 'none';
      tabBanket.style.display = 'none';
      tabDelivery.style.display = 'none';
      if (tab === 'home') tabHome.style.display = 'block';
      if (tab === 'history') tabHistory.style.display = 'block';
      if (tab === 'banket') tabBanket.style.display = 'block';
      if (tab === 'delivery') tabDelivery.style.display = 'block';
    };
    
    navHome.addEventListener('click', () => switchTab('home'));
    navHistory.addEventListener('click', () => switchTab('history'));
    navBanket.addEventListener('click', () => switchTab('banket'));
    navDelivery.addEventListener('click', () => switchTab('delivery'));
    
    const settingsBtn = this.container.querySelector('#settings-btn');
    const settingsDialog = this.container.querySelector('#settings-dialog');
    const closeSettingsBtn = this.container.querySelector('#close-settings-btn');
    const logoutBtn = this.container.querySelector('#logout-btn');
    const snackbar = this.container.querySelector('#snackbar');
    
    settingsBtn.addEventListener('click', () => settingsDialog.show());
    closeSettingsBtn.addEventListener('click', () => settingsDialog.close());
    
    logoutBtn.addEventListener('click', () => {
      settingsDialog.close();
      localStorage.removeItem('cafeUserCode');
      localStorage.removeItem('cafeUserData');
      snackbar.labelText = 'Вы вышли из аккаунта';
      snackbar.show();
      setTimeout(() => {
        this.currentUser = null;
        this.showAuth();
      }, 1000);
    });
    
    const banketBtn = this.container.querySelector('#banket-order-btn');
    if (banketBtn) {
      banketBtn.addEventListener('click', () => {
        window.open('https://docs.google.com/forms/d/e/1FAIpQLScOlQBG0HjHlC0NetplG0BT8g2Tw474YH4s0S5XKX4lZGv3Zg/viewform', '_blank');
      });
    }
  }
}

const app = new App();
app.init();
