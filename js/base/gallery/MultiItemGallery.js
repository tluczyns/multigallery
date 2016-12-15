import MultiCircleGallery from "base/gallery/MultiCircleGallery.js"
import MapCssStyle from 'base/gallery/MapCssStyle.js'
import MathExt from 'base/math/MathExt.js'
import $ from 'base/vspm/jquery.address.addons.js';

export default class MultiItemGallery {
	
	constructor(id, nameParamItem, objData) {
		this.id;
		this._nameParamItem;
		this.objData;
		this.elem;
		this.arrNumInDimension;
		this.arrStylesForDimensions;
		this.arrTimeRender = [];
		this.arrTimeTotal = [];
		this.arrCountRenderableInRowForItem = [];
		this.arrNumInRowForRenderableSelected = [];
		this.arrNumInRow;
		this._selected;
		
		this.id = id;
		this._nameParamItem = nameParamItem;
		this.objData = objData;
		this.elem = document.createElement("div");
		this.elem.className = this._nameParamItem;
		this.elem.style.display = "block";
		this.elem.onclick = this.onClick.bind(this);
		this.styleElem = this.elem.style;
	}
	
	static getIdWithoutSuff(id) {
		const indCloneCharInId = id.indexOf(MultiCircleGallery.ARR_CHAR_DIMENSION_TO_ID_WHEN_CLONE[0]);
		let idWithoutStuff = id;
		if (indCloneCharInId > -1)
			idWithoutStuff = idWithoutStuff.substring(0, indCloneCharInId);
		return idWithoutStuff;
	}
	
	get idWithoutSuff() {
		return MultiItemGallery.getIdWithoutSuff(this.id);
	}
	
	initRender(arrNumInDimension) {
		this.arrNumInDimension = arrNumInDimension;
		this.arrStylesForDimensions = new Array(arrNumInDimension.length);
		for (let i = 0; i < this.arrStylesForDimensions.length; i++) {
			let stylesForDimensions = {};
			for (const suffixNameStyle of MapCssStyle.arrSuffixNameStyle)
				stylesForDimensions[suffixNameStyle] = MapCssStyle.get(this._nameParamItem + "_dimension_" + String(i) + "_" + suffixNameStyle);
			this.arrStylesForDimensions[i] = stylesForDimensions;
		}
		this.styleElem.backgroundColor = MathExt.convertColorUintToHTML(parseInt(this.objData.color.replace(/^#/, ''), 16));
	}
	
	
	renderInternal(arrTimeRender, startNumDimensionToRender, arrTimeTotal, arrCountRenderableInRowForItem, arrNumInRowForRenderableSelected) {
		//console.log("item render: ", arrTimeRender, startNumDimensionToRender, this.arrTimeRender)
		this.arrTimeRender.length = Math.max(this.arrTimeRender.length, startNumDimensionToRender + arrTimeRender.length);
		this.arrTimeTotal.length = Math.max(this.arrTimeTotal.length, startNumDimensionToRender + arrTimeTotal.length);
		this.arrCountRenderableInRowForItem.length = Math.max(this.arrCountRenderableInRowForItem.length, startNumDimensionToRender + arrCountRenderableInRowForItem.length);
		this.arrNumInRowForRenderableSelected.length = Math.max(this.arrNumInRowForRenderableSelected.length, startNumDimensionToRender + arrNumInRowForRenderableSelected.length);
		for (var i = 0; i < arrTimeRender.length; i++) {
			this.arrTimeRender[startNumDimensionToRender + i] = arrTimeRender[i];
			this.arrTimeTotal[startNumDimensionToRender + i] = arrTimeTotal[i];
			this.arrCountRenderableInRowForItem[startNumDimensionToRender + i] = arrCountRenderableInRowForItem[i];
			this.arrNumInRowForRenderableSelected[startNumDimensionToRender + i] = arrNumInRowForRenderableSelected[i];
		}
		i = 0;
		while ((i < this.arrTimeRender.length) && (this.arrTimeRender[i] == 0)) i++;
		this.selected = (i == this.arrTimeRender.length);
		this.renderItem();
	}
	
	renderItem() {
		for (var i = 0; i < this.arrTimeRender.length; i++) {
			this.arrTimeRender[i] = MathExt.roundPrecision(this.arrTimeRender[i], 2)
		}
		this.elem.innerHTML = String(this.arrTimeRender) + "<br/>" + String(this.arrTimeTotal) + "<br/>" + String(this.arrCountRenderableInRowForItem) + "   " + String(this.arrNumInRowForRenderableSelected) + "<br/>" + String(this.arrNumInRow) + "<br/>" + String(this.arrNumInDimension);
		for (i = 0; i < this.arrTimeRender.length; i++) {
			let timeRender = this.arrTimeRender[i];
			let timeTotal = this.arrTimeTotal[i];
			let countRenderableInRowForItem = this.arrCountRenderableInRowForItem[i];
			let stylesForDimensions = this.arrStylesForDimensions[i];
			
			//console.log("stylesForDimensions:", stylesForDimensions.start.top)
			
			
			switch(i) {
				case 0: this.styleElem.top = ((timeRender + countRenderableInRowForItem / 2) * 150) + "px"; break;
				case 1: this.styleElem.left = ((timeRender + countRenderableInRowForItem / 2) * 250) + "px"; break;
				//case 2: this.z = (timeRender + 2) * 250; this.z = (timeRender + 2) * 100; break;
			}
		}
		//console.log("pos:", this.styleElem.top, this.styleElem.top, timeRender, this.arrNumInDimension)
		//this.scaleX = this.scaleY = 3 * (1 - Math.abs(0.5 - time))
		//this.rotationY = - 90 + time * 180;
	}
	
	removeRender() {
		//additional clean when removed from dom
	}
	
	//selected
	
	get selected() {
		return this._selected;
	}
	
	set selected(value) {
		this._selected = value;
		//indicate elem that it is selected
	}
	
	//

	onClick(e) {
		if (!this.selected) $.address.setPathWithParameters({objParamsNewAndChanged: this.prepareObjParamItemForClick()});
		else this.onClickWhenSelected();	
	}
	
	prepareObjParamItemForClick() {
		return {[this._nameParamItem]: this.id};
	}
	
	onClickWhenSelected() {}
	
	dispose() {
		this.elem.onclick = null;
		this.removeRender();
	}
	
}