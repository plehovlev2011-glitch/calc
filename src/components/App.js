import { AuthScreen } from './AuthScreen.js';
import { CabinetScreen } from './CabinetScreen.js';
import { storage } from '../utils/storage.js';
import { api } from '../services/api.js';

export class App {
  constructor() {
    this.currentUser = null;
    this.container = null;
  }

  async mount(container) {
    this.container = container;
    await this.init();
  }

  async init() {
    const savedCode = storage.get('cafeUserCode');
    
    if (savedCode) {
      try {
        const user = await api.getUser(savedCode);
        if (user) {
          this.currentUser = user;
          this.showCabinet();
          return;
        }
      } catch (e) {
        const cached = storage.get('cafeUserData');
        if (cached) {
          this.currentUser = cached;
          this.showCabinet();
          return;
        }
      }
    }
    
    this.showAuth();
  }

  showAuth() {
    if (this.cabinetScreen) this.cabinetScreen.unmount();
    this.authScreen = new AuthScreen({
      onLogin: (user) => {
        this.currentUser = user;
        this.showCabinet();
      }
    });
    this.authScreen.mount(this.container);
  }

  showCabinet() {
    if (this.authScreen) this.authScreen.unmount();
    this.cabinetScreen = new CabinetScreen({
      user: this.currentUser,
      onLogout: () => {
        storage.remove('cafeUserCode');
        storage.remove('cafeUserData');
        this.currentUser = null;
        this.showAuth();
      }
    });
    this.cabinetScreen.mount(this.container);
  }
}
