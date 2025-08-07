import {
  getDataFromLS,
  setDataToLs,
  removeDataFromLS,
  LS_KEYS,
} from './js/local-storage-api.js';
import { getImagesByQuery } from './js/pixabay-api';
import {
  clearGallery,
  createGallery,
  showLoader,
  hideLoader,
} from './js/render-functions.js';
import errorIcon from './img/icons/toast-error-icon.svg';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import debounce from 'debounce';

const refs = {
  galleryFormEl: document.querySelector('.js-gallery-form'),
  submitBtnEl: document.querySelector('.js-gallery-form .js-submit-btn'),
};

const initialFormData = { 'search-text': '' };
let formData = { ...initialFormData };

initFormState();

refs.galleryFormEl.addEventListener('input', debounce(handleFormElInput, 300));
refs.galleryFormEl.addEventListener('submit', handleFormElSubmit);

//!======================================================
function handleFormElInput(e) {
  const { name, value } = e.target;

  if (!(name in formData)) {
    updateSubmitState();
    return;
  }

  formData[name] = value;
  setDataToLs(LS_KEYS.form, formData);
  updateSubmitState();
}

function handleFormElSubmit(e) {
  e.preventDefault();

  const trimmedFormData = trimFormData(formData);

  if (!isFormValid(trimmedFormData)) {
    updateSubmitState();
    return;
  }
  formData = trimmedFormData;
  setDataToLs(LS_KEYS.form, formData);

  const { 'search-text': searchText } = formData;
  searchAndRenderGallery(searchText);

  resetForm();
}

function searchAndRenderGallery(searchText) {
  clearGallery();
  showLoader();

  getImagesByQuery(searchText)
    .then(data => {
      if (isEmptyHits(data)) {
        showErrorMessage(
          'Sorry, there are no images matching your search query.Please try again!'
        );
        return;
      }
      createGallery(data.hits);
    })
    .catch(error => {
      console.error(error);
      showErrorMessage(
        error.message || 'Something went wrong. Please try again.'
      );
    })
    .finally(() => hideLoader());
}
//!======================================================

function initFormState() {
  const savedFormData = getDataFromLS(LS_KEYS.form);

  try {
    if (savedFormData && typeof savedFormData === 'object') {
      Object.keys(formData).forEach(key => {
        formData[key] = savedFormData[key] || '';
      });

      const searchTextInputEl = refs.galleryFormEl.elements['search-text'];

      if (searchTextInputEl) {
        searchTextInputEl.value = formData['search-text'];
        updateSubmitState();
      }
    }
  } catch (error) {
    console.warn('Failed to parse LS or restore form state', error);
  }
}

function isFormValid(data = formData) {
  const searchText = data['search-text']?.trim() ?? '';
  return searchText.length > 0;
}

function trimFormData(formDataObj) {
  return Object.fromEntries(
    Object.entries(formDataObj).map(([key, value]) => [key, value.trim()])
  );
}

function resetForm() {
  refs.galleryFormEl.reset();
  formData = { ...initialFormData };
  removeDataFromLS(LS_KEYS.form);
  updateSubmitState();
}

function updateSubmitState() {
  refs.submitBtnEl.disabled = !isFormValid();
}

//!======================================================
export function showErrorMessage(text) {
  iziToast.show({
    icon: errorIcon,
    message: text,
    titleColor: '#fff',
    position: 'topRight',
    class: `custom-error-toast`,
    timeout: 3000,
  });
}

function isEmptyHits(data) {
  return Array.isArray(data?.hits) && data.hits.length === 0;
}
