import TweenLite from "gsap";
//import {getStyleFromClass} from 'base/dom/Helpers.js'
//import {filterObj} from 'base/Globals.js'
//import Matrix3d, {MatrixInterpolation} from 'kamicane/Matrix3d.js'
//import MapCssStyle from 'base/gallery/MapCssStyle.js'
import $ from 'jquery'
import GeneratorStylesTransformed from 'base/gallery/GeneratorStylesTransformed.js'

//ustawianie dynamiczne poszczególnych elementów transform bez zmiany pozostałych w poszczególnych wymiarach
//przypiecie do elementu dom
//wartości pośrednie pomiedzy dwom MATRIX3D

class ApplicationTestRendering {
	
	constructor() {
		this.nameParamItem = "ig_portfolio";
		this.elemContainerItem = document.getElementById('container');
		//this._createStylesForDimension(0);
		//this._createStylesForDimension(1);
		
		this.arrCountRenderableInRowForItem = [7, 5]; // -4->3 -3->2 
		
		this.arrNumInRowForRenderableSelected = [3, 2];   //-4->1 dla 3  -3->2 dla 2   -2->3 dla 1
		
		
		
		//[- numInRowForRenderableSelected - 1, -numInRowForRenderableSelected - 1 + countRenderableInRowForItem]
		
		
		this.generatorStylesTransformed = new GeneratorStylesTransformed(this.elemContainerItem, this.nameParamItem)
		
		
		this.elemAnim = document.getElementById('carousel');
		
		
		this.arrTimeRender = [-1, 0];
		var arrTimeRenderEnd = [1, 1];
		arrTimeRenderEnd.ease = Linear.easeNone;
		arrTimeRenderEnd.onUpdate = () => this.renderItem();
		TweenLite.to(this.arrTimeRender, 0.5, arrTimeRenderEnd); 
		
		//TweenLite.to(this, 0.5, {timeControl: this._timeControl + diffTimeGlobal, ease: Cubic.easeInOut});
	}
		
		
	renderItem() {
		this.elemAnim.style.cssText = "";
		this.generatorStylesTransformed.objNumDimensionToArrStyleTransformed[1].timelineElem.pause();
		for (let i = 1; i < 2; i++) {
			var fractionTimeRender =  (this.arrNumInRowForRenderableSelected[i] + 1 + this.arrTimeRender[i]) / this.arrCountRenderableInRowForItem[i]; 
			console.log("fractionTimeRender:", fractionTimeRender);
			this.generatorStylesTransformed.objNumDimensionToArrStyleTransformed[i].timelineElem.progress(fractionTimeRender);
			
			
			
			this.elemAnim.style.cssText += (" " + window.getComputedStyle(this.generatorStylesTransformed.objNumDimensionToArrStyleTransformed[i].elem).cssText);
			
		}
		
		//create interpolation matrices between transforms in every dimension

			
		
	}
		
	
		/*let mrx = new THREE.Matrix4();
		mrx.set.apply(mrx, arrTransform);
		let position = new THREE.Vector3();
		let quaternion = new THREE.Quaternion();
		let scale = new THREE.Vector3();
		mrx.decompose(position, quaternion, scale);
		let rotation = new THREE.Euler().setFromQuaternion(quaternion, 'XYZ');
		quaternion.normalize();
		console.log("THREE.js rotation:", quaternion, rotation.x * (180 / Math.PI), rotation.y * (180 / Math.PI), rotation.z * (180 / Math.PI));*/
		
		//let decomposedMatrix = this.matrix3d.decompose();
		//console.log("decomposedMatrix:", decomposedMatrix.quaternion, decomposedMatrix.rotation.x * (180 / Math.PI), decomposedMatrix.rotation.y * (180 / Math.PI), decomposedMatrix.rotation.z * (180 / Math.PI));
	
	//MultiCircleGallery.js
	_createStylesForDimension(numDimension) {
		/*let arrNameStyle = MapCssStyle.arrSuffixNameStyle.map(suffixNameStyle => this.nameParamItem + "_dimension_" + String(numDimension) + "_" + suffixNameStyle);
		let arrStyle = arrNameStyle.map(nameStyle => getStyleFromClass(nameStyle, this.elemContainerItem));
		let [styleStart, styleMiddle, styleEnd] = arrStyle;
		const setDefaultValuesOfProps = new Set([undefined, '', 'initial', 'inherit', 'unset', 'normal', 'none', 'auto']); // '', initial, unset, normal, auto -> none
		arrStyle[0] = filterObj(styleStart, (nameProp, valProp) => {
			let isEqualMiddleAndEndValProp = (styleEnd[nameProp] == valProp) && (styleMiddle[nameProp] == valProp) ;
			if (isEqualMiddleAndEndValProp) {
				delete styleMiddle[nameProp];
				delete styleEnd[nameProp];
			}// else if (setDefaultValuesOfProps.has(styleMiddle[nameProp]))
			//	delete styleMiddle[nameProp];
			return !isEqualMiddleAndEndValProp;
		});
		//if (styleStart.transform != undefined) {
			for (const style of arrStyle) {
				let arrTransform;
				let cssTransformMatrix = style.transform;
				console.log("cssTransformMatrix:", cssTransformMatrix);
				if (cssTransformMatrix != "none")
					arrTransform = cssTransformMatrix.split('(')[1].split(')')[0].split(',').map(v => parseFloat(v));
				//if (!arrTransform || !arrTransform.length) arrTransform = [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
				if (arrTransform && arrTransform.length)	
					style.mrxTransform = new Matrix3d(arrTransform);
				console.log("arrTransform:", arrTransform)
				delete style.transform;
			}
			
		//}		
		
		for (const [i, nameStyle] of arrNameStyle.entries())
			MapCssStyle.set(nameStyle, arrStyle[i]);
		*/
			
			
			
		/*let arrExistingMrxTransform = arrStyle.mrxTransform.map((val, i) => {value: val, index: i}).filter((val) => (val.value != undefined));
		if (arrExistingMrxTransform.length) { 
			if (arrExistingMrxTransform.length > 1) {
			let arrMrxTransformInterpolation = Array.from(new Array(arrExistingMrxTransform.length - 1), (currVal, i) => ({mrxInterpolation: new MatrixInterpolation(arrExistingMrxTransform[i].value, arrExistingMrxTransform[i + 1].value), fractionFinish: arrExistingMrxTransform[i + 1].index}));
	
		
		this.stylesForRendering = {};
		for (const suffixNameStyle of MapCssStyle.arrSuffixNameStyle)
			this.stylesForRendering[suffixNameStyle] = MapCssStyle.get(this.nameParamItem + "_dimension_" + String(0) + "_" + suffixNameStyle);	
		
		let arrExistingMrxTransform = MapCssStyle.arrSuffixNameStyle.map(suffixNameStyle => this.stylesForRendering[suffixNameStyle].mrxTransform).filter((currVal) => (currVal != undefined));
		if (arrExistingMrxTransform.length) { 
			if (arrExistingMrxTransform.length > 1) {
				let arrMrxTransformInterpolation = Array.from(new Array(arrExistingMrxTransform.length - 1), (currVal, i) => new MatrixInterpolation(arrExistingMrxTransform[i], arrExistingMrxTransform[i + 1]));
				let fractionStep = 0;
				let mrxTransformInterpolation;
				const rangeForOneInterpolation = 1 / arrMrxTransformInterpolation.length;
				let intervalAnimTransformMatrix = setInterval(() => {
					if (fractionStep >= 0.999) {
						console.log("uu:", arrExistingMrxTransform.length - 1, arrExistingMrxTransform[arrExistingMrxTransform.length - 1].toString())
						this.elemAnim.style.transform = arrExistingMrxTransform[arrExistingMrxTransform.length - 1].toString();
						clearInterval(intervalAnimTransformMatrix);
					} else {
						let numInterpolation = Math.floor(fractionStep / rangeForOneInterpolation);
						console.log(numInterpolation, fractionStep , rangeForOneInterpolation)
						mrxTransformInterpolation = arrMrxTransformInterpolation[numInterpolation];
						this.elemAnim.style.transform = mrxTransformInterpolation.step((fractionStep % rangeForOneInterpolation) * arrMrxTransformInterpolation.length).toString();
						console.log("this.elemAnim.style.transform:", this.elemAnim.style.transform);
						fractionStep += 0.1;
					}
				}, 1000);
			} else this.elemAnim.style.transform = arrExistingMrxTransform[0].toString();
		}*/
			
		//setTimeout(() => console.log("ssdd:", this.elemContainerItem.offsetHeight), 1000);
		/*window.addEventListener("scroll", () => {
			console.log("ssdd:", this.elem.getBoundingClientRect(), this.elem.offsetLeft, this.elem.offsetTop)
		});*/
	}
	
}


$(document).ready(function() {
	let applicationTestRendering = new ApplicationTestRendering();
});



/* snippet macierz podzielona i macierz transponowana
let arrTransformDivided = new Array(4);
arrTransformDivided.fill(new Array(4));
let arrTransformTransposed = new Array(16);
arrTransform.forEach((currentValue, index, array) => {
	arrTransformDivided[Math.floor(index / 4)][index % 4] = currentValue
	arrTransformTransposed[(index % 4) * 4 + Math.floor(index / 4)] = currentValue;
});*/