const API_KEY = '27420856-25c3041aa641ff2b15189544b';
const BASE_URL = 'https://pixabay.com/api/';
const axios = require('axios');

export default class ImgApiService {
  constructor() {
    this.searchQuery ='';
    this.page = 1;
    this.per_page = 40;
  }

  async fetchImg() {
    const searchParam = new URLSearchParams({
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientacion: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: this.per_page,
    })
    const url = `${BASE_URL}?${searchParam}`;

    try {
      const r = await axios.get(url);
      this.incrementPage();
      return r.data;
    }
    catch (error) {
      return error;
    }
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
