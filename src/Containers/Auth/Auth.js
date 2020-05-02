import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.css';
import * as actionTypes from '../../store/actions/index';
import { updateObject, checkValidity } from '../../shared/utility';

class Auth extends Component {

	state = {
		controls: {
			email: {
				elementType: 'input',
				elementConfig: {
					type: 'email',
					placeholder: 'Mail Address'
				},
				value: '',
				validation: {
					required: true,
					isEmail: true
				},
				valid: false,
				touched: false
			},
			password: {
				elementType: 'input',
				elementConfig: {
					type: 'password',
					placeholder: 'Password'
				},
				value: '',
				validation: {
					required: true,
					minLength: 6
				},
				valid: false,
				touched: false
			}
		},
		isSignup: true
	}

	componentDidMount() {
		if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
			this.props.onSetAuthRedirectPath();
		}
	}

	/* checkValidity(value, rules) {
		let isValid = true;

		if (!rules) {
			return true;
		}

		const arr = ['apple', 'orange'];

		if (rules.required) {
			isValid = value.trim() !== '' && isValid;
		}

		if (rules.minLength) {
			isValid = value.length >= rules.minLength && isValid;
		}

		if (rules.filter) {
			isValid = arr.indexOf(value.trim()) === -1 && isValid;
		}

		return isValid;
	} */

	inputChangedHandler = (event, controlName) => {

		// ! method 2
		const updatedControls = updateObject(this.state.controls, {
			[controlName]: {
				...this.state.controls[controlName],
				value: event.target.value,
				valid: checkValidity(event.target.value, this.state.controls[controlName].validation),
				touched: true
			}
		});
		this.setState({ controls: updatedControls });

		// ! Method 1
		/* const updatedControls = {
			...this.state.controls,
			[controlName]: {
				...this.state.controls[controlName],
				value: event.target.value,
				valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
				touched: true
			}
		};
		console.log('updatedControls: ', updatedControls);
		this.setState({ controls: updatedControls }); */
	}

	submitHandler = (event) => {
		event.preventDefault(); // Default to prevent the reloading of the page. (Prevent the page reloading When submit the data)
		this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup);
	}

	switchAuthModeHandler = () => {
		this.setState(prevState => {
			return { isSignup: !prevState.isSignup }
		});
	}

	render() {
		const formElementArray = [];
		for (let key in this.state.controls) {
			formElementArray.push({
				id: key,
				config: this.state.controls[key]
			});
		}

		let form = (
			formElementArray.map(formElement => (
				<Input
					key={formElement.id}
					elementType={formElement.config.elementType}
					elementConfig={formElement.config.elementConfig}
					value={formElement.config.value}
					invalid={!formElement.config.valid}
					shouldValidate={formElement.config.validation}
					touched={formElement.config.touched}
					changed={(event) => this.inputChangedHandler(event, formElement.id)} />
			))
		);

		if (this.props.loading) {
			form = <Spinner />
		}

		let errorMessage = null;

		if (this.props.error) {
			errorMessage = (
				<p className={classes.alert}>{this.props.error.message}</p>
			);
		}

		let authRedirect = null;
		if (this.props.isAuthenticated) {
			authRedirect = <Redirect to={this.props.authRedirectPath} />
		}

		return (
			<div className={classes.Auth}>
				<h3>{this.state.isSignup ? 'Create an Account' : 'SIGN IN Account'}</h3>
				{authRedirect}
				{errorMessage}
				<form onSubmit={this.submitHandler}>
					{form}
					<Button btnType={this.state.isSignup ? 'Success' : 'Info'}>{this.state.isSignup ? 'SIGNUP' : 'SIGN IN'}</Button>
				</form>
				<Button btnType="Danger" clicked={this.switchAuthModeHandler}>SWITCH TO {this.state.isSignup ? 'SIGN IN' : 'SIGNUP'}</Button>
			</div>
		);
	}
}

const mapToStateToProps = state => {
	return {
		loading: state.auth.loading,
		error: state.auth.error,
		isAuthenticated: state.auth.token !== null,
		buildingBurger: state.burgerBuilder.building,
		authRedirectPath: state.auth.authRedirect
	};
}

const mapDispatchToProps = dispatch => {
	return {
		onAuth: (email, password, isSignUp) => dispatch(actionTypes.auth(email, password, isSignUp)),
		onSetAuthRedirectPath: () => dispatch(actionTypes.setAuthRedirectPath('/'))
	}
}

export default connect(mapToStateToProps, mapDispatchToProps)(Auth);