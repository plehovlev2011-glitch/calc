import '@material/web/navigationbar/navigation-bar.js';
import '@material/web/navigationbar/navigation-tab.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/switch/switch.js';
import '@material/web/dialog/dialog.js';
import '@material/web/snackbar/snackbar.js';
import { BonusCard } from './BonusCard.js';
import { ChipsTracker } from './ChipsTracker.js';
import { HistoryList } from './HistoryList.js';
import { DeliverySection } from './DeliverySection.js';

export class CabinetScreen {
  constructor({ user, onLogout }) {
    this.user = user;
    this.onLogout = onLogout;
    this.container = null;
    this.currentTab = 'home';
  }

  mount(container) {
    this.container = container;
    this.render();
    this.attachEvents();
  }

  unmount() {
    if (this.container) this.container.innerHTML = '';
  }

  render() {
    this.container.innerHTML = `
      <div class="app-container">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid var(--md-sys-color-outline-variant);">
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="/logo.webp" alt="ПЕРЕЦ" style="width: 32px; height: 32px;">
            <span style="font-family: 'Unbounded'; font-weight: 200; font-size: 14px; letter-spacing: 2px;">ПЕРЕЦ</span>
          </div>
          <md-icon-button id="settings-btn">
            <md-icon>settings</md-icon>
          </md-icon-button>
        </div>
        
        <div id="tab-home" class="tab-content" style="padding: 16px;">
          <div id="bonus-card-container"></div>
          <div id="chips-container"></div>
          <div class="barcode-card" id="barcode-container"></div>
          <div id="promotions-container"></div>
        </div>
        
        <div id="tab-history" class="tab-content" style="padding: 16px; display: none;">
          <div id="history-container"></div>
        </div>
        
        <div id="tab-banket" class="tab-content" style="padding: 16px; display: none;">
          <div id="banket-container"></div>
        </div>
        
        <div id="tab-delivery" class="tab-content" style="padding: 16px; display: none;">
          <div id="delivery-container"></div>
        </div>
        
        <md-navigation-bar id="bottom-nav" style="position: fixed; bottom: 0; width: 100%; max-width: 1200px; left: 50%; transform: translateX(-50%);">
          <md-navigation-tab id="nav-home" icon="home" label="Главная"></md-navigation-tab>
          <md-navigation-tab id="nav-history" icon="history" label="История"></md-navigation-tab>
          <md-navigation-tab id="nav-banket" icon="celebration" label="Банкет"></md-navigation-tab>
          <md-navigation-tab id="nav-delivery" icon="delivery_dining" label="Доставка"></md-navigation-tab>
        </md-navigation-bar>
        
        <md-snackbar id="snackbar"></md-snackbar>
        
        <md-dialog id="settings-dialog">
          <div slot="headline">Настройки</div>
          <div slot="content">
            <div style="margin-bottom: 16px;">
              <div style="font-size: 14px; color: var(--md-sys-color-on-surface-variant);">Имя</div>
              <div style="font-size: 16px; font-weight: 500;" id="settings-name">${this.user.name}</div>
            </div>
            <div style="margin-bottom: 16px;">
              <div style="font-size: 14px; color: var(--md-sys-color-on-surface-variant);">Номер карты</div>
              <div style="font-size: 16px; font-weight: 500;" id="settings-code">${this.user.code}</div>
            </div>
            <div style="margin-bottom: 16px;">
              <div style="font-size: 14px; color: var(--md-sys-color-on-surface-variant);">Бонусы</div>
              <div style="font-size: 16px; font-weight: 500;" id="settings-bonuses">${this.user.bonuses}</div>
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
    
    new BonusCard({ container: this.container.querySelector('#bonus-card-container'), user: this.user });
    new ChipsTracker({ container: this.container.querySelector('#chips-container'), userCode: this.user.code });
    new HistoryList({ container: this.container.querySelector('#history-container'), userCode: this.user.code });
    new DeliverySection({ container: this.container.querySelector('#delivery-container') });
    
    this.renderBanket();
    this.renderPromotions();
    this.renderBarcode();
  }

  renderBanket() {
    const container = this.container.querySelector('#banket-container');
    container.innerHTML = `
      <div style="margin-bottom: 24px;">
        <img src="/banketBanner.webp" alt="Банкет" style="width: 100%; border-radius: var(--md-sys-shape-corner-large); margin-bottom: 16px;">
        <h2 style="font-family: 'Unbounded'; font-weight: 200; font-size: 18px; margin-bottom: 16px;">Отметьте у нас</h2>
        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
          ${this.getBanketFeatures().map(f => `
            <div style="display: flex; gap: 16px; padding: 16px; background: var(--md-sys-color-surface-variant); border-radius: var(--md-sys-shape-corner-medium);">
              <span class="material-symbols-outlined" style="color: var(--md-sys-color-primary); font-size: 24px;">${f.icon}</span>
              <div>
                <h4 style="font-family: 'Unbounded'; font-weight: 300; font-size: 13px; margin-bottom: 4px;">${f.title}</h4>
                <p style="font-size: 12px; color: var(--md-sys-color-on-surface-variant);">${f.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>
        <md-filled-button id="banket-order-btn" style="width: 100%;">Заказать банкет</md-filled-button>
      </div>
    `;
    this.container.querySelector('#banket-order-btn').addEventListener('click', () => {
      window.open('https://docs.google.com/forms/d/e/...', '_blank');
    });
  }

  getBanketFeatures() {
    return [
      { icon: 'groups', title: 'Зал до 80 гостей', desc: 'Уютное пространство с возможностью полной аренды' },
      { icon: 'restaurant_menu', title: 'Меню под ваш праздник', desc: 'Индивидуальное меню, торт в подарок' },
      { icon: 'card_giftcard', title: 'Двойные бонусы', desc: 'Все гости банкета получают двойные бонусы' },
      { icon: 'music_note', title: 'Музыка и декор', desc: 'Поможем с оформлением и музыкальным сопровождением' }
    ];
  }

  renderPromotions() {
    const container = this.container.querySelector('#promotions-container');
    container.innerHTML = `
      <div style="margin-top: 20px;">
        <div style="font-family: 'Unbounded'; font-weight: 200; font-size: 10px; letter-spacing: 2px; color: var(--md-sys-color-outline); margin-bottom: 12px;">АКЦИИ</div>
        <div style="display: flex; gap: 12px; overflow-x: auto; padding-bottom: 4px;">
          <div class="promo-card" style="flex: 0 0 240px; background: var(--md-sys-color-secondary-container); border-radius: var(--md-sys-shape-corner-large); padding: 16px;">
            <div style="font-family: 'Unbounded'; font-weight: 300; font-size: 13px; color: var(--md-sys-color-on-secondary-container); margin-bottom: 6px;">Накопительная система</div>
            <div style="font-size: 12px; color: var(--md-sys-color-on-secondary-container); opacity: 0.75;">Каждый 10-й обед в подарок!</div>
          </div>
          <div class="promo-card" style="flex: 0 0 240px; background: var(--md-sys-color-secondary-container); border-radius: var(--md-sys-shape-corner-large); padding: 16px;">
            <div style="font-family: 'Unbounded'; font-weight: 300; font-size: 13px; color: var(--md-sys-color-on-secondary-container); margin-bottom: 6px;">Банкетный бонус</div>
            <div style="font-size: 12px; color: var(--md-sys-color-on-secondary-container); opacity: 0.75;">При заказе банкета — двойные бонусы</div>
          </div>
        </div>
      </div>
    `;
  }

  renderBarcode() {
    const container = this.container.querySelector('#barcode-container');
    container.innerHTML = `
      <svg id="barcode-svg"></svg>
      <div style="font-size: 12px; color: var(--md-sys-color-outline); margin-top: 8px; text-align: center;">Покажите на кассе для начисления бонусов</div>
    `;
    JsBarcode('#barcode-svg', this.user.code, {
      format: 'CODE128',
      width: 2.5,
      height: 68,
      displayValue: true,
      text: `Карта № ${this.user.code}`,
      background: '#ffffff',
      lineColor: '#000000',
      margin: 10
    });
  }

  attachEvents() {
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
    const themeSwitch = this.container.querySelector('#theme-switch');
    
    settingsBtn.addEventListener('click', () => settingsDialog.show());
    closeSettingsBtn.addEventListener('click', () => settingsDialog.close());
    logoutBtn.addEventListener('click', () => {
      settingsDialog.close();
      this.onLogout();
    });
    
    themeSwitch.addEventListener('change', (e) => {
      if (e.target.selected) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    });
  }
}
