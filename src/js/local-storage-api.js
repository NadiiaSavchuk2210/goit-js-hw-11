export const LS_KEYS = Object.freeze({
  form: 'gallery-form-state',
});

export function setDataToLs(key, data) {
  const jsonObj = JSON.stringify(data);
  localStorage.setItem(key, jsonObj);
}

export function getDataFromLS(key, defaultValue = {}) {
  const jsonData = localStorage.getItem(key);
  try {
    return jsonData ? JSON.parse(jsonData) : defaultValue;
  } catch (error) {
    console.warn('Failed to parse localStorage:', error);
    return defaultValue;
  }
}

export function removeDataFromLS(key) {
  localStorage.removeItem(key);
}
