import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import '../css/simplelightbox-custom.css';

const refs = {
  galleryEl: document.querySelector('.js-gallery'),
  loaderEl: document.querySelector('.js-loader'),
};

//!======================================================
const lightbox = new SimpleLightbox('.js-gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

let prevIndex = 0;

lightbox.on('show.simplelightbox', () => {
  prevIndex = lightbox.currentImageIndex || 0;
});

lightbox.on('changed.simplelightbox', () => {
  const currentIndex = lightbox.currentImageIndex || 0;

  const imageEl = document.querySelector('.sl-image img');
  if (!imageEl) return;

  imageEl.classList.remove('slide-in-left', 'slide-in-right');

  const direction =
    currentIndex > prevIndex ? 'slide-in-right' : 'slide-in-left';

  setTimeout(() => {
    imageEl.classList.add(direction);
  }, 30);
  prevIndex = currentIndex;
});

//!======================================================

const galleryItemTemplate = item => {
  const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = item;
  return `<li class="gallery-item">
              <a class="gallery-link" href="${largeImageURL}">
                <img
                  class="gallery-image"
                  src="${webformatURL}"
                  alt="${tags}"
                  width="200"
                />
                <div class="gallery-item-text-container">
                  <ul class="gallery-item-params-list">
                    <li class="gallery-item-param">
                      <h2 class="gallery-item-param-title">Likes</h2>
                      <p class="gallery-item-param-value">${likes}</p>
                    </li>
                    <li class="gallery-item-param">
                      <h2 class="gallery-item-param-title">Views</h2>
                      <p class="gallery-item-param-value">${views}</p>
                    </li>
                    <li class="gallery-item-param">
                      <h2 class="gallery-item-param-title">Comments</h2>
                      <p class="gallery-item-param-value">${comments}</p>
                    </li>
                    <li class="gallery-item-param">
                      <h2 class="gallery-item-param-title">Downloads</h2>
                      <p class="gallery-item-param-value">${downloads}</p>
                    </li>
                  </ul>
                </div>
             </a>
          </li>`;
};

const galleryItemsTemplate = items => items.map(galleryItemTemplate).join('\n');

export const createGallery = images => {
  const markup = galleryItemsTemplate(images);
  refs.galleryEl.innerHTML = markup;
  lightbox.refresh();
};

export const clearGallery = () => {
  refs.galleryEl.innerHTML = '';
};

export const showLoader = () => {
  refs.loaderEl.classList.add('visible');
};

export const hideLoader = () => {
  refs.loaderEl.classList.remove('visible');
};
