import Event from 'base/events/Event.js'

class EventStateModel extends Event {

	static get START_CHANGE_SECTION() {return "startChangeSection";}
	static get CHANGE_SECTION() {return "changeSection";}
	static get CHANGE_CURR_SECTION() {return "changeCurrSection";}
	static get PARAMETERS_CHANGE() {return "parametersChange";}
		
	constructor(type, data = {}) {
		super(type, data);
	}
	
}

export default EventStateModel;