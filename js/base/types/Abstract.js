export default class Abstract {
	constructor() {
		if ((new.target === Abstract) || (Object.getPrototypeOf(new.target) === Abstract))
			throw new TypeError("cannot construct object");
	}
}