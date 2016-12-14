let Singleton = (() => {
	let _instance = Symbol();
	
	class Singleton {
		constructor() {
			var classObject = new.target;
			if (!classObject[_instance]) classObject[_instance] = this;
			else throw new TypeError("cannot construct object");
		}
	}
	return Singleton;
})();

export default Singleton;