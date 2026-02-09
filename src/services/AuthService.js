import fetch from 'auth/FetchInterceptor'

const AuthService = {}

/** Поточний користувач (Laravel session) */
AuthService.getUser = function () {
	return fetch({
		url: '/api/user',
		method: 'get',
	})
}

/** Вихід (Laravel session) */
AuthService.logout = function () {
	return fetch({
		url: '/api/logout',
		method: 'get',
	})
}

/** URL для Google OAuth (редірект) */
AuthService.getGoogleAuthUrl = function () {
	return fetch({
		url: '/api/google-auth-url',
		method: 'get',
	})
}

/** Callback після Google — логін по code з query */
AuthService.loginWithGoogle = function (searchParams) {
	const query = searchParams?.toString?.() || ''
	return fetch({
		url: `/api/login-with-google${query ? '?' + query : ''}`,
		method: 'get',
	})
}

/** Логін по email/паролю. Повертає { token, user }. */
AuthService.login = function (data) {
	return fetch({
		url: '/api/login',
		method: 'post',
		data,
	})
}

AuthService.register = function (data) {
	return fetch({
		url: '/auth/register',
		method: 'post',
		data: data
	})
}

AuthService.loginInOAuth = function () {
	return fetch({
		url: '/auth/loginInOAuth',
		method: 'post'
	})
}

export default AuthService;