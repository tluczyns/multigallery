var trace = console.log.bind(console);

String.prototype.toLowerFirst = function() {
    return this.charAt(0).toLowerCase() + this.slice(1);
}

Function.prototype.inheritsFrom = function (parentClassOrObject) {
	if (parentClassOrObject.constructor == Function) { 
		//Normal Inheritance 
		//this.prototype = new parentClassOrObject;
		trace("parentClassOrObject.prototype:" , Object.create(parentClassOrObject.prototype), new parentClassOrObject)
		this.prototype = Object.create(parentClassOrObject.prototype);
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject.prototype;
	} else { 
		//Pure Virtual Inheritance 
		this.prototype = parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject;
	} 
	return this;
}
//

/**********package base**********/

this.base = new function() {

	/******** package math ********/
	
	var math = new function() {
		
		var MathExt = function() {}
		MathExt.TO_RADIANS = Math.PI / 180;
		MathExt.TO_DEGREES = 180 / Math.PI;
		MathExt.hypotenuse = function(leg1, leg2) {
			return Math.pow(Math.pow(leg1, 2) + Math.pow(leg2, 2), 0.5);
		}
	
		return {
			MathExt: MathExt
		}
	}
	
	/** class ClassWithDomObject **/
	
	var ClassWithDomObject = function() {
		/*try {a.b} catch (e) {
			alert (e.stack || e.line)
		}*/
		//if (arguments.callee.caller) {
			this.strSubclass = this.constructor.toString(); //arguments.callee.caller.toString();
			this.strSubclass = this.strSubclass.substring(9, this.strSubclass.indexOf("()", 9)).toLowerFirst();
			this.domObject = document.getElementById(this.strSubclass);
		//}
	}
	
	//ClassWithDomObject.createCanvas(width, height)
	
	return {
		math: math,
		ClassWithDomObject: ClassWithDomObject
	}

}




// base class
class A {  
  foo() {
    console.log(`from A -> inside instance of A: ${this instanceof A}`);
  }
}

// B mixin, will need a wrapper over it to be used
const B = (B) => class extends B {
  foo() {
    if (super.foo) super.foo(); // mixins don't know who is super, guard against not having the method
    console.log(`from B -> inside instance of B: ${this instanceof B}`);
  }
};

// C mixin, will need a wrapper over it to be used
const C = (C) => class extends C {
  foo() {
    if (super.foo) super.foo(); // mixins don't know who is super, guard against not having the method
    console.log(`from C -> inside instance of C: ${this instanceof C}`);
  }
};

// D class, extends A, B and C, preserving composition and super method
class D extends C(B(A)) {  
  foo() {
    super.foo();
    console.log(`from D -> inside instance of D: ${this instanceof D}`);
  }
}

// E class, extends A and C
class E extends C(A) {
  foo() {
    super.foo();
    console.log(`from E -> inside instance of E: ${this instanceof E}`);
  }
}

// F class, extends B only
class F extends B(Object) {
  foo() {
    super.foo();
    console.log(`from F -> inside instance of F: ${this instanceof F}`);
  }
}

// G class, C wrap to be used with new decorator, pretty format
class G extends C(Object) {}

const inst1 = new D(),
      inst2 = new E(),
      inst3 = new F(),
      inst4 = new G(),
      inst5 = new (B(Object)); // instance only B, ugly format

console.log(`Test D: extends A, B, C -> outside instance of D: ${inst1 instanceof D}`);
inst1.foo();
console.log('-');
console.log(`Test E: extends A, C -> outside instance of E: ${inst2 instanceof E}`);
inst2.foo();
console.log('-');
console.log(`Test F: extends B -> outside instance of F: ${inst3 instanceof F}`);
inst3.foo();
console.log('-');
console.log(`Test G: wraper to use C alone with "new" decorator, pretty format -> outside instance of G: ${inst4 instanceof G}`);
inst4.foo();
console.log('-');
console.log(`Test B alone, ugly format "new (B(Object))" -> outside instance of B: ${inst5 instanceof B}, this one fails`);
inst5.foo();