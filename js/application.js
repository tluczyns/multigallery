import MultiFlowGallery from 'base/gallery/MultiFlowGallery.js'
import MultiCircleGallery from 'base/gallery/MultiCircleGallery.js'
import OptionsControllerMulti from 'base/gallery/OptionsControllerMulti.js'
import $ from 'jquery'

class Application extends MultiFlowGallery {
	constructor() {
		super("portfolio", new OptionsControllerMulti(1, true, true, false));
		$(window).resize(this.onWindowResize);
		this.onWindowResize();
	}
	
	onWindowResize() {
	}
	
}

$(document).ready(function() {
	var application = new Application();
});