import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '51672284-48fde91a1596d0a82418a0c9e';

export const getImagesByQuery = query => {
  const data = axios
    .get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    })
    .then(res => res.data)
    .catch(error => {
      throw error;
    });

  return data;
};
