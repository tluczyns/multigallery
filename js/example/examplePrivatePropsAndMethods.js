var trace = console.log.bind(console);

let Person = (function () {
	let badPrivProp; 
	let symPrivProp = Symbol(); //faster
	let mapPrivProp = new WeakMap(); //slower
	let symPrivFunc = Symbol(); //faster
	let mapPrivFunc = new WeakMap(); //slower

	var privFunc = function() {
		var a = 4;
		var b = 5;
		return a + b;
		//trace("privFunc this:", this);
	}

	class Person {
		constructor(name, age) {
			badPrivProp = name;
			//var time = new Date().getTime();
			//for (var i = 0; i < 1000000; i++) {
			//	this[symPrivProp] = name; //faster for props of first object, slower for next objects, but still 8x faster than maps, memory usage ~40MB per 10 mln Person objects (314MB)
			//	mapPrivProp.set(this, {age: age}); //memory usage ~300MB per 10 mln Person objects (577 MB)
				this[symPrivFunc] = privFunc; //faster for methods of first object, slower for next objects (3x slower than maps), memory usage 0MB per 10 mln Person objects (274 MB)
				//mapPrivFunc.set(this, {privFunc: privFunc}); //memory usage ~300MB per 10 mln Person objects (577 MB)
			//}
			//trace(new Date().getTime() - time);
		}
		test() {
			//var time = new Date().getTime();
			//for (var i = 0; i < 1000000; i++) {
				//trace(`name: ${this[symPrivProp]}, ${badPrivProp}, age: ${mapPrivProp.get(this).age}`);
				//mapPrivFunc.get(this).privFunc.bind(this)(); //slowest
				this[symPrivFunc](); //fastest, memory usage of ~35MB per 10 mln Person objects (274 MB) - for symbols compared to nosymbols 
				//privFunc.bind(this)(); //slower, memory usage of 0MB (239MB) - nosymbols, only bindings
			//}
			//trace(new Date().getTime() - time);
		}
	}
	return Person;
})();
//239 vs 274 MB
let joe = new Person('Joe', 30);
let john = new Person('John', 40);
/*joe.test();
john.test();*/



let arrPerson = [];
for (var i = 0; i < 10000000; i++) {
	arrPerson.push(new Person('John', 40));
	arrPerson[i].test();
}