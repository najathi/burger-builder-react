import React, { Component } from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxiliary/Auxiliary';

const withErrorHandler = (WrappedComponent, axios) => {
	return class extends Component {

		state = {
			error: null
		}

		// componentDidMount - it will render after the child components
		// componentWillMount - it will render before the child components

		componentWillMount() {
			this.reqInterceptor = axios.interceptors.request.use(req => {
				this.setState({ error: null });
				return req;
			});
			this.resInterceptor = axios.interceptors.response.use(res => res, error => {
				this.setState({ error: error });
			});
		}

		componentWillUnmount() {
			// console.log('WillUnmount', this.reqInterceptor, this.resInterceptor);
			axios.interceptors.request.eject(this.reqInterceptor);
			axios.interceptors.request.eject(this.resInterceptor);
		}

		errorConfirmHandler = () => {
			this.setState({ error: null });
		}

		render() {
			return (
				<Aux>
					<Modal show={this.state.error} modelClosed={this.errorConfirmHandler}>
						{this.state.error ? this.state.error.message : null}
					</Modal>
					<WrappedComponent {...this.props} />
				</Aux >
			);
		}
	}
}

export default withErrorHandler;