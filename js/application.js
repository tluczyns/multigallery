import MultiFlowGallery from 'base/gallery/MultiFlowGallery.js'
import MultiCircleGallery from 'base/gallery/MultiCircleGallery.js'
import OptionsControllerMulti from 'base/gallery/OptionsControllerMulti.js'
import $ from 'jquery'

class Application extends MultiFlowGallery {
	constructor() {
		const arrData = [[{id : 0, color: 0xff3300}, {id: 1, color: 0xff3333}, {id: 2, color: 0xff3366}, {id: 3, color: 0xff3399}, {id: 4, color: 0xff33cc}, {id: 5, color: 0xff33ff}], [{id: 6, color: 0x0099cc}, {id: 7, color: 0x009999}, {id: 8, color: 0x009966}, {id: 9, color: 0x009933}], [{id: 10, color: 0x666666}, {id: 11, color: 0x999999}, {id: 12, color: 0xcccccc}], [{id: 13, color: 0xff9900}, {id: 14, color: 0xffcc00}]];
		//const arrData = [[{id : 0, color: 0xff3300}], [{id: 1, color: 0x0099cc}]];
		//const arrData = [[0xff3300, 0xff3333, 0xff3366, 0xff3399, 0xff33cc, 0xff33ff], [0x0099cc, 0x009999, 0x009966, 0x009933], [0x666666, 0x999999, 0xcccccc], [0xff9900, 0xffcc00]];
		super("portfolio",  arrData, new OptionsControllerMulti(1, true, true, false));
		$(window).resize(this.onWindowResize);
		this.onWindowResize();
	}
	
	onWindowResize() {
	}
	
}

$(document).ready(function() {
	var application = new Application();
});