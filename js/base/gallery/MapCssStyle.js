import Abstract from 'base/types/Abstract.js';

let MapCssStyle = (() => {
	
	let _map = new Map();
	
	class MapCssStyle extends Abstract {
		
		static get(key) {
			return _map.get(key);
		}
		
		static set(key, value) {
			_map.set(key, value);
		}
	}
	MapCssStyle.arrSuffixNameStyle = ["start", "middle", "end"];
	MapCssStyle.arrSuffixNameStyle = [{fractionOnset: 0, name: "start"}, {fractionOnset: "numSelected", name: "middle"}, {fractionOnset: 1, name: "end"}];
	
	return MapCssStyle;
})();


export default MapCssStyle;