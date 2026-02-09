import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AUTH_TOKEN } from 'constants/AuthConstant';
import FirebaseService from 'services/FirebaseService';
import AuthService from 'services/AuthService';

export const initialState = {
	loading: false,
	message: '',
	showMessage: false,
	redirect: '',
	token: localStorage.getItem(AUTH_TOKEN) || null,
	user: null,
}

export const signIn = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
	const { email, password } = data;
	try {
		const response = await AuthService.login({ email, password });
		const token = response.token;
		const user = response.user;
		localStorage.setItem(AUTH_TOKEN, token);
		return { token, user };
	} catch (err) {
		const msg = err.response?.data?.errors?.email?.[0] || err.response?.data?.message || 'Error';
		return rejectWithValue(msg);
	}
});

export const signUp = createAsyncThunk('auth/register',async (data, { rejectWithValue }) => {
	const { email, password } = data
	try {
		const response = await AuthService.register({email, password})
		const token = response.data.token;
		localStorage.setItem(AUTH_TOKEN, token);
		return token;
	} catch (err) {
		return rejectWithValue(err.response?.data?.message || 'Error')
	}
})

export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
	try {
		const user = await AuthService.getUser();
		return user;
	} catch (err) {
		return rejectWithValue(err);
	}
});

export const signOut = createAsyncThunk('auth/logout', async () => {
	try {
		await AuthService.logout();
	} catch (e) {}
	localStorage.removeItem(AUTH_TOKEN);
	return null;
});

export const signInWithGoogle = createAsyncThunk('auth/signInWithGoogle', async (_, { rejectWithValue }) => {
    try {
		const response = await AuthService.loginInOAuth()
		const token = response.data.token;
		localStorage.setItem(AUTH_TOKEN, token);
		return token;
	} catch (err) {
		return rejectWithValue(err.response?.data?.message || 'Error')
	}
})

export const signInWithFacebook = createAsyncThunk('auth/signInWithFacebook', async (_, { rejectWithValue }) => {
    try {
		const response = await AuthService.loginInOAuth()
		const token = response.data.token;
		localStorage.setItem(AUTH_TOKEN, token);
		return token;
	} catch (err) {
		return rejectWithValue(err.response?.data?.message || 'Error')
	}
})


export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		authenticated: (state, action) => {
			state.loading = false
			state.redirect = '/'
			state.token = action.payload
		},
		showAuthMessage: (state, action) => {
			state.message = action.payload
			state.showMessage = true
			state.loading = false
		},
		hideAuthMessage: (state) => {
			state.message = ''
			state.showMessage = false
		},
		signOutSuccess: (state) => {
			state.loading = false
			state.token = null
			state.user = null
			state.redirect = '/'
		},
		setUser: (state, action) => {
			state.user = action.payload;
		},
		showLoading: (state) => {
			state.loading = true
		},
		signInSuccess: (state, action) => {
			state.loading = false
			state.token = action.payload
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(signIn.pending, (state) => {
				state.loading = true
			})
			.addCase(signIn.fulfilled, (state, action) => {
				state.loading = false
				state.redirect = '/'
				state.token = action.payload.token
				if (action.payload.user) state.user = action.payload.user
			})
			.addCase(signIn.rejected, (state, action) => {
				state.message = action.payload
				state.showMessage = true
				state.loading = false
			})
			.addCase(loadUser.fulfilled, (state, action) => {
				state.user = action.payload
			})
			.addCase(loadUser.rejected, (state) => {
				state.user = null
			})
			.addCase(signOut.fulfilled, (state) => {
				state.loading = false
				state.token = null
				state.user = null
				state.redirect = '/'
			})
			.addCase(signOut.rejected, (state) => {
				state.loading = false
				state.token = null
				state.user = null
				state.redirect = '/'
			})
			.addCase(signUp.pending, (state) => {
				state.loading = true
			})
			.addCase(signUp.fulfilled, (state, action) => {
				state.loading = false
				state.redirect = '/'
				state.token = action.payload
			})
			.addCase(signUp.rejected, (state, action) => {
				state.message = action.payload
				state.showMessage = true
				state.loading = false
			})
			.addCase(signInWithGoogle.pending, (state) => {
				state.loading = true
			})
			.addCase(signInWithGoogle.fulfilled, (state, action) => {
				state.loading = false
				state.redirect = '/'
				state.token = action.payload
			})
			.addCase(signInWithGoogle.rejected, (state, action) => {
				state.message = action.payload
				state.showMessage = true
				state.loading = false
			})
			.addCase(signInWithFacebook.pending, (state) => {
				state.loading = true
			})
			.addCase(signInWithFacebook.fulfilled, (state, action) => {
				state.loading = false
				state.redirect = '/'
				state.token = action.payload
			})
			.addCase(signInWithFacebook.rejected, (state, action) => {
				state.message = action.payload
				state.showMessage = true
				state.loading = false
			})
	},
})

export const {
	authenticated,
	showAuthMessage,
	hideAuthMessage,
	signOutSuccess,
	showLoading,
	signInSuccess,
	setUser,
} = authSlice.actions;

export default authSlice.reducer