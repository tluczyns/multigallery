let EventDispatcherSimple = (() => {
	let _mapListener = Symbol();
	
	class EventDispatcherSimple {
		constructor() {
			this[_mapListener] = new Map();
		}
		addEventListener(type, listener) {
			const mapListener = this[_mapListener];
			if (mapListener.get(type) === undefined)
				mapListener.set(type, new Set());
			mapListener.get(type).add(listener);
		}
		hasEventListener(type, listener) {
			const setListener = this[_mapListener].get(type);
			return (setListener !== undefined && setListener.has(listener));
		}
		removeEventListener(type, listener) {
			const setListener = this[_mapListener].get(type);
			return (setListener !== undefined && setListener.delete(listener));
		}
		dispatchEvent(event) {
			const setListener = this[_mapListener].get(event.type);
			if (setListener !== undefined) {
				event.target = this;
				for (const listener of setListener)
					listener.call(this, event);
			}
		}
	}
	
	return EventDispatcherSimple;
})();

export default EventDispatcherSimple;