import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
	orders: [],
	loading: false,
	purchased: false
};

const purchasedInit = (state, action) => {
	return updateObject(state, { purchased: false });
}

const purchaseBurgerStart = (state, action) => {
	return updateObject(state, { loading: true });
}

const purchaseBurgerSuccess = (state, action) => {
	const newOrder = updateObject(action.orderData, { id: action.orderId });
	return {
		...state,
		loading: false,
		purchased: true,
		orders: state.orders.concat(newOrder)
	};
}

const purchaseBurgerFailed = (state, action) => {
	return updateObject(state, { loading: false });
}

const fetchOrderStart = (state, action) => {
	return updateObject(state, { loading: true });
}

const fetchOrderSuccess = (state, action) => {
	return updateObject(state, {
		loading: false,
		orders: action.orders
	});
}

const fetchOrderFailed = (state, action) => {
	return updateObject(state, { loading: false });
}

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.PURCHASE_INIT:
			return purchasedInit(state, action);
		case actionTypes.PURCHASE_BURGER_START:
			return purchaseBurgerStart(state, action);
		case actionTypes.PURCHASE_BURGER_SUCCESS:
			return purchaseBurgerSuccess(state, action);
		case actionTypes.PURCHASE_BURGER_FAILED:
			return purchaseBurgerFailed(state, action);
		case actionTypes.FETCH_ORDERS_START:
			return fetchOrderStart(state, action);
		case actionTypes.FETCH_ORDERS_SUCCESS:
			return fetchOrderSuccess(state, action);
		case actionTypes.FETCH_ORDERS_FAIL:
			return fetchOrderFailed(state, action);
		default:
			return state;
	}
}


/* export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.PURCHASE_INIT:
			return {
				...state,
				purchased: false,
			};
		case actionTypes.PURCHASE_BURGER_START:
			return {
				...state,
				loading: true
			};
		case actionTypes.PURCHASE_BURGER_SUCCESS:
			const newOrder = {
				...action.orderData,
				id: action.orderId
			};
			return {
				...state,
				loading: false,
				purchased: true,
				orders: state.orders.concat(newOrder)
			};
		case actionTypes.PURCHASE_BURGER_FAILED:
			return {
				...state,
				loading: false
			};
		case actionTypes.FETCH_ORDERS_START:
			return {
				...state,
				loading: true
			};
		case actionTypes.FETCH_ORDERS_SUCCESS:
			return {
				...state,
				loading: false,
				orders: action.orders
			};
		case actionTypes.FETCH_ORDERS_FAIL:
			return {
				...state,
				loading: false
			};
		default:
			return state;
	}
} */

export default reducer;