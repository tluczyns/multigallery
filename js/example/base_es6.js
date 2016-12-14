var trace = console.log.bind(console);
let nameClassBase = (function() {
class nameClassBase {
	constructor() {
	    /*(function():void {
				trace("static constructor");
        })();*/
		this.types = new class nameTypes {
			constructor() {
				this.Abstract = class nameAbstract {
					constructor() {
						//throw new TypeError("Cannot construct object");
					}
				}
				
				this.Singleton = class nameSingleton {
					static instance() {
						return this;
					}
					constructor() {
						if (!Singleton.instance) Singleton.instance = this;
						else throw new TypeError("cannot construct object");
					}
				}
			}
		}
		
		this.math = new class nameMath {
			constructor() {
				const toRadians = Math.PI / 180;
				const toDegrees = 180 / Math.PI;
				this.MathExt = class nameMathExt {
					static get TO_RADIANS() {return toRadians;}
					static get TO_DEGREES() {return toDegrees;}
					static hypotenuse(leg1, leg2) {
						return Math.pow(Math.pow(leg1, 2) + Math.pow(leg2, 2), 0.5);
					}
				}
			}
		}
	}
};
return nameClassBase;
})();

//var base = new nameClassBase();

export {nameClassBase as base};