import MultiRowCircleGallery from 'base/gallery/MultiRowCircleGallery.js'
import MultiItemGallery from 'base/gallery/MultiItemGallery.js'
import {isElementInsideContainer} from 'base/dom/Helpers.js'
//import $ from 'jquery';

export default class MultiRowFlowGallery extends MultiRowCircleGallery {
	
	constructor(funcGetNumInRowForRenderableSelected, elemContainerItem, optionsVisual, optionsController) {
		super(funcGetNumInRowForRenderableSelected, elemContainerItem, optionsVisual, optionsController);
	}
	
	setArrCountRenderableInRow(arrCountRenderableInRow) {
		this.arrCountRenderableInRow = arrCountRenderableInRow;
	}
	
	manageArrRenderableInRow() {
		//console.log("manageArrRenderableInRow:", this.arrCountRenderableInRow.length, this.arrRenderableInRow.length, this.numRenderableFirst, this.arrNumInDimension)
		this._removeRenderableInRow(this.arrCountRenderableInRow)
		this._addRenderableInRow(this.arrCountRenderableInRow);
	}
	
	_removeRenderableInRow(arrCountRenderableInRow) {
		this.arrCountRenderableInRow = arrCountRenderableInRow;
		let numInDimensionRenderableToRemove;
		//console.log("_removeRenderableInRow:", arrCountRenderableInRow.length, this.arrRenderableInRow.length, this.numRenderableFirst, this.arrNumInDimension)
		for (var i = 0; i < this.arrRenderableInRow.length; i++) {
			let renderableInRow = this.arrRenderableInRow[i];
			this.setNumInRowInRenderableInRow(renderableInRow, i);
			numInDimensionRenderableToRemove = renderableInRow.arrNumInDimension[this.arrNumInDimension.length];
			//console.log("item:", this.numRenderableFirst, renderableInRow, i, numInDimensionRenderableToRemove, renderableInRow.arrNumInDimension);
			if (renderableInRow instanceof MultiItemGallery) {
				if (!this.isRenderableInRow(numInDimensionRenderableToRemove, i)) {
					//console.log("removeChild:", numInDimensionRenderableToRemove, i)
					//if ($(renderableInRow).parent($(this.elemContainerItem)).length)
					if (isElementInsideContainer(this.elemContainerItem, renderableInRow.elem))
						this.elemContainerItem.removeChild(renderableInRow.elem);
					this.arrRenderableInRow.splice(i--, 1);
				}
			} else if (renderableInRow instanceof MultiRowFlowGallery) {
				var arrCountRenderableInSubRow = this._getArrCountRenderableInSubRow(numInDimensionRenderableToRemove, i);
				renderableInRow._removeRenderableInRow(arrCountRenderableInSubRow);
				if (arrCountRenderableInSubRow.length == 0) {
					//console.log("remove row:", i, this.arrRenderableInRow)
					this.arrRenderableInRow.splice(i--, 1);
				}
			}
		}
	}
	
	isRenderableNotOnRightEdgeOfRow(numRenderableInRow) {
		return ((numRenderableInRow < this.arrCountRenderableInRow.length - 1) || (this.timeControl % 1 > 0));
		//return (numRenderableInRow != MathExt.minDiff(this.timeControl, this.numRenderableFirst, this.arrCountRenderableInRow.length) + this.numInRowForRenderableSelected + 1);
	}
	
	_getArrCountRenderableInSubRow(numRenderableInDimension, numRenderableInRow = -1) {
		let arrCountRenderableInSubRow;
		if (this.arrCountRenderableInRow.length == 0) arrCountRenderableInSubRow = [];
		else {
			if (numRenderableInRow > -1) {
				if ((this.isRenderableNotOnRightEdgeOfRow(numRenderableInRow))
				 &&	(numRenderableInDimension == (this.numRenderableFirst + numRenderableInRow) % this.arrRenderable.length)
				 && (((numRenderableInDimension >= this.numRenderableFirst) && (numRenderableInDimension < this.numRenderableFirst + this.arrCountRenderableInRow.length))
				  || (numRenderableInDimension < this.arrCountRenderableInRow.length - (this.arrRenderable.length - this.numRenderableFirst))))
					arrCountRenderableInSubRow = this.arrCountRenderableInRow[numRenderableInRow];
				else arrCountRenderableInSubRow = [];
			} else {
				if ((numRenderableInDimension >= this.numRenderableFirst) && (numRenderableInDimension < this.numRenderableFirst + this.arrCountRenderableInRow.length))
					arrCountRenderableInSubRow = this.arrCountRenderableInRow[numRenderableInDimension - this.numRenderableFirst];
				else if (numRenderableInDimension < this.arrCountRenderableInRow.length - (this.arrRenderable.length - this.numRenderableFirst))
					arrCountRenderableInSubRow = this.arrCountRenderableInRow[numRenderableInDimension + (this.arrRenderable.length - this.numRenderableFirst)];
			}
		}
		return arrCountRenderableInSubRow;
	}
	
	_addRenderableInRow(arrCountRenderableInRow) {
		this.arrCountRenderableInRow = arrCountRenderableInRow;
		//console.log("_addRenderableInRow:", this.arrCountRenderableInRow.length, this.arrRenderableInRow.length, this.numRenderableFirst, this.arrNumInDimension)
		let numInDimensionRenderableToAdd;
		for (var [i, renderableInRow] of this.arrRenderableInRow.entries()) {
			if (renderableInRow instanceof MultiRowFlowGallery) {
				numInDimensionRenderableToAdd = renderableInRow.arrNumInDimension[this.arrNumInDimension.length];
				const arrCountRenderableInSubRow = this._getArrCountRenderableInSubRow(numInDimensionRenderableToAdd, i);
				renderableInRow._addRenderableInRow(arrCountRenderableInSubRow);
			}
		}
		//zawsze  this.arrRenderableInRow.length <= arrCountRenderableInRow.length
		let countRenderableToAdd = this.arrCountRenderableInRow.length - this.arrRenderableInRow.length;
		if (countRenderableToAdd > 0) {
			let numCurrentFirstRenderableInRow = (this.numRenderableFirst + countRenderableToAdd) % this.arrRenderable.length;
			let numCurrentLastRenderableInRow = this.numRenderableFirst - 1;
			if (this.arrRenderableInRow.length > 0) {
				renderableInRow = this.arrRenderableInRow[0];
				numCurrentFirstRenderableInRow = renderableInRow.arrNumInDimension[this.arrNumInDimension.length];
				renderableInRow = this.arrRenderableInRow[this.arrRenderableInRow.length - 1];
				numCurrentLastRenderableInRow = renderableInRow.arrNumInDimension[this.arrNumInDimension.length];
			}
			//console.log("numCurrent:", numCurrentFirstRenderableInRow, numCurrentLastRenderableInRow)
			numInDimensionRenderableToAdd = numCurrentFirstRenderableInRow;
			let countRenderableToAddAtStart;
			if (numInDimensionRenderableToAdd >= this.numRenderableFirst) countRenderableToAddAtStart = numInDimensionRenderableToAdd - this.numRenderableFirst;
			else countRenderableToAddAtStart = numInDimensionRenderableToAdd + (this.arrRenderable.length - this.numRenderableFirst);
			if (numInDimensionRenderableToAdd != this.numRenderableFirst) {
				for ([i, renderableInRow] of this.arrRenderableInRow.entries()) //tutaj raczej zawsze this.arrRenderableInRow.length równe jest 0
					this.setNumInRowInRenderableInRow(renderableInRow, i + countRenderableToAddAtStart);	
			}
			while (numInDimensionRenderableToAdd != this.numRenderableFirst) {
				numInDimensionRenderableToAdd = ((numInDimensionRenderableToAdd > 0) ? numInDimensionRenderableToAdd : this.arrRenderable.length) - 1;
				countRenderableToAddAtStart--;
				if (this.isRenderableNotOnRightEdgeOfRow(countRenderableToAddAtStart))
					this.arrRenderableInRow.unshift(this._addRenderable(numInDimensionRenderableToAdd, countRenderableToAddAtStart))
				countRenderableToAdd--;
			}
			numInDimensionRenderableToAdd = (numCurrentLastRenderableInRow < this.arrRenderable.length - 1) ? (numCurrentLastRenderableInRow + 1) : 0;
			while (countRenderableToAdd > 0) {
				if (this.isRenderableNotOnRightEdgeOfRow(this.arrRenderableInRow.length))
					this.arrRenderableInRow.push(this._addRenderable(numInDimensionRenderableToAdd, this.arrRenderableInRow.length));
				numInDimensionRenderableToAdd = (numInDimensionRenderableToAdd < this.arrRenderable.length - 1) ? (numInDimensionRenderableToAdd + 1) : 0;
				countRenderableToAdd--;
			}
		}
		//console.log("kon add:", this.arrCountRenderableInRow.length, this.arrRenderableInRow.length); 
	}
	
	_addRenderable(numInDimensionRenderableToAdd, numRenderableInRow) {
		const renderableToAdd = this.arrRenderable[numInDimensionRenderableToAdd];
		this.setNumInRowInRenderableInRow(renderableToAdd, numRenderableInRow);
		if (renderableToAdd instanceof MultiItemGallery) {
			//console.log("appendChild:", numInDimensionRenderableToAdd, numRenderableInRow)
			this.elemContainerItem.appendChild(renderableToAdd.elem);
			this.isForceRenderParentRow = true;
		} else if (renderableToAdd instanceof MultiRowFlowGallery) {
			var arrCountRenderableInSubRow = this._getArrCountRenderableInSubRow(numInDimensionRenderableToAdd, numRenderableInRow);
			//console.log("add row:", numInDimensionRenderableToAdd, numRenderableInRow)
			renderableToAdd._addRenderableInRow(arrCountRenderableInSubRow);
		}
		return renderableToAdd;
	}
	
	dispose() {
		super.dispose();
	}
	
}