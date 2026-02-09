import axios from 'axios';
import { API_BASE_URL } from 'configs/AppConfig';
import { signOutSuccess } from 'store/slices/authSlice';
import store from '../store';
import { AUTH_TOKEN } from 'constants/AuthConstant';
import { notification } from 'antd';

const unauthorizedCode = [400, 401, 403];
let csrfToken = null;

const getCsrfToken = async () => {
  if (csrfToken) return csrfToken;
  const res = await axios.get(`${API_BASE_URL}/api/get-csrf`, { withCredentials: true });
  csrfToken = res.data;
  return csrfToken;
};

const service = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  withCredentials: true,
  headers: { Accept: 'application/json' },
});

const TOKEN_PAYLOAD_KEY = 'authorization';

// API Request interceptor
service.interceptors.request.use(async (config) => {
  const jwtToken = localStorage.getItem(AUTH_TOKEN) || null;
  if (jwtToken) {
    config.headers[TOKEN_PAYLOAD_KEY] = `Bearer ${jwtToken}`;
  }
  if (['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase())) {
    try {
      config.headers['X-CSRF-TOKEN'] = await getCsrfToken();
    } catch (e) {
      csrfToken = null;
    }
  }
  return config;
}, error => {
	// Do something with request error here
	notification.error({
		message: 'Error'
	})
	Promise.reject(error)
})

// API respone interceptor
service.interceptors.response.use( (response) => {
	return response.data
}, (error) => {

	let notificationParam = {
		message: ''
	}

	// Remove token and redirect 
	if (unauthorizedCode.includes(error.response.status)) {
		notificationParam.message = 'Authentication Fail'
		notificationParam.description = 'Please login again'
		localStorage.removeItem(AUTH_TOKEN)

		store.dispatch(signOutSuccess())
	}

	if (error.response.status === 404) {
		notificationParam.message = 'Not Found'
	}

	if (error.response.status === 500) {
		notificationParam.message = 'Internal Server Error'
	}
	
	if (error.response.status === 508) {
		notificationParam.message = 'Time Out'
	}

	notification.error(notificationParam)

	return Promise.reject(error);
});

export default service