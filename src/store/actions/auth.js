import axios from 'axios';

import * as actionTypes from './actionTypes';

export const authStart = () => {
	return {
		type: actionTypes.AUTH_START
	};
}


/* In Firebase :
	localId: userId
	idToken: token
*/

export const authSuccess = (token, userId) => {
	return {
		type: actionTypes.AUTH_SUCCESS,
		idToken: token,
		userId: userId
	};
}

export const authFail = (error) => {
	return {
		type: actionTypes.AUTH_FAIL,
		error: error
	};
}

export const logout = () => {
	localStorage.removeItem('token');
	localStorage.removeItem('expirationData');
	localStorage.removeItem('userId');
	return {
		type: actionTypes.AUTH_LOGOUT
	};
}

export const checkAuthTimeout = (expirationTime) => {
	return dispatch => {
		setTimeout(() => {
			// logout function
			dispatch(logout());
		}, expirationTime * 1000);
	}
}

export const auth = (email, password, isSignUp) => {
	return dispatch => {
		dispatch(authStart());
		const authData = {
			email: email,
			password: password,
			returnSecureToken: true
		};
		let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCT9Ot0VVgExFqiPLhN8UjUpYTpz7EAnRo';
		if (!isSignUp) {
			url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCT9Ot0VVgExFqiPLhN8UjUpYTpz7EAnRo';
		}
		axios.post(url, authData)
			.then(response => {
				// console.log(response.data);
				// console.log(response.data.idToken);
				// console.log(response.data.localId);
				const expirationData = new Date(new Date().getTime() + response.data.expiresIn * 1000);
				localStorage.setItem('token', response.data.idToken);
				localStorage.setItem('expirationData', expirationData);
				localStorage.setItem('userId', response.data.localId);
				dispatch(authSuccess(response.data.idToken, response.data.localId));
				dispatch(checkAuthTimeout(response.data.expiresIn));
			})
			.catch(err => {
				console.log(err.response.data.error);
				dispatch(authFail(err.response.data.error));
			});
	};
}

export const setAuthRedirectPath = path => {
	return {
		type: actionTypes.SET_AUTH_REDIRECT_PATH,
		path: path
	};
}

export const authCheckState = () => {
	return dispatch => {
		const token = localStorage.getItem('token');
		if (!token) {
			dispatch(logout());
		} else {
			const expirationData = new Date(localStorage.getItem('expirationData')); // browser api will store as a string. So we need to convent data format
			if (expirationData <= new Date()) {
				dispatch(logout());
			} else {
				// you can also use firebase get user data, that needs to fetch from firebase auth. but i can store and use the browser api in localId as a userId and so on. So I get them it.s  
				const userId = localStorage.getItem('userId');
				dispatch(authSuccess(token, userId));
				dispatch(checkAuthTimeout((expirationData.getTime() - new Date().getTime()) / 1000));
			}
		}
	}
}