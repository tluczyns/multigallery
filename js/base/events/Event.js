let Event = (() => {
	let _data = Symbol();
	
	class Event {
		
		static get COMPLETE() {return "complete";}
		
		constructor(type, data = {}, bubbles = false) {
			this.type = type;
			this.bubbles = bubbles;
			this[_data] = data;
			/*for (prop of data) {
				this[prop] = data[prop];
			}*/
			this.target;
		}
		
		get data() {
			return this[_data];
		}
		
	}
	
	return Event;
})();

export default Event;