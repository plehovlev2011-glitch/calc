import '@material/web/card/card.js';

export class BonusCard {
  constructor({ container, user }) {
    this.container = container;
    this.user = user;
    this.render();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="bonus-card-expressive" style="margin: 16px 0;">
        <div style="position: relative; z-index: 1;">
          <div style="font-family: 'Unbounded'; font-weight: 200; font-size: 10px; letter-spacing: 2px; opacity: 0.75; margin-bottom: 4px;">БОНУСНЫЙ СЧЁТ</div>
          <div style="display: flex; align-items: baseline; gap: 8px;">
            <span style="font-family: 'Unbounded'; font-weight: 200; font-size: clamp(34px, 7vw, 56px); line-height: 1;">${this.user.bonuses}</span>
            <span style="font-family: 'Unbounded'; font-weight: 200; font-size: clamp(11px, 2vw, 16px); opacity: 0.8;">бонусов</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 20px;">
            <div style="font-size: 11px; opacity: 0.55;">1 бонус = 1 ₽ скидки</div>
            <div style="font-family: 'Unbounded'; font-weight: 300; font-size: 12px; letter-spacing: 3px; background: rgba(255,255,255,0.12); backdrop-filter: blur(4px); padding: 5px 12px; border-radius: 100px; border: 1px solid rgba(255,255,255,0.15);">№ ${this.user.code}</div>
          </div>
        </div>
      </div>
    `;
  }
}
