import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

// add an order
export const purchaseBurgerSuccess = (id, orderData) => {
	return {
		type: actionTypes.PURCHASE_BURGER_SUCCESS,
		orderId: id,
		orderData: orderData
	};
}

export const purchaseBurgerFail = (error) => {
	return {
		type: actionTypes.PURCHASE_BURGER_FAILED,
		error: error
	};
}

export const purchaseBurgerStart = () => {
	return {
		type: actionTypes.PURCHASE_BURGER_START
	};
}

export const purchaseBurger = (orderData, token) => {
	return dispatch => {
		dispatch(purchaseBurgerStart());
		axios.post('/orders.json?auth=' + token, orderData)
			.then(response => {
				// console.log(response.data);
				dispatch(purchaseBurgerSuccess(response.data.name, orderData));
			})
			.catch(error => {
				dispatch(purchaseBurgerFail(error));
			});
	}
}

export const purchaseInit = () => {
	return {
		type: actionTypes.PURCHASE_INIT
	};
}

// Order fetch
export const fetchOrdersSuccess = (orders) => {
	return {
		type: actionTypes.FETCH_ORDERS_SUCCESS,
		orders: orders
	};
}

export const fetchOrdersFail = (error) => {
	return {
		type: actionTypes.FETCH_ORDERS_FAIL,
		error: error
	};
}

export const fetchOrdersStart = orders => {
	return {
		type: actionTypes.FETCH_ORDERS_START,
		orders: orders
	}
}

export const fetchOrders = (token, userId) => {
	return (dispatch) => {
		dispatch(fetchOrdersStart());
		/* you can two way to get the state,
		 * first way is getState() - getState().auth.token
		 * second way is passing through mapDispatchToProps
		 */
		const queryParams = '?auth=' + token + '&orderBy="userId"&equalTo="' + userId + '"';
		// axios.get('/orders.json?auth=' + token)
		axios.get('/orders.json' + queryParams)
			.then(response => {
				const fetchOrders = [];
				for (let key in response.data) {
					fetchOrders.push({
						...response.data[key],
						id: key
					});
				}
				dispatch(fetchOrdersSuccess(fetchOrders));
			})
			.catch(error => {
				dispatch(fetchOrdersFail())
			});
	}
}
