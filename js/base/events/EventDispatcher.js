let EventDispatcher = (() => {
	
	const _bindObjectMethodsToContext = function(obj, context) {
		Object.getOwnPropertyNames(obj)/*.concat(Object.getOwnPropertySymbols(obj))*/.forEach((prop) => {
			if ((typeof context[prop] === 'function') && ((typeof prop == "symbol") || (!prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/)))) {
				//console.log("bind", prop, context, (typeof prop === 'symbol') ? context[prop] : "");
				context[prop] = context[prop].bind(context);
			}
		})
	}
	
	const _bindAll = function() {
		let proto = this;
		while (proto != EventDispatcher.prototype) {
			_bindObjectMethodsToContext(proto, this);
			_bindObjectMethodsToContext(proto.constructor, proto.constructor);
			proto = Object.getPrototypeOf(proto);
		} 
	}
	
	const mapListenerAllByType = Symbol();
	const removeOrHasEventListener = Symbol();
	
	const _removeOrHasListenerFromOrInSet = function(isRemoveHas, setListenerPriority, listener = undefined, result) {
		const strDeleteHas = ["delete", "has"][isRemoveHas];
		if (listener == undefined) {
			result = setListenerPriority.size > 0 || result;
			if (isRemoveHas == 0) setListenerPriority.clear();
		} else result = setListenerPriority[strDeleteHas](listener) || result;
		return result;
	}
	
	const _removeOrHasEventListener = function(isRemoveHas, type, listener = undefined, priority = undefined) {
		const mapListenerTypeByPriority = this[mapListenerAllByType].get(type);
		priority = Number(priority);
		let result = false;
		if (mapListenerTypeByPriority !== undefined) {
			if (isNaN(priority)) {
				for (let setListenerPriority of mapListenerTypeByPriority.values())
					result = _removeOrHasListenerFromOrInSet(isRemoveHas, setListenerPriority, listener, result);
			} else {
				setListenerPriority = mapListenerTypeByPriority.get(priority);
				if (setListenerPriority !== undefined)
					result = _removeOrHasListenerFromOrInSet(isRemoveHas, setListenerPriority, listener, result);
			}
		}
		return result;
	}
	
	function BinderInlineFunctions() { }
	
	BinderInlineFunctions.prototype = new Proxy({}, {
		set: function(target, prop, value, receiver) {
			if (typeof value === 'function') {
				//console.log("set:", prop, receiver, (typeof prop === 'symbol') ? value : "");
				value = value.bind(receiver);
			}
			Reflect.set(target, prop, value, receiver); //target[prop] = value;
			return true;
		}
	});
	
	class EventDispatcher extends BinderInlineFunctions {
		
		constructor() {
			super();
			_bindAll.bind(this)();
			this[removeOrHasEventListener] = _removeOrHasEventListener;
			this[mapListenerAllByType] = new Map();
		}
		
		addEventListener(type, listener, priority = 0) {
			if (typeof listener === 'function') {
				priority = Number(priority);
				if (isNaN(priority)) priority = 0;
				let mapListenerTypeByPriority = this[mapListenerAllByType].get(type);
				if (mapListenerTypeByPriority === undefined) 
					mapListenerTypeByPriority = new Map();
				let setListenerPriority = mapListenerTypeByPriority.get(priority);
				if (setListenerPriority === undefined) 
					setListenerPriority = new Set();
				setListenerPriority.add(listener);
				mapListenerTypeByPriority.set(priority, setListenerPriority);
				const oldMapListenerTypeByPriority = mapListenerTypeByPriority;
				mapListenerTypeByPriority = new Map([...mapListenerTypeByPriority].sort(([prior1, arrLstn1], [prior2, arrLstn2]) => prior1 < prior2));
				oldMapListenerTypeByPriority.clear();
				this[mapListenerAllByType].set(type, mapListenerTypeByPriority);
			}
		}
		
		hasEventListener(type, listener = undefined, priority = undefined) {
			return this[removeOrHasEventListener](1, type, listener, priority);
		}
		
		removeEventListener(type, listener = undefined, priority = undefined) {
			return this[removeOrHasEventListener](0, type, listener, priority);
		}
		
		dispatchEvent(event) {
			const mapListenerTypeByPriority = this[mapListenerAllByType].get(event.type);
			if (mapListenerTypeByPriority !== undefined) {
				event.target = this;
				for (const [priority, setListenerPriority] of mapListenerTypeByPriority) {
					event.priority = priority;
					for (const listener of setListenerPriority)
						listener.call(null, event);
				}
			}
		}
		
	}
	
	return EventDispatcher;
})();

export default EventDispatcher;