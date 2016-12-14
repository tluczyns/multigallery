import EventReceiverDispatcher, {EventDispatcher, EventReceiver} from 'base/events/EventReceiverDispatcher.js'
//import EventDispatcher from 'base/events/EventDispatcher.js'
import Event from 'base/events/Event.js'

class Car extends EventDispatcher { //EventReceiverDispatcher //base/events/EventDispatcher
	drive() {
		this.dispatchEvent( { type: 'start', message: 'vroom vroom!' } );
		this.dispatchEvent( new Event('start', {message: 'vrooooom!'}));
		this.dispatchEvent( { type: 'end', message: 'psss!' } );
	}
}

class CallbacksInherited extends EventReceiver { //EventReceiverDispatcher //base/events/EventDispatcher
	constructor() {
		super();
		this.varInherited = "value varInherited";
		this.callbackInheritedInline = function(event) {
			console.log("callbackInheritedInline", this, event);
		}
	}
	callbackInherited(event) {
		console.log("callbackInherited", this, event);
	}
	static callbackInheritedStatic(event) {
		console.log("callbackInheritedStatic", this.varStaticInherited, event);
	}
}
CallbacksInherited.varStaticInherited = "value CallbacksInherited.varStaticInherited";

class Callbacks extends CallbacksInherited {
	constructor() {
		super();
		this.callbackInline = function(event) {
			console.log("callbackInline", this, event);
		}
	}
	callback1(event) {
		console.log("callback1", this, event);
	}
	callback2(event) {
		console.log("callback2", this, event);
	}
	callback3(event) {
		console.log("callback3", this, event);
	}
	static callbackStatic(event) {
		console.log("callbackStatic", this.varStatic, event);
	}
}
Callbacks.varStatic = "value Callbacks.varStatic";

let car = new Car();
let cbs = new Callbacks();

car.addEventListener('start', cbs.callback1);
car.addEventListener('start', cbs.callback2);
car.addEventListener('start', cbs.callback2, 100);
car.addEventListener('start', cbs.callback2, 200);
car.addEventListener('start', cbs.callbackInherited);
car.addEventListener('start', cbs.callbackInline);
car.addEventListener('start', cbs.callbackInheritedInline);
car.addEventListener('start', Callbacks.callbackStatic);
car.addEventListener('start', CallbacksInherited.callbackInheritedStatic);
car.addEventListener('end', cbs.callback1);
car.addEventListener('end', cbs.callback2);
car.drive();

console.log('tests hasEventListener');
console.log(car.hasEventListener('start')); //true
console.log(car.hasEventListener('start', cbs.callback1)); //true
console.log(car.hasEventListener('start', cbs.callback1, 0)); //true
console.log(car.hasEventListener('start', cbs.callback1, 100)); //false
console.log(car.hasEventListener('start', cbs.callback2)); //true
console.log(car.hasEventListener('start', cbs.callback2, 100)); //true
console.log(car.hasEventListener('start', cbs.callback3)); //false
console.log(car.hasEventListener('foo')); //false

console.log('tests removeEventListener');
console.log(car.removeEventListener('start', cbs.callback1, 100)); //false
car.dispatchEvent({type: 'start', message: 'test removeEventListener(start, cbs.callback1, 100)'});
console.log(car.removeEventListener('start', cbs.callback1)); //true
car.dispatchEvent({type: 'start', message: 'test removeEventListener(start, cbs.callback1)'});
console.log(car.removeEventListener('start', undefined, 100)); //true
car.dispatchEvent({type: 'start', message: 'test removeEventListener(start, undefined, 100)'});
console.log(car.removeEventListener('start', cbs.callback2)); //true
console.log(car.removeEventListener('start', cbs.callback3)); //false
console.log(car.removeEventListener('start')); //true
car.dispatchEvent({type: 'start', message: 'test removeEventListener(start, cbs.callback2)'});
car.dispatchEvent({type: 'end', message: 'test end callbacks'});
console.log(car.removeEventListener('end')); //true
console.log(car.removeEventListener('end')); //false
car.dispatchEvent({type: 'end', message: 'test removeEventListener(end)'});