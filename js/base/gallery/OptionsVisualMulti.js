import TweenLite from "gsap";

export default class OptionsVisualMulti {

	constructor(isDepthManagement = true, isAlphaManagement = true, timeMoveOneRenderable = 0.7, easeMoveRenderables = Cubic.easeInOut) {
		this.isDepthManagement = isDepthManagement;
		this.isAlphaManagement = isAlphaManagement;
		this.timeMoveOneRenderable = timeMoveOneRenderable;
		this.easeMoveRenderables = easeMoveRenderables;
	}
	
}