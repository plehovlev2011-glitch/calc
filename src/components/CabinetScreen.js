export class CabinetScreen {
  constructor({ user, onLogout }) {
    this.user = user;
    this.onLogout = onLogout;
    this.container = null;
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
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #D8C2BF;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="/logo.webp" alt="ПЕРЕЦ" style="width: 32px; height: 32px;">
            <span style="font-family: 'Unbounded'; font-weight: 200; font-size: 14px; letter-spacing: 2px;">ПЕРЕЦ</span>
          </div>
          <button id="settings-btn" style="background: none; border: none; cursor: pointer; padding: 8px;">
            <span class="material-icons">settings</span>
          </button>
        </div>
        
        <div id="tab-home" class="tab-content" style="padding: 16px;">
          <div class="bonus-card-expressive" style="margin: 16px 0; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #533483 100%); border-radius: 28px; padding: 24px; color: white;">
            <div style="font-family: 'Unbounded'; font-weight: 200; font-size: 10px; letter-spacing: 2px; opacity: 0.75; margin-bottom: 4px;">БОНУСНЫЙ СЧЁТ</div>
            <div style="display: flex; align-items: baseline; gap: 8px;">
              <span style="font-family: 'Unbounded'; font-weight: 200; font-size: 48px; line-height: 1;">${this.user.bonuses}</span>
              <span style="font-family: 'Unbounded'; font-weight: 200; font-size: 16px; opacity: 0.8;">бонусов</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 20px;">
              <div style="font-size: 11px; opacity: 0.55;">1 бонус = 1 ₽ скидки</div>
              <div style="font-family: 'Unbounded'; font-weight: 300; font-size: 12px; letter-spacing: 3px; background: rgba(255,255,255,0.12); backdrop-filter: blur(4px); padding: 5px 12px; border-radius: 100px;">№ ${this.user.code}</div>
            </div>
          </div>
          
          <div id="chips-container"></div>
          
          <div style="margin-top: 20px;">
            <div style="font-family: 'Unbounded'; font-weight: 200; font-size: 10px; letter-spacing: 2px; color: #857370; margin-bottom: 12px;">КАРТА</div>
            <div style="background: white; border-radius: 16px; padding: 20px; text-align: center;">
              <svg id="barcode-svg"></svg>
              <div style="font-size: 12px; color: #857370; margin-top: 8px;">Покажите на кассе для начисления бонусов</div>
            </div>
          </div>
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
        
        <div class="bottom-nav" style="position: fixed; bottom: 0; left: 0; right: 0; background: var(--md-sys-color-surface, #FFFBFA); border-top: 1px solid #D8C2BF; display: flex; padding-bottom: env(safe-area-inset-bottom, 0px);">
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
        
        <div id="settings-dialog" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.4); align-items: flex-end; z-index: 100;">
          <div style="background: var(--md-sys-color-surface, #FFFBFA); border-radius: 28px 28px 0 0; width: 100%; max-width: 500px; margin: 0 auto; padding: 8px 24px 32px;">
            <div style="width: 36px; height: 4px; background: #D8C2BF; border-radius: 2px; margin: 0 auto 20px;"></div>
            <div style="font-family: 'Unbounded'; font-weight: 300; font-size: 17px; margin-bottom: 20px;">Настройки</div>
            <div style="margin-bottom: 16px;">
              <div style="font-size: 12px; color: #857370;">Имя</div>
              <div style="font-size: 16px; font-weight: 500;">${this.user.name}</div>
            </div>
            <div style="margin-bottom: 16px;">
              <div style="font-size: 12px; color: #857370;">Номер карты</div>
              <div style="font-size: 16px; font-weight: 500;">${this.user.code}</div>
            </div>
            <div style="margin-bottom: 16px;">
              <div style="font-size: 12px; color: #857370;">Бонусы</div>
              <div style="font-size: 16px; font-weight: 500;">${this.user.bonuses}</div>
            </div>
            <button id="logout-btn" style="width: 100%; padding: 14px; background: #C62828; color: white; border: none; border-radius: 100px; font-family: 'Unbounded'; font-weight: 300; font-size: 12px; cursor: pointer; margin-top: 16px;">Выйти из аккаунта</button>
            <button id="close-settings-btn" style="width: 100%; padding: 14px; background: #F5DDDB; color: #201A19; border: none; border-radius: 100px; font-family: 'Unbounded'; font-weight: 300; font-size: 12px; cursor: pointer; margin-top: 8px;">Закрыть</button>
          </div>
        </div>
      </div>
    `;
    
    this.renderBarcode();
    this.renderChips();
  }

  renderBarcode() {
    const barcodeSvg = this.container.querySelector('#barcode-svg');
    if (barcodeSvg && typeof JsBarcode !== 'undefined') {
      JsBarcode(barcodeSvg, this.user.code, {
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
  }

  async renderChips() {
    const container = this.container.querySelector('#chips-container');
    try {
      const response = await fetch(`https://script.google.com/macros/s/AKfycbwIiLDTJGm3F-EG0SMPWqdXL06NXLPZ-IyuUKTQOnyGds4LCDqPE-rKz-twWmg8JO9h/exec?action=getUser&code=${this.user.code}`);
      const data = await response.json();
      const chips = data.user?.chips || 0;
      
      container.innerHTML = `
        <div style="background: var(--md-sys-color-surface-variant, #F5DDDB); border-radius: 28px; padding: 20px; margin: 16px 0;">
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
        </div>
      `;
    } catch (e) {
      container.innerHTML = '<div style="padding: 16px; text-align: center;">Загрузка карты обедов...</div>';
    }
  }

  attachEvents() {
    const settingsBtn = this.container.querySelector('#settings-btn');
    const settingsDialog = this.container.querySelector('#settings-dialog');
    const closeSettingsBtn = this.container.querySelector('#close-settings-btn');
    const logoutBtn = this.container.querySelector('#logout-btn');
    
    const navItems = this.container.querySelectorAll('.nav-item');
    const tabHome = this.container.querySelector('#tab-home');
    const tabHistory = this.container.querySelector('#tab-history');
    const tabBanket = this.container.querySelector('#tab-banket');
    const tabDelivery = this.container.querySelector('#tab-delivery');
    
    settingsBtn.addEventListener('click', () => {
      settingsDialog.style.display = 'flex';
    });
    
    closeSettingsBtn.addEventListener('click', () => {
      settingsDialog.style.display = 'none';
    });
    
    logoutBtn.addEventListener('click', () => {
      settingsDialog.style.display = 'none';
      this.onLogout();
    });
    
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
      });
    });
  }
}
