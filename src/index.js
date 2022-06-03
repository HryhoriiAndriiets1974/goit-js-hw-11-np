import './sass/main.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import getRefs from './js/refs';
import ImgApiService from './js/img-service';
// import imgCard from'./templates/img-card.hbs'; parcel v2.0.0 - error
import { createPhotoMarkup } from './templates/img-card.js';
// Описаний в документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";

// var lightbox = new SimpleLightbox('.gallery a', { /* options */ });
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: "alt",
  captionDelay: 1000,
});

// -------------------------- counters
// let i = 0;
// let j = 0;
// let k = 0;
// ------------------------------------------
let stopScroll = true;
let onClickSearch = false;
const refs = getRefs();
const imgApiService = new ImgApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMore.addEventListener('click', onScroll);
refs.upBtn.addEventListener('click', onUpBtn);

// ===================================== error scroll 1/2
// document.addEventListener('DOMContentLoaded', infinitiScroll);

// ========================================== bed old 1/2
// window.addEventListener('scroll', infinitiScroll);

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


// =============================================== bed old 2/2
// function infinitiScroll() {
//     console.log(window.scrollY + window.innerHeight +1 - document.documentElement.scrollHeight);
//   if(window.scrollY + window.innerHeight + 1 >=
//   document.documentElement.scrollHeight && stopScroll) {
//     onScroll();
//   }};

// ============================================== error scroll 2/2
//   function infinitiScroll() {
//   let options = {
//     root: null,
//     rootMargins: "0px",
//     threshold: 0,
//   };
//   const observer = new IntersectionObserver(handleIntersect, options);
//   observer.observe(document.querySelector(".footer"));
//   //an initial load of some data
//   if (!onClickSearch) return;
//   onScroll();
// };

// function handleIntersect(entries) {
//   if (entries[0].isIntersecting) {
//     // console.warn("something is intersecting with the viewport"); && stopScroll
//     if (!onClickSearch) return;
//     onScroll();
//   }
// }


// ----- attempt -3
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
