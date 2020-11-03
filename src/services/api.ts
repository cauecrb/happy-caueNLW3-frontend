import axios from 'axios';

const api = axios.create({
    baseURL: 'https://happy-caue.herokuapp.com',
})
 
export default api;