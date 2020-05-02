import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://burger-buider-75e7d.firebaseio.com/'
});

export default instance;