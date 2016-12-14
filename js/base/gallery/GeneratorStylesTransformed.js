import {getStyleFromClass} from 'base/dom/Helpers.js'
import TimelineMax from "gsap";
import TweenLite from "gsap";

class StyleTransformed {
	
	constructor(obj, name, fractionStartForRendering) {
		this.obj = obj;
		this.name = name;
		this.fractionStartForRendering = fractionStartForRendering;
	}
}

class ArrStyleTransformedForDimension extends Array {
	
	constructor() {
		super();
	}
	
	initTimelineElem(elemContainerItem, nameParamItem) {
		this.sort((styleTransformed1, styleTransformed2) => (styleTransformed1.fractionStartForRenderingStyle - styleTransformed2.fractionStartForRenderingStyle));	
		this.elemContainerItem = elemContainerItem;
		this.elem = document.createElement("div");
		this.elem.className = nameParamItem + " " + this[0].name;
		this.elemContainerItem.appendChild(this.elem);
		
		/*let arrTweenElem = this.reduce((arrTweenElem, styleTransformed, i) => {
			if (i > 0) arrTweenElem.push(new TweenLite(this.elem, styleTransformed.fractionStartForRendering - this[i - 1].fractionStartForRendering, {className: styleTransformed.name}));
			return arrTweenElem;
		}, []);*/
		//let arrTweenElem = this.map((styleTransformed) => new TweenLite(this.elem, styleTransformed.fractionStartForRendering, {className: styleTransformed.name}))
		this.timelineElem = new TimelineMax({/*tweens: arrTweenElem, */align: "sequence", paused: true});
		
		for (let i = 1; i < this.length; i++) {
			console.log("a", this[i].fractionStartForRendering - this[i - 1].fractionStartForRendering)
			this.timelineElem.add(TweenLite.to(this.elem, this[i].fractionStartForRendering - this[i - 1].fractionStartForRendering, {className: this[i].name}));
		}
		
		this.timelineElem.pause();
		console.log("this.timelineElem:", this.timelineElem)
		
		
		/*tl.add( TweenLite.to(element, 1, {left:100}) );
		 new TimelineMax({tweens: [
				new TweenMax(this.textToSay, Config.TIME_HIDE_SHOW, {alpha: 1, scaleX: 1, scaleY: 1, ease:Back.easeOut}),
				new TweenMax(this.btnNoMicrophone, Config.TIME_HIDE_SHOW, {alpha: 1, scaleX: 1, scaleY: 1, ease: Quart.easeOut})
			], align: TweenAlign.SEQUENCE, stagger: -0.07, paused: true, onComplete: this.startAfterShow, onReverseComplete: this.hideComplete});
		}
		TweenLite.to(myElement, 1, {className:"class2"});
		TweenLite.to(myElement, 1, {className:"+=class2"});
		TweenLite.set($obj, {css:{transform:"translateX(50px) rotate(30deg)"}});
		var tn = TweenLite.to(this.elem, time, {vars});
		tn.progress(0.5);*/

	}
	
}
	
export default class GeneratorStylesTransformed {

	constructor(elemContainerItem = document.body, nameParamItem = "ig_portfolio") {
		var strCssSelector = 
		[].reduce.call(document.styleSheets, (strCssSelector, styleSheet) => 
			strCssSelector + (styleSheet.cssRules ? [].slice.call(styleSheet.cssRules).reduce((strCssSelector, cssRule) =>
				strCssSelector + (cssRule instanceof CSSStyleRule ? cssRule.selectorText + ", " : "")
			, "") : "")
		, "");
		const regexNameStyleItemGallery = new RegExp("\." + nameParamItem + "_dimension_(\\d+)_([\\d\\w]+)", "g");
		this.objNumDimensionToArrStyleTransformed = [];
		let matchNameStyleItemGallery;
		/*function *genMatchNameStyleItemGallery(regexNameStyleItemGallery, strCssSelector) {
			let matchNameStyleItemGallery;
			while ((matchNameStyleItemGallery = regexNameStyleItemGallery.exec(strCssSelector)) != null)
				yield {numDimension: matchNameStyleItemGallery[1], suffixNameStyle: matchNameStyleItemGallery[2]};
		}
		this.objNumDimensionToArrStyleTransformed = {};
		for (let {numDimension, suffixNameStyle} of genMatchNameStyleItemGallery(regexNameStyleItemGallery, strCssSelector)) {
			if (!this.objNumDimensionToArrStyleTransformed[numDimension]) this.objNumDimensionToArrStyleTransformed[numDimension] = new Set();
			this.objNumDimensionToArrStyleTransformed[numDimension].add(suffixNameStyle); //suffix name of style;
		}*/
		const genericIntoFractionStartForRenderingStyle = {start: 0, middle: 0.5, end: 1}; //0.5 zamienić na fractionNumSelected
		while ((matchNameStyleItemGallery = regexNameStyleItemGallery.exec(strCssSelector)) != null) {
			let [nameStyle, numDimension, fractionStartForRenderingStyle] = matchNameStyleItemGallery;
			nameStyle = nameStyle.substring(1);
			if (isNaN(fractionStartForRenderingStyle)) fractionStartForRenderingStyle = genericIntoFractionStartForRenderingStyle[fractionStartForRenderingStyle]
			else fractionStartForRenderingStyle = parseInt(fractionStartForRenderingStyle) / 100;
			numDimension = parseInt(numDimension);
			
			
			if (!isNaN(fractionStartForRenderingStyle) && !isNaN(numDimension)) { 
				if (!this.objNumDimensionToArrStyleTransformed[numDimension]) this.objNumDimensionToArrStyleTransformed[numDimension] = new ArrStyleTransformedForDimension();
				if (this.objNumDimensionToArrStyleTransformed[numDimension].find((val, i) => (val.fractionStartForRenderingStyle == fractionStartForRenderingStyle)) === undefined)
					this.objNumDimensionToArrStyleTransformed[numDimension].push(new StyleTransformed(getStyleFromClass(nameStyle, elemContainerItem), nameStyle, fractionStartForRenderingStyle));
			}
		}
		for (let arrStyleTransformed of Object.values(this.objNumDimensionToArrStyleTransformed)) {
			console.log(arrStyleTransformed);
			arrStyleTransformed.initTimelineElem(elemContainerItem, nameParamItem);
		}
		console.log(this.objNumDimensionToArrStyleTransformed);
		
	}
	
}