export const updateObject = (oldObject, updatedProperties) => {
	return {
		...oldObject,
		...updatedProperties
	};
};

export const checkValidity = (value, rules) => {
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
}