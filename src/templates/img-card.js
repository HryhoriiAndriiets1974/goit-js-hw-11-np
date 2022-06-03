function createPhotoMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
  <a class='gallery__item' href="${largeImageURL}">
  <img class='gallery__image' src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <i class="material-icons">favorite</i>
      ${likes}
    </p>
    <p class="info-item">
      <i class="material-icons">visibility</i>
      ${views}
    </p>
    <p class="info-item">
      <i class="material-icons">message</i>
      ${comments}
    </p>
    <p class="info-item">
      <i class="material-icons">file_download</i>
      ${downloads}
    </p>
  </div>
  </a>
</div>`
}

export { createPhotoMarkup };
