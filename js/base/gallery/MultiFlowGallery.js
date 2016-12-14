import MultiCircleGallery from 'base/gallery/MultiCircleGallery.js'
import MultiRowFlowGallery from 'base/gallery/MultiRowFlowGallery.js'
 
export default class MultiFlowGallery extends MultiCircleGallery {
	
	constructor(nameUnique = "", arrData, optionsController, optionsVisual) {
		super(nameUnique, arrData, optionsController, optionsVisual);
	}
	
	createArrCountRenderableInRow() {
		super.createArrCountRenderableInRow();
		this._duplicateInArrLastCountRednerableRow(this.arrCountRenderableInRow);
	}
	
	_duplicateInArrLastCountRednerableRow(arrCountRenderableInRow) {
		var lastCountRenderableInRow = arrCountRenderableInRow[arrCountRenderableInRow.length - 1];
		arrCountRenderableInRow.length = arrCountRenderableInRow.length + 1;
		if (Array.isArray(lastCountRenderableInRow)) arrCountRenderableInRow[arrCountRenderableInRow.length - 1] = lastCountRenderableInRow.concat();
		for (const countRenderableInRow of arrCountRenderableInRow) {
			if (Array.isArray(countRenderableInRow)) this._duplicateInArrLastCountRednerableRow(countRenderableInRow);
		}
	}
	
	getArrCountRenderableInRow() {
		//return [new Array(1), new Array(1)]
		//return [new Array(2), new Array(2)];
		//return [new Array(new Array(2), new Array(6), new Array(6), new Array(3)), new Array(new Array(2), new Array(6), new Array(32)), new Array(new Array(2), new Array(6), new Array(3), new Array(3), new Array(3), new Array(3), new Array(3), new Array(3))];
		//return [new Array(3)];			
		return [new Array(3), new Array(3), new Array(3), new Array(3), new Array(3)];
		//return [new Array(5), new Array(4), new Array(5)];
	}
	
	getMaxCountItemInDimension(numDimension) {
		return this.getMaxCountItemInDimensionInner(this.arrCountRenderableInRow, numDimension);
	}
	
	initItem(item) {
		//if (this.optionsVisual.isAlphaManagement) item.alpha = 0;
	}
	
	get classRow() {
		return MultiRowFlowGallery;
	}

}