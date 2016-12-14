import 'gsap'

class TestGSAP {
	
	constructor() {
		this._timeControl = 0;
		TweenLite.to(this, 0, {timeControl: 100, ease: Elastic.easeOut, onUpdate: this.logTime.bind(this)});
	}

	logTime() {
		console.log("log timeControl: ", this.timeControl);
	}
	
	get timeControl() {
		return this._timeControl;
	}
	
	set timeControl(value) {
		console.log("set timeControl:", value);
		this._timeControl = value;
	}
	
}

const testGSAP = new TestGSAP();