export class AuthScreen {
  constructor({ onLogin, onRegister }) {
    this.onLogin = onLogin;
    this.onRegister = onRegister;
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
      <div style="min-height: 100dvh; display: flex; align-items: center; justify-content: center; padding: 24px;">
        <div style="max-width: 400px; width: 100%;">
          <div style="text-align: center; margin-bottom: 32px;">
            <img src="/logo.webp" alt="ПЕРЕЦ" style="width: 64px; height: 64px; border-radius: 16px;">
            <h1 style="font-family: 'Unbounded'; font-weight: 200; font-size: 24px; letter-spacing: 2px; margin-top: 16px;">ПЕРЕЦ</h1>
          </div>
          
          <div class="seg-tabs" style="display: flex; gap: 8px; background: #F5DDDB; border-radius: 100px; padding: 4px; margin-bottom: 24px;">
            <button id="tab-login-btn" class="seg-tab active" style="flex: 1; padding: 10px; border: none; border-radius: 100px; font-family: 'Unbounded'; font-weight: 300; font-size: 12px; cursor: pointer;">Войти</button>
            <button id="tab-register-btn" class="seg-tab" style="flex: 1; padding: 10px; border: none; border-radius: 100px; font-family: 'Unbounded'; font-weight: 300; font-size: 12px; cursor: pointer;">Регистрация</button>
          </div>
          
          <div id="login-panel">
            <div class="field" style="margin-bottom: 16px;">
              <input type="text" id="login-phone" placeholder=" " style="width: 100%; padding: 18px 16px 6px; border: 1px solid #D8C2BF; border-radius: 12px; font-size: 16px;">
              <label style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 15px; color: #857370; pointer-events: none;">Логин</label>
            </div>
            <div class="field" style="margin-bottom: 16px;">
              <input type="password" id="login-password" placeholder=" " style="width: 100%; padding: 18px 16px 6px; border: 1px solid #D8C2BF; border-radius: 12px; font-size: 16px;">
              <label style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 15px; color: #857370; pointer-events: none;">Пароль</label>
            </div>
            <div id="login-error" style="color: #BA1A1A; font-size: 14px; margin-top: 8px; display: none;"></div>
            <button id="login-btn" style="width: 100%; padding: 15px; background: #C62828; color: white; border: none; border-radius: 100px; font-family: 'Unbounded'; font-weight: 300; font-size: 13px; cursor: pointer; margin-top: 8px;">Войти</button>
          </div>
          
          <div id="register-panel" style="display: none;">
            <div class="field" style="margin-bottom: 16px;">
              <input type="text" id="reg-name" placeholder=" " style="width: 100%; padding: 18px 16px 6px; border: 1px solid #D8C2BF; border-radius: 12px; font-size: 16px;">
              <label style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 15px; color: #857370; pointer-events: none;">Имя</label>
            </div>
            <div class="field" style="margin-bottom: 16px;">
              <input type="text" id="reg-phone" placeholder=" " style="width: 100%; padding: 18px 16px 6px; border: 1px solid #D8C2BF; border-radius: 12px; font-size: 16px;">
              <label style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 15px; color: #857370; pointer-events: none;">Логин</label>
            </div>
            <div class="field" style="margin-bottom: 16px;">
              <input type="password" id="reg-password" placeholder=" " style="width: 100%; padding: 18px 16px 6px; border: 1px solid #D8C2BF; border-radius: 12px; font-size: 16px;">
              <label style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 15px; color: #857370; pointer-events: none;">Пароль (мин. 8 символов)</label>
            </div>
            <div id="register-error" style="color: #BA1A1A; font-size: 14px; margin-top: 8px; display: none;"></div>
            <button id="register-btn" style="width: 100%; padding: 15px; background: #C62828; color: white; border: none; border-radius: 100px; font-family: 'Unbounded'; font-weight: 300; font-size: 13px; cursor: pointer; margin-top: 8px;">Создать аккаунт</button>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    const loginTab = this.container.querySelector('#tab-login-btn');
    const registerTab = this.container.querySelector('#tab-register-btn');
    const loginPanel = this.container.querySelector('#login-panel');
    const registerPanel = this.container.querySelector('#register-panel');
    const loginBtn = this.container.querySelector('#login-btn');
    const registerBtn = this.container.querySelector('#register-btn');
    const loginError = this.container.querySelector('#login-error');
    const registerError = this.container.querySelector('#register-error');

    loginTab.addEventListener('click', () => {
      loginTab.classList.add('active');
      registerTab.classList.remove('active');
      loginPanel.style.display = 'block';
      registerPanel.style.display = 'none';
    });

    registerTab.addEventListener('click', () => {
      registerTab.classList.add('active');
      loginTab.classList.remove('active');
      loginPanel.style.display = 'none';
      registerPanel.style.display = 'block';
    });

    loginBtn.addEventListener('click', async () => {
      const phone = this.container.querySelector('#login-phone').value;
      const password = this.container.querySelector('#login-password').value;
      loginError.style.display = 'none';
      
      if (!phone || !password) {
        loginError.textContent = 'Заполните все поля';
        loginError.style.display = 'block';
        return;
      }
      
      const result = await this.onLogin(phone, password);
      if (!result.ok) {
        loginError.textContent = result.error || 'Ошибка входа';
        loginError.style.display = 'block';
      }
    });

    registerBtn.addEventListener('click', async () => {
      const name = this.container.querySelector('#reg-name').value;
      const phone = this.container.querySelector('#reg-phone').value;
      const password = this.container.querySelector('#reg-password').value;
      registerError.style.display = 'none';
      
      if (!name || !phone || password.length < 8) {
        registerError.textContent = 'Заполните все поля (пароль минимум 8 символов)';
        registerError.style.display = 'block';
        return;
      }
      
      const result = await this.onRegister(name, phone, password);
      if (!result.ok) {
        registerError.textContent = result.error || 'Ошибка регистрации';
        registerError.style.display = 'block';
      }
    });
  }
}
