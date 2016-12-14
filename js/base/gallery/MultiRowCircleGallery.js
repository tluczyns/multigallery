import MultiItemGallery from 'base/gallery/MultiItemGallery.js'
import MathExt from 'base/math/MathExt.js';
import TweenLite from "gsap";
import {isElementInsideContainer} from 'base/dom/Helpers.js'

export default class MultiRowCircleGallery {
	
	constructor(funcGetNumInRowForRenderableSelected, elemContainerItem, optionsVisual, optionsController) {
		this._funcGetNumInRowForRenderableSelected;
		this._isFirstTimeSetNumSelected;
		this._numSelected = -1;
		this.arrNumInDimension;
		this.arrRenderable = [];
		
		this._timeTotal;
		this._timeControl = 0;
		
		this._arrCountRenderableInRow = [];
		this.arrRenderableInRow = [];
		this.numInRowForRenderableSelected = 0;
		this.arrNumInRow = [];
		this.numRenderableFirst;
		
		this.parentRow;
		this.isForceRenderParentRow = false;
		
		this.elem;
		this.elemContainerItem;
		this._optionsVisual;
		this._optionsController;
		
		this._funcGetNumInRowForRenderableSelected = funcGetNumInRowForRenderableSelected;
		this.elem = document.createElement('div');
	//	this.elem.className = this._nameParamItem + "_row_in_dimension_" +  ;
		this.elemContainerItem = elemContainerItem;
		this._optionsVisual = optionsVisual;
		this._optionsController = optionsController;
	}
	
	initAfterSetArrRenderable(arrNumInDimension) {
		this.arrNumInDimension = arrNumInDimension;
		this._timeTotal = this.arrRenderable.length;
		
	}
	
	setArrCountRenderableInRow(arrCountRenderableInRow) {
		this.arrCountRenderableInRow = arrCountRenderableInRow;
		this.arrRenderableInRow.length = this.arrRenderable.length;
		this._timeControl = this.numInRowForRenderableSelected;
		this._isFirstTimeSetNumSelected = true;
		this.numSelected = 0;
		this._isFirstTimeSetNumSelected = false;
		let renderableInRow;
		for (const [i, renderableInRow] of this.arrRenderable.entries()) {
			this.arrRenderableInRow[i] = renderableInRow;
			if (renderableInRow instanceof MultiRowCircleGallery)
				renderableInRow.setArrCountRenderableInRow(this.arrCountRenderableInRow[i]);
			else if (renderableInRow instanceof MultiItemGallery)
				this.elemContainerItem.appendChild(renderableInRow.elem);
		}
	}
	
	/*selectPrevNextItem(isPrevNext) {
		if (isPrevNext == 0) this.numSelected = (this.numSelected > 0) ? this.numSelected - 1 : this.arrRenderable.length - 1;
		else if (isPrevNext == 1) this.numSelected = (this.numSelected < this.arrRenderable.length - 1) ? this.numSelected + 1 : 0;
	}*/
	
	get numSelected() {
		return this._numSelected;
	}
	
	set numSelected(value) {
		//console.log("numSelected:", value, this._numSelected, this.numInRowForRenderableSelected, this.arrNumInDimension, this.arrRenderable.length)
		//if ((this._numSelected != -1) && (this.arrRenderable[this._numSelected] instanceof MultiItemGallery)) this.arrRenderable[this._numSelected].selected = false;
		this._numSelected = value;
		//if (this.arrRenderable[this._numSelected] instanceof MultiItemGallery) this.arrRenderable[this._numSelected].selected = true;	
		const timeNumSelected = MathExt.moduloPositive(value, this._timeTotal);
		const diffTimeGlobal = MathExt.minDiffWithSign(timeNumSelected, this._timeControl, this._timeTotal);
		if (diffTimeGlobal == 0) this.timeControl = this.timeControl;
		else TweenLite.to(this, this._isFirstTimeSetNumSelected ? 0.001 : Math.max(this._optionsVisual.timeMoveOneRenderable, Math.pow(Math.abs(diffTimeGlobal) * this._optionsVisual.timeMoveOneRenderable, 0.5)), {timeControl: this._timeControl + diffTimeGlobal, ease: this._optionsVisual.easeMoveRenderables});
		//console.log("tween timeControl:", this._timeControl, timeNumSelectedNormalized, diffTimeGlobal, this._timeTotal);
		this._isFirstTimeSetNumSelected = false;
	}
	
	get timeControl() {
		return this._timeControl;
	}
	
	set timeControl(value) {
		this._timeControl = MathExt.moduloPositive(value, this._timeTotal);
		if ((this.arrCountRenderableInRow) && (this.arrCountRenderableInRow.length > 0)) {
			//console.log("set timecontrol:", this.arrNumInDimension, "; ", this.arrNumInRow)
			this.manageArrRenderableInRow();
			this._renderFromCurrent();
		}
	}
	
	get arrCountRenderableInRow() {
		return this._arrCountRenderableInRow;
	}
	
	set arrCountRenderableInRow(value) {
		this._arrCountRenderableInRow = value;
		this.numInRowForRenderableSelected = this._funcGetNumInRowForRenderableSelected(value.length, this.arrNumInRow);
		this.numRenderableFirst = MathExt.moduloPositive(Math.floor(this.timeControl) - this.numInRowForRenderableSelected, this.arrRenderable.length);
	}
	
	//manageArrRenderableInRow
	
	manageArrRenderableInRow() {
		this.arrCountRenderableInRow = this.arrCountRenderableInRow;
		for (let i = 0; i < this.arrRenderableInRow.length; i++) {
			this.arrRenderableInRow[i] = this.arrRenderable[(this.numRenderableFirst + i) % this.arrRenderable.length];
			this.setNumInRowInRenderableInRow(this.arrRenderableInRow[i], i)
		}
	}
	
	setNumInRowInRenderableInRow(renderableInRow, numRenderableInRow) {
		if (!renderableInRow.arrNumInRow) renderableInRow.arrNumInRow = [];
		renderableInRow.arrNumInRow.length = Math.max(renderableInRow.arrNumInRow.length, this.arrNumInRow.length + 1)
		for (let i = 0; i < this.arrNumInRow.length; i++)
			renderableInRow.arrNumInRow[i] = this.arrNumInRow[i];
		renderableInRow.arrNumInRow[this.arrNumInRow.length] = numRenderableInRow;
	}
	
	isRenderableInRow(numRenderableInDimension, numRenderableInRow) {
		return (this.isRenderableNotOnRightEdgeOfRow(numRenderableInRow)
		 && (numRenderableInDimension == (this.numRenderableFirst + numRenderableInRow) % this.arrRenderable.length) 
		 && (((numRenderableInDimension >= this.numRenderableFirst) && (numRenderableInDimension < this.numRenderableFirst + this.arrCountRenderableInRow.length)) || (numRenderableInDimension < this.arrCountRenderableInRow.length - (this.arrRenderable.length - this.numRenderableFirst))));
	}
	
	isRenderableNotOnRightEdgeOfRow(numRenderableInRow) {
		return true;
	}
	
	//render
	
	_renderFromCurrent() {
		//console.log("_renderFromCurrent");
		this.renderInternal([], this.arrNumInDimension.length, [], [], []);
	}
	
	renderInternal(arrTimeRender, startNumDimensionToRender, arrTimeTotal, arrCountRenderableInRowForItem, arrNumInRowForRenderableSelected) {
		//console.log("start")
		if (this.isForceRenderParentRow && this.parentRow) {
			this.isForceRenderParentRow = false;
			this.parentRow.isForceRenderParentRow = true;
			//console.log("go parent")
			this.parentRow._renderFromCurrent();
		} else {
			//console.log("row render: ", arrTimeRender, startNumDimensionToRender, this.arrRenderableInRow)
			for (const [i, renderableInRow] of this.arrRenderableInRow.entries()) {
				if (renderableInRow instanceof MultiRowCircleGallery) renderableInRow.isForceRenderParentRow = false;
				renderableInRow.renderInternal(arrTimeRender.concat(i - this.numInRowForRenderableSelected - this.timeControl % 1), startNumDimensionToRender, arrTimeTotal.concat(this._timeTotal), arrCountRenderableInRowForItem.concat(this.arrCountRenderableInRow.length), arrNumInRowForRenderableSelected.concat(this.numInRowForRenderableSelected));
			}
		}
	}
	
	//dispose
	
	dispose() {
		for (let [i, renderable] of this.arrRenderable.entries()) {
			var numRenderableInRow = i - this.numRenderableFirst;
			if (numRenderableInRow < 0) numRenderableInRow = this.arrRenderable.length + numRenderableInRow;
			renderable.dispose();
			if (this.isRenderableInRow(i, numRenderableInRow))
				if ((renderable instanceof MultiItemGallery) && (isElementInsideContainer(this.elemContainerItem, renderable.elem))) this.elemContainerItem.removeChild(renderable.elem);
			renderable = null;
		}
		this.arrCountRenderableInRow = [];
		this.arrRenderableInRow = null;
		this.arrRenderable = null;
	}
	
}