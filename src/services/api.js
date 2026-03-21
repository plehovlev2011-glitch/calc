const API_URL = 'https://script.google.com/macros/s/AKfycbwIiLDTJGm3F-EG0SMPWqdXL06NXLPZ-IyuUKTQOnyGds4LCDqPE-rKz-twWmg8JO9h/exec';

export const api = {
  async login(phone, password) {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'login', phone, password })
    });
    return response.json();
  },
  
  async register(name, phone, password) {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'register', name, phone, password })
    });
    return response.json();
  },
  
  async getUser(code) {
    const response = await fetch(`${API_URL}?action=getUser&code=${code}`);
    const data = await response.json();
    return data.ok ? data.user : null;
  },
  
  async getTransactions(code) {
    const response = await fetch(`${API_URL}?action=getTransactions&code=${code}`);
    return response.json();
  }
};
