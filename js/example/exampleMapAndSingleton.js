import {aggregation} from 'base/Globals.js'
import Singleton from 'base/types/Singleton.js';
import Abstract from 'base/types/Abstract.js';


class MapCssStyleDeclarationA extends aggregation(Map, Singleton) {
	
	get(key) {
		return super.get(key)
	}
	
}

let MapCssStyleDeclarationB = (() => {
	
	let _map = new Map();
	
	class MapCssStyleDeclaration extends Abstract {
		
		static get(key) {
			return _map.get(key);
		}
		
		static set(key, value) {
			_map.set(key, value);
		}
	}
	
	return MapCssStyleDeclaration;
})();


let mapA1 = new MapCssStyleDeclarationA();
console.log(mapA1);
mapA1.set("a", 4);
console.log(mapA1.get("a"))


MapCssStyleDeclarationB.set("c", 7);
console.log(MapCssStyleDeclarationB.get("c"));

var mapB1 = new MapCssStyleDeclarationB(); //error
var mapA2 = new MapCssStyleDeclarationA(); //error