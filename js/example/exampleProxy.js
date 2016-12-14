function BinderInlineFunctions() {}
BinderInlineFunctions.prototype = new Proxy({}, {
	set: function(target, prop, value, receiver) {
		if (typeof value === 'function') 
			value = value.bind(receiver);
		Reflect.set(target, prop, value, receiver); //target[prop] = value;
		return true;
	}
});

class Proxied extends BinderInlineFunctions {
	constructor() {
		super();
		this.aaa = function() {
			console.log("aaa", this);	
		}
	}
	
}

let proxied = new Proxied()
proxied.bbb = function() {
	console.log("bbb", this);	
}
proxied.aaa();
proxied.bbb();