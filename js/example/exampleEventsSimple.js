import EventDispatcher from 'base/events/EventDispatcher.js'
import EventData from 'base/events/EventData.js'

class Car extends EventDispatcher {
	drive() {
		this.dispatchEvent( { type: 'start', message: 'vroom vroom!' } );
		this.dispatchEvent( new EventData('start', {message: 'vrooooom!'}));
		this.dispatchEvent( { type: 'end', message: 'psss!' } );
	}
}

var car = new Car();
var callback = function (event) {
	console.log("callback", event);
}

car.addEventListener('start', callback);
car.drive();
car.removeEventListener('start', callback);
car.addEventListener('end', callback);
car.drive();