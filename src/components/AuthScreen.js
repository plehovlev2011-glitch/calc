import '@material/web/button/filled-button.js';
import '@material/web/button/text-button.js';
import '@material/web/textfield/filled-text-field.js';
import '@material/web/tabs/primary-tab.js';
import '@material/web/tabs/tabs.js';
import '@material/web/progress/circular-progress.js';

export class AuthScreen {
  constructor({ onLogin }) {
    this.onLogin = onLogin;
    this.container = null;
    this.currentTab = 'login';
  }

  mount(container) {
    this.container = container;
    this.render();
  }

  unmount() {
    if (this.container) this.container.innerHTML = '';
  }

  render() {
    this.container.innerHTML = `
      <div style="min-height: 100dvh; display: flex; align-items: center; justify-content: center; padding: 24px;">
        <div style="max-width: 400px; width: 100%;">
          <div style="text-align: center; margin-bottom: 32px;">
            <img src="/logo.webp" alt="ПЕРЕЦ" style="width: 64px; height: 64px; border-radius: 16px;">
            <h1 style="font-family: 'Unbounded'; font-weight: 200; font-size: 24px; letter-spacing: 2px; margin-top: 16px;">ПЕРЕЦ</h1>
          </div>
          
          <md-tabs id="auth-tabs">
            <md-primary-tab id="tab-login">Войти</md-primary-tab>
            <md-primary-tab id="tab-register">Регистрация</md-primary-tab>
          </md-tabs>
          
          <div id="login-panel" class="auth-panel">
            <md-filled-text-field id="login-phone" label="Логин" type="text" style="width: 100%; margin-top: 24px;"></md-filled-text-field>
            <md-filled-text-field id="login-password" label="Пароль" type="password" style="width: 100%; margin-top: 16px;"></md-filled-text-field>
            <div id="login-error" style="color: var(--md-sys-color-error); font-size: 14px; margin-top: 12px; display: none;"></div>
            <md-filled-button id="login-btn" style="width: 100%; margin-top: 24px;">Войти</md-filled-button>
            <md-text-button style="width: 100%; margin-top: 8px;">Проблемы с авторизацией?</md-text-button>
          </div>
          
          <div id="register-panel" class="auth-panel" style="display: none;">
            <md-filled-text-field id="reg-name" label="Имя" type="text" style="width: 100%; margin-top: 24px;"></md-filled-text-field>
            <md-filled-text-field id="reg-phone" label="Логин" type="text" style="width: 100%; margin-top: 16px;"></md-filled-text-field>
            <md-filled-text-field id="reg-password" label="Пароль (минимум 8 символов)" type="password" style="width: 100%; margin-top: 16px;"></md-filled-text-field>
            <div id="register-error" style="color: var(--md-sys-color-error); font-size: 14px; margin-top: 12px; display: none;"></div>
            <md-filled-button id="register-btn" style="width: 100%; margin-top: 24px;">Создать аккаунт</md-filled-button>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const tabs = this.container.querySelector('#auth-tabs');
    const loginPanel = this.container.querySelector('#login-panel');
    const registerPanel = this.container.querySelector('#register-panel');
    
    tabs.addEventListener('change', (e) => {
      const activeIndex = e.detail.activeTabIndex;
      this.currentTab = activeIndex === 0 ? 'login' : 'register';
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
      const result = await api.login(phone, password);
      if (result.ok && result.user) {
        this.onLogin(result.user);
      } else {
        errorEl.textContent = result.error || 'Ошибка входа';
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
      const result = await api.register(name, phone, password);
      if (result.ok) {
        this.onLogin({ code: result.code, name, bonuses: 0 });
      } else {
        errorEl.textContent = result.error || 'Ошибка регистрации';
        errorEl.style.display = 'block';
      }
    } catch (e) {
      errorEl.textContent = 'Ошибка соединения';
      errorEl.style.display = 'block';
    }
  }
}
