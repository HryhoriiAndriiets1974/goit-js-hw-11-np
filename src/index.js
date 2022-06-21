// import './sass/main.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

// // Описаний в документації
// import SimpleLightbox from "./index.js";
// // Додатковий імпорт стилів
// import "simplelightbox/dist/simple-lightbox.min.css";

import SimpleLightbox from "simplelightbox";
// import SimpleLightbox from "simplelightbox/dist/simple-lightbox.esm"
import "simplelightbox/dist/simple-lightbox.min.css";

import getRefs from './js/refs';
import ImgApiService from './js/img-service';
import { createPhotoMarkup } from './js/img-cards';

const axios = require('axios');
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: "alt",
  captionDelay: 1000,
});

let stopScroll = true;
let onClickSearch = false;
const refs = getRefs();
const imgApiService = new ImgApiService();

refs.searchForm.addEventListener('submit', onSearch);
// refs.loadMore.addEventListener('click', onScroll);
refs.upBtn.addEventListener('click', onUpBtn);

function onSearch(e) {
  // i++; console.log(`Counter = ${i} -----------------`);
  // j++; console.log('onSearch =', j);
  e.preventDefault();
  clearImgGallary();
  imgApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  imgApiService.resetPage();

  if (!imgApiService.query) {
    return Notify.warning('Sorry, there are no images matching your search query. Please try again.')
  }

  imgApiService.fetchImg()
  .then(({hits, totalHits}) => {
    if (totalHits === 0) {
      return Notify.warning('Sorry, there are no images matching your search query. Please try again.')
    }
    Notify.info(`Hooray! We found ${totalHits} images.`);
    appendCardMarkup(hits);
    lightbox.refresh();
    // smoothlyScroll();
  });
  onClickSearch = true;
  // k = 0;
}

function onScroll(e) {

  // i++; console.log(`Counter = ${i} -----------------`);
  // k++; console.log('onScroll =', k);

  imgApiService.fetchImg()
    .then(({hits, totalHits}) => {

        if (imgApiService.page > Math.ceil(totalHits / imgApiService.per_page)) {
        stopScroll = false;
        // console.log('erd', imgApiService.page);
        return Notify.warning("We're sorry, but you've reached the end of search results.");
      }

      if (hits.length < imgApiService.per_page) {
        Notify.warning("We're sorry, but you've reached the end of search results.");
       }
    refs.upBtn.classList.remove('js-hidden');
    appendCardMarkup(hits);
    lightbox.refresh();
    smoothlyScroll();
    })
    .catch(error => {
      console.log(error);
    })
    // j = 0;
  }



function appendCardMarkup (data) {
  const markup = data.map(photo => createPhotoMarkup(photo)).join('');
refs.imgGallery.insertAdjacentHTML('beforeend', markup);


      // ----- 3
        // TODO: observer logic
        const lastCards = document.querySelector('.photo-card:last-child');

        if (lastCards) {
          io.observe(lastCards);
        }
}

function clearImgGallary() {
  refs.imgGallery.innerHTML = "";
  refs.upBtn.classList.add('js-hidden');
  stopScroll = true;
  // onClickSearch = true;
}

function smoothlyScroll() {
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
};

function onUpBtn() {
  if (window.pageYOffset > 0) {
    window.scrollBy(0, -40);
    setTimeout(onUpBtn, 0);
  }
}


const io = new IntersectionObserver(
  ([entry], observer) => {
    //  console.log(entry);
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      onScroll();
    }
  },
    {
    root: null,
    rootMargins: "100px",
    threshold: 0,
    }
  );
