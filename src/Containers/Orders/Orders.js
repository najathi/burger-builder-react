import React, { Component } from 'react';
import axios from '../../axios-orders';
import { connect } from 'react-redux';

import Order from '../../components/Order/Order';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actionTypes from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';

class Orders extends Component {

	state = {
		orders: [],
		loading: false
	}

	componentDidMount() {
		this.props.onFetchOrders(this.props.token, this.props.userId);
	}

	render() {

		let orders = <Spinner />;
		if (!this.props.loading) {
			orders = this.props.orders.map((order) => (
				<Order
					ingredients={order.ingredient}
					price={order.totalPrice}
					key={order.id} />
			));
		}

		return (
			<div>
				{orders}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		orders: state.order.orders,
		loading: state.order.loading,
		token: state.auth.token,
		userId: state.auth.userId
	};
}

const mapDispatchToProps = dispatch => {
	return {
		onFetchOrders: (token, userId) => dispatch(actionTypes.fetchOrders(token, userId))
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));