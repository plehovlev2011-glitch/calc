import '@material/web/chip/chip.js';
import '@material/web/chip/assist-chip.js';

export class ChipsTracker {
  constructor({ container, userCode }) {
    this.container = container;
    this.userCode = userCode;
    this.load();
  }
  
  async load() {
    const response = await fetch(`https://script.google.com/macros/s/AKfycbwIiLDTJGm3F-EG0SMPWqdXL06NXLPZ-IyuUKTQOnyGds4LCDqPE-rKz-twWmg8JO9h/exec?action=getUser&code=${this.userCode}`);
    const data = await response.json();
    const chips = data.user?.chips || 0;
    this.render(chips);
  }
  
  render(chips) {
    this.container.innerHTML = `
      <div class="chips-card" style="background: var(--md-sys-color-surface-variant); border-radius: var(--md-sys-shape-corner-large); padding: 20px; margin: 16px 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <div>
            <div style="font-family: 'Unbounded'; font-weight: 300; font-size: 13px;">Карта обедов</div>
            <div style="font-size: 11px; color: var(--md-sys-color-outline); margin-top: 2px;">10 фишек = 11-й обед в подарок</div>
          </div>
          <div style="font-family: 'Unbounded'; font-weight: 300; font-size: 11px; padding: 4px 12px; border-radius: 100px; background: var(--md-sys-color-primary-container); color: var(--md-sys-color-primary);">${chips} / 10</div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(10, 1fr); gap: 6px; margin-bottom: 10px;">
          ${Array.from({ length: 10 }, (_, i) => `
            <div class="chip-dot" style="aspect-ratio: 1; border-radius: 50%; border: 1.5px solid var(--md-sys-color-outline-variant); display: flex; align-items: center; justify-content: center; ${i < chips ? 'background: var(--md-sys-color-primary); border-color: var(--md-sys-color-primary); color: white; transform: scale(1.08);' : ''}">
              ${i < chips ? '★' : ''}
            </div>
          `).join('')}
        </div>
        <div style="font-size: 12px; color: var(--md-sys-color-outline); text-align: center;">
          ${chips >= 10 ? '🎉 Подарок готов! Сообщи кассиру, следующий обед бесплатно! 🎉' : `До подарка: ещё ${10 - chips} фишек`}
        </div>
      </div>
    `;
  }
}
