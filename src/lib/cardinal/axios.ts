import _axios from 'axios';

const axios = _axios.create({
  baseURL: process.env.CARDINAL_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});


export default axios;