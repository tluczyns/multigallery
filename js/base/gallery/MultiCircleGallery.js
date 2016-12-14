import {EventReceiver} from 'base/events/EventReceiverDispatcher.js'
import OptionsControllerMulti from 'base/gallery/OptionsControllerMulti.js'
import OptionsVisualMulti from 'base/gallery/OptionsVisualMulti.js'
import MultiFlowGallery from 'base/gallery/MultiFlowGallery.js'
import MultiItemGallery from 'base/gallery/MultiItemGallery.js'
import MultiRowCircleGallery from 'base/gallery/MultiRowCircleGallery.js'
import {getStyleFromClass} from 'base/dom/Helpers.js'
import {filterObj} from 'base/Globals.js'
import MapCssStyle from 'base/gallery/MapCssStyle.js'
import StateModel from 'base/vspm/StateModel.js'
import EventStateModel from 'base/vspm/EventStateModel.js'
import MathExt from 'base/math/MathExt.js'
import $ from 'base/vspm/jquery.address.addons.js';

export default class MultiCircleGallery extends EventReceiver {
	constructor(nameUnique = "", arrData, optionsController, optionsVisual) {
		super();
		this._arrData;
		this.arrCountRenderableInRow;
		//items
		this.elem;
		this.elemContainerItem;
		this.arrItem;
		this._row;
		//item
		this.nameParamItem;
		this._idItemSequentGeneric;
		this.mapIdToIdWithSuff;
		//row
		this._arrOfArrRowInDimension;
		this._mapIdToArrNumInDimension;
		this.mapArrNumInDimensionToId;
		//swf address gateway
		this.idItemSelected;
		this._isCreatedEventSelectItemChanged;
		//options
		this.optionsController;
		this.optionsVisual;
		//controllers
		//arrows
		this.elemContainerArrArrows;
		this._arrArrows;
		//automate change items
		this._timeoutChangeItemFirstTime;
		this._intervalChangeItem;
		this._isSelectFromAuto;
		
		
		//arrData = [[0xff0000, 0xff0000, 0x00ff00, 0x0000ff, 0x000000], [0xff00ff, 0x00ffff, 0xffff00, 0xff0077], [0x7700ff, 0xff0077, 0xff77ff, 0xff7777], [0x333333, 0x666666, 0x999999, 0xcccccc]];
		//arrData = [[0xff0000, 0x00ff00, 0x0000ff], [0xffff00, 0xff0077, 0x541466], [0x666666, 0x999999, 0xcccccc], [0x000000]];
		//arrData = [[0xff0000, 0x00ff00, 0x0000ff], [0xffff00, 0xff0077], [0x999999, 0xcccccc]];
		//arrData = [[0xff0000, 0x00ff00], [0xffff00, 0xff0077]];
		/*let lenX: uint = 300;
		let lenY: uint = 300;
		arrData = new Array(lenX);
		for (let i:int = 0; i < lenX; i++) {
			arrData[i] = new Array(lenY);
			for (let j:int = 0; j < lenY; j++) {
				arrData[i][j] = Math.floor(Math.random() * 16777216);
			}
		}*/
		/*arrData = [[[0xff0000, 0x00ff00, 0x0000ff, 0x000000], [0xff0000, 0x00ff00, 0x0000ff, 0x000000], [0xff0000, 0x00ff00, 0x0000ff, 0x000000], [0xff0000, 0x00ff00, 0x0000ff, 0x000000]], 
		[[0xff00ff, 0x00ffff, 0xffff00, 0xff0077], [0xff00ff, 0x00ffff, 0xffff00, 0xff0077], [0xff00ff, 0x00ffff, 0xffff00, 0xff0077], [0xff00ff, 0x00ffff, 0xffff00, 0xff0077]],
		[[0x7700ff, 0xff0077, 0xff77ff, 0xff7777], [0x7700ff, 0xff0077, 0xff77ff, 0xff7777], [0x7700ff, 0xff0077, 0xff77ff, 0xff7777], [0x7700ff, 0xff0077, 0xff77ff, 0xff7777]], 
		[[0x333333, 0x666666, 0x999999, 0xcccccc], [0x333333, 0x666666, 0x999999, 0xcccccc], [0x333333, 0x666666, 0x999999, 0xcccccc], [0x333333, 0x666666, 0x999999, 0xcccccc]]];*/

		this.nameParamItem = MultiCircleGallery.BASE_NAME_PARAMETER_ID_ITEM_GALLERY + "_" + nameUnique; //ig_nameUnique
		this.optionsController = optionsController || new OptionsControllerMulti();
		this.optionsVisual = optionsVisual || new OptionsVisualMulti();
		this._setElem(nameUnique);
		this._prepareArrData();
		
		if (arrData && arrData.length) {
			this._arrData = arrData;
			if (this._arrData.length == 1) this.optionsController.isAutoChangeItem = false;
			this.createArrCountRenderableInRow();
			this.createItems();
			this._createRow();
			if (this.optionsController.isArrow) this._createArrArrows();
			this.createEventSelectItemChanged();
			this.createControllers();
			//setInterval(this.selectPrevNextItemInDimension, 2000, 1, 1);
			//setInterval(this.selectPrevNextItemInDimension, 1500, 0, 0);
			//setInterval(this.selectPrevNextItemInDimension, 1600, 1, 0);
		} else throw "no or empty data";
	}
	
	//arrData
	
	_setElem(nameUnique) {
		this.elem = document.getElementById(MultiCircleGallery.BASE_NAME_ELEMENT_DOM_GALLERY + "_" + nameUnique);
		if (!this.elem) {
			this.elem = document.createElement('div');
			document.body.appendChild(this.elem);
		}
	}
	
	_prepareArrData() {
		/*this._arrData 
		this.elem.getElementsByClassName(this.nameParamItem + "_row" );*/
		
		
	}
	
	//arrCountRenderableInRow
	
	createArrCountRenderableInRow() {
		this.arrCountRenderableInRow = this.getArrCountRenderableInRow();
	}
	
	getArrCountRenderableInRow() {
		return this._cloneArrData(this._arrData, 0, true);
	}
	
	//copy data into items
	
	_cloneArrData(srcData, numDimension, isForArrCountRenderableInRow, suffStrToIdWhenClone = "") {
		let cpData;
		if ((Array.isArray(srcData)) && (srcData.length)) {
			let lengthCpData = srcData.length;
			if (this instanceof MultiFlowGallery) {
				const minLengthArrItem = this.getMaxCountItemInDimension(numDimension);
				while (lengthCpData < minLengthArrItem) lengthCpData += srcData.length;
			}
			cpData = new Array(lengthCpData);
			//clone id, aby się nie powtarzały id gdy duplikujemy dane, aby wypełniły arrCountRenderable
			const addCharDimensionToIdWhenClone = MultiCircleGallery.ARR_CHAR_DIMENSION_TO_ID_WHEN_CLONE[numDimension];
			for (let i = 0; i < lengthCpData; i++)
				cpData[i] = this._cloneArrData(srcData[i % srcData.length], numDimension + 1, isForArrCountRenderableInRow, suffStrToIdWhenClone + addCharDimensionToIdWhenClone + String(i));
		} else {
			if (isForArrCountRenderableInRow) cpData = null;
			else {
				let idWithSuff;
				if ((srcData.propertyIsEnumerable("id")) && (!this._isEmptyIdItem(srcData.id))) idWithSuff = srcData.id + suffStrToIdWhenClone;
				else {
					idWithSuff = "gen" + String(this._idItemSequentGeneric++);
					srcData = {value: srcData, id: idWithSuff}; 
				}
				//console.log("id:", idWithSuff)
				if (!this.mapIdToIdWithSuff.get(srcData.id)) this.mapIdToIdWithSuff.set(srcData.id, idWithSuff);
				const classForItem = this.getClassForItem(srcData.id, srcData);
				//console.log("classForItem", this.getClassForItem, classForItem, srcData.id, srcData);
				let item = new classForItem(idWithSuff, this.nameParamItem, srcData);
				this.initItem(item);
				cpData = item;
			}
		}
		return cpData;
	}
	
	getMaxCountItemInDimension(numDimension) {
		return this.getMaxCountItemInDimensionInner(this._arrData, numDimension);
	};
	
	getMaxCountItemInDimensionInner(arrData, countLeftDimensionToExplore) {
		let maxCountItemInDimension = 0;
		if (countLeftDimensionToExplore == 0) maxCountItemInDimension = arrData.length;
		else if (countLeftDimensionToExplore > 0) {
			for (let i = 0; i < arrData.length; i++) {
				let objCountData = arrData[i];
				if (Array.isArray(objCountData))
					maxCountItemInDimension = Math.max(maxCountItemInDimension, this.getMaxCountItemInDimensionInner(objCountData, countLeftDimensionToExplore - 1));
			}
		}
		return maxCountItemInDimension;
	}
	
	//items

	createItems() {
		this.elemContainerItem = document.createElement("div");
		this.elem.appendChild(this.elemContainerItem);
		this._idItemSequentGeneric = 0;
		this.mapIdToIdWithSuff = new Map();
		this.arrItem = this._cloneArrData(this._arrData, 0, false);
	}
	
	getClassForItem(id, objData) {
		return MultiItemGallery;
	}
	
	initItem(item) {
		
	}
	
	_removeItems() {
		//this.removeItemsSub(this.arrItem);
		this.elem.removeChild(this.elemContainerItem);
		this.elemContainerItem = null;
	}
	
	/*_removeItemsSub(arrItem) {
		let subArrItem;
		let item;
		for (let i = 0; i < arrItem.length; i++) {
			subArrItem = arrItem[i];
			if ((Array.isArray(subArrItem)) && (subArrItem.length)) this._removeItemsSub(subArrItem);
			else this._removeItem(subArrItem);
		}
		arrItem = [];
	}
	
	_removeItem(item) {
		item.destroy();
		if (this.elemContainerItem.contains(item)) this.elemContainerItem.removeChild(item);
		item = null;
	}*/	
	
	//row
	
	_createRow() {
		this._arrOfArrRowInDimension = [[]];
		this._mapIdToArrNumInDimension = new Map();
		this.mapArrNumInDimensionToId = new Map();
		this._row = this._createRowSub(this.arrItem, []);
		this._row.setArrCountRenderableInRow(this.arrCountRenderableInRow);
	}
	
	get classRow() {
		return MultiRowCircleGallery;
	}
	
	getNumInRowForRenderableSelected(lengthArrCountRenderableInRow, arrNumInRow) {
		//let add = 0;
		//if ((arrNumInRow) && (arrNumInRow.length > 0)) add = arrNumInRow[arrNumInRow.length - 1]
		return Math.floor((lengthArrCountRenderableInRow - 1) / 2) //+ add;
	}
	
	_createRowSub(arrItem, arrNumInDimension) {
		const row = new this.classRow(this.getNumInRowForRenderableSelected, this.elemContainerItem, this.optionsVisual, this.optionsController);
		if (this._arrOfArrRowInDimension[arrNumInDimension.length].length == 0)
			this._createStylesForDimension(arrNumInDimension.length) //init style for first row in specified dimension
		this._arrOfArrRowInDimension[arrNumInDimension.length].push(row);
		let subArrItem;
		let subArrNumInDimension;
		let rendarable;
		let item;
		for (let i = 0; i < arrItem.length; i++) {
			subArrItem = arrItem[i];
			subArrNumInDimension = arrNumInDimension.concat([i]);
			if ((Array.isArray(subArrItem)) && (subArrItem.length)) {
				if (this._arrOfArrRowInDimension.length < subArrNumInDimension.length + 1) {
					this._arrOfArrRowInDimension.length = subArrNumInDimension.length + 1;
					this._arrOfArrRowInDimension[subArrNumInDimension.length] = [];
				}
				rendarable = this._createRowSub(subArrItem, subArrNumInDimension);
				rendarable.parentRow = row;
			} else {
				rendarable = subArrItem;
				item = rendarable;
				item.initRender(subArrNumInDimension);
				this._mapIdToArrNumInDimension.set(item.id, item.arrNumInDimension);
				this.mapArrNumInDimensionToId.set(item.arrNumInDimension.toString(), item.id);
			}
			row.arrRenderable[i] = rendarable;
		}
		row.initAfterSetArrRenderable(arrNumInDimension);
		return row;
	}
	
	_removeRow() {
		this._row.destroy();
		this._arrOfArrRowInDimension = null;
	}
	
	//styles
	
	_createStylesForDimension(numDimension) {
		let arrNameStyle = MapCssStyle.arrSuffixNameStyle.map(suffixNameStyle => this.nameParamItem + "_dimension_" + String(numDimension) + "_" + suffixNameStyle);
		let arrStyle = arrNameStyle.map(nameStyle => getStyleFromClass(nameStyle, this.elemContainerItem));
		let [styleStart, styleMiddle, styleEnd] = arrStyle;
		const setDefaultValuesOfProps = new Set([undefined, '', 'normal', 'none', 'auto']);
		arrStyle[0] = filterObj(styleStart, (nameProp, valProp) => {
			let isEqualEndValProp = (styleEnd[nameProp] == valProp);
			if (isEqualEndValProp) {
				delete styleMiddle[nameProp];
				delete styleEnd[nameProp];
			} else if (setDefaultValuesOfProps.has(styleMiddle[nameProp]))
				delete styleMiddle[nameProp];
			return !isEqualEndValProp;
		});
		
		
		
		/*let [nameStyleStart, nameStyleMiddle, nameStyleEnd] = arrNameStyle;
		let arrStyle = arrNameStyle.map(nameStyle => getStyleFromClass(nameStyle));
		*/
		
		let arrElemForStyle = arrNameStyle.map(nameStyle => {
			var elem = document.createElement("div");
			elem.style.display = "none";
			this.elemContainerItem.appendChild(elem);
			elem.className = nameStyle;
			return elem;
		});
		console.log("c",arrElemForStyle);
		
		
		//setTimeout(() => console.log("ssdd:", this.elemContainerItem.offsetHeight), 1000);
		/*window.addEventListener("scroll", () => {
			console.log("ssdd:", this.elem.getBoundingClientRect(), this.elem.offsetLeft, this.elem.offsetTop)
		});*/
		
		
		
		for (const [i, nameStyle] of arrNameStyle.entries())
			MapCssStyle.set(nameStyle, arrStyle[i]);
	}
	
	//////////changing Items//////////

	//event select item changed and gateway from swfaddress to change idItemSelected
	
	createEventSelectItemChanged() {
		if (!this._isCreatedEventSelectItemChanged) {
			this._isCreatedEventSelectItemChanged = true;
			StateModel.init();
			StateModel.addEventListener(EventStateModel.PARAMETERS_CHANGE, this.selectItem, 110);
			this.selectItem(null);
		}
	}

	removeEventSelectItemChanged() {
		if (this._isCreatedEventSelectItemChanged) {
			this._isCreatedEventSelectItemChanged = false;
			StateModel.removeEventListener(EventStateModel.PARAMETERS_CHANGE, this.selectItem);
		}
	}

	_isEmptyIdItem(idItemSelected) {
		return ((idItemSelected == null) || (String(idItemSelected) == "undefined") || (String(idItemSelected) == ""));
	}

	selectItem(e) {
		let idItemSelected = StateModel.parameters[this.nameParamItem];
		let arrNumInDimensionItemToSelect;
		if (!this._isEmptyIdItem(idItemSelected)) arrNumInDimensionItemToSelect = this._mapIdToArrNumInDimension.get(idItemSelected); //idItemSelected == null lub idItemSelected == "" lub inne
		//console.log("idItemSelected:", idItemSelected, arrNumInDimensionItemToSelect)
		if (!arrNumInDimensionItemToSelect) {
			//console.log("idItemSelected2:", idItemSelected, this.mapIdToIdWithSuff.get(idItemSelected));	
			if (!this._isEmptyIdItem(idItemSelected)) {
				const indCloneCharInId  = idItemSelected.indexOf(MultiCircleGallery.ARR_CHAR_DIMENSION_TO_ID_WHEN_CLONE[0]);
				if (indCloneCharInId > -1) idItemSelected = idItemSelected.substring(0, indCloneCharInId);
			}
			//console.log("idItemSelected3:", idItemSelected, this.mapIdToIdWithSuff.get(idItemSelected));	
			if ((this._isEmptyIdItem(idItemSelected)) || (this.mapIdToIdWithSuff.get(idItemSelected))) {
				if (!this.mapIdToIdWithSuff.get(idItemSelected)) idItemSelected = this.getIdItemDefault(); 
				idItemSelected = this.mapIdToIdWithSuff.get(idItemSelected);
				arrNumInDimensionItemToSelect = this._mapIdToArrNumInDimension.get(idItemSelected);
			} 
			//console.log("idItemSelected4:", idItemSelected, arrNumInDimensionItemToSelect);	
			if (!arrNumInDimensionItemToSelect) arrNumInDimensionItemToSelect = this.getArrNumInDimensionItemDefault();
			this.setCurrentSwfAddressValueWithId(arrNumInDimensionItemToSelect, 0);
		} else {
			if (idItemSelected != this.idItemSelected) {
				this.idItemSelected = idItemSelected;
				this._selectRenderablesInAllDimensions(arrNumInDimensionItemToSelect);
				if ((this.optionsController.isAutoChangeItem) && (!this._isSelectFromAuto)) this.waitAndSetAutoChangeItemOnItemChanged();
			}
		}
	}

	//item selected at start
	getIdItemDefault() {
		return "";
	}

	getArrNumInDimensionItemDefault() {
		const arrNumInDimensionItemDefault  = new Array(this._arrOfArrRowInDimension.length);
		arrNumInDimensionItemDefault.fill(0);
		return arrNumInDimensionItemDefault;
	}

	//set state of gallery from arrNumInDimension

	_selectRenderablesInAllDimensions(arrNumInDimension) {
		if (this.optionsController.isSelectSingleOrAllInDimension == 0) this._selectSingleRenderableInAllDimensions(arrNumInDimension);
		else if (this.optionsController.isSelectSingleOrAllInDimension == 1) this._selectAllRenderablesInAllDimensions(arrNumInDimension);
	}

	_selectSingleRenderableInAllDimensions(arrNumInDimension) {
		this._selectSingleRenderableInDimension(this._row, arrNumInDimension);
	}

	_selectSingleRenderableInDimension(rowToSelect, arrNumInDimension) {
		if (arrNumInDimension.length > 0) {
			const numInDimensionToSelect = arrNumInDimension[0];
			rowToSelect.numSelected = numInDimensionToSelect;
			if (arrNumInDimension.length > 1) this._selectSingleRenderableInDimension(rowToSelect.arrRenderable[numInDimensionToSelect], arrNumInDimension.slice(1));
		}
	}

	_selectAllRenderablesInAllDimensions(arrNumInDimension) {
		let arrRowInDimension;
		let addNumInDimensionToSelect;
		let rowToSelect = this._row;
		for (let i = 0; i < arrNumInDimension.length; i++) {
			arrRowInDimension = this._arrOfArrRowInDimension[i];
			addNumInDimensionToSelect = MathExt.minDiffWithSign(arrNumInDimension[i], rowToSelect.numSelected, rowToSelect.arrRenderable.length);
			for (let j = 0; j < arrRowInDimension.length; j++) {
				let rowInDimension = arrRowInDimension[j];
				rowInDimension.numSelected = MathExt.moduloPositive(rowInDimension.numSelected + addNumInDimensionToSelect, rowInDimension.arrRenderable.length) //numInDimension
			}
			if (i < arrNumInDimension.length - 1) rowToSelect = rowToSelect.arrRenderable[rowToSelect.numSelected];
		}
	}

	//controllers swfaddress changing items (obtain proper id and set swfaddress with it)

	setCurrentSwfAddressValueWithId(arrNumInDimensionItemToSelect, isFromDefaultMouseWheelAuto, isPrevNext = -1, numDimension = -1) {
		const idItemToSelect = this.mapArrNumInDimensionToId.get(arrNumInDimensionItemToSelect.toString());
		const objParamItem = {};
		objParamItem[this.nameParamItem] = idItemToSelect;
		$.address.setPathWithParameters({objParamsNewAndChanged: objParamItem});
	}

	selectPrevNextItemInDimension(isPrevNext, numDimension, idItemSelected = this.idItemSelected) {
		const arrNumInDimensionItemSelected = this._mapIdToArrNumInDimension.get(idItemSelected);
		if (numDimension < arrNumInDimensionItemSelected.length) {
			let rowInDimensionSelected = this._row;
			for (var i = 0; i < numDimension; i++) rowInDimensionSelected = rowInDimensionSelected.arrRenderable[arrNumInDimensionItemSelected[i]];
			let rowInDimensionToSelect = rowInDimensionSelected;
			const arrNumInDimensionItemToSelect = arrNumInDimensionItemSelected.concat();
			for (i = numDimension; i < arrNumInDimensionItemSelected.length; i++) {
				const numInDimensionSelected = arrNumInDimensionItemSelected[i];
				let numInDimensionToSelect;
				if (i == numDimension) numInDimensionToSelect = MathExt.moduloPositive(numInDimensionSelected + [-1, 1][isPrevNext], rowInDimensionSelected.arrRenderable.length);
				else numInDimensionToSelect = rowInDimensionSelected.numSelected;
				arrNumInDimensionItemToSelect[i] = numInDimensionToSelect;
				if (i < arrNumInDimensionItemSelected.length - 1) {
					rowInDimensionSelected = rowInDimensionSelected.arrRenderable[numInDimensionSelected];
					rowInDimensionToSelect = rowInDimensionToSelect.arrRenderable[numInDimensionToSelect];
				}
			}
			this.setCurrentSwfAddressValueWithId(arrNumInDimensionItemToSelect, 1, isPrevNext, numDimension);
		}
	}

	selectPrevNextItem(isPrevNext, idItemSelected = this.idItemSelected) {
		const arrNumInDimensionItemSelected = this._mapIdToArrNumInDimension.get(idItemSelected);
		const arrNumInDimensionItemToSelect = arrNumInDimensionItemSelected.concat();
		
		let rowInDimensionSelected = this._row;
		for (var i = 0; i < arrNumInDimensionItemSelected.length - 1; i++)
			rowInDimensionSelected = rowInDimensionSelected.arrRenderable[arrNumInDimensionItemSelected[i]];
		let numDimensionToChangeItemSelected = arrNumInDimensionItemSelected.length - 1;
		while ((rowInDimensionSelected) && (((isPrevNext == 0) && (rowInDimensionSelected.numSelected == 0)) || ((isPrevNext == 1) && (rowInDimensionSelected.arrRenderable) && (rowInDimensionSelected.numSelected == rowInDimensionSelected.arrRenderable.length - 1)))) {
			rowInDimensionSelected = rowInDimensionSelected.parentRow;
			numDimensionToChangeItemSelected--;
		}
		let numInDimensionToSelect;	
		if (rowInDimensionSelected == null) {
			rowInDimensionSelected = this._row;
			numDimensionToChangeItemSelected = 0;
			numInDimensionToSelect = [rowInDimensionSelected.arrRenderable.length - 1, 0][isPrevNext];
		} else numInDimensionToSelect = arrNumInDimensionItemSelected[numDimensionToChangeItemSelected] + [-1, 1][isPrevNext]; 
		arrNumInDimensionItemToSelect[numDimensionToChangeItemSelected] = numInDimensionToSelect; //rowInDimensionSelected.numSelected =
		for (i = numDimensionToChangeItemSelected + 1; i < arrNumInDimensionItemSelected.length; i++) {
			rowInDimensionSelected = rowInDimensionSelected.arrRenderable[numInDimensionToSelect];
			arrNumInDimensionItemToSelect[i] = [rowInDimensionSelected.arrRenderable.length - 1, 0][isPrevNext];
		}
		this.setCurrentSwfAddressValueWithId(arrNumInDimensionItemToSelect, 2, isPrevNext);
	}

	//controllers
		
	createControllers() {
		if (this._arrData.length > 1) {
			if (this.optionsController.isArrow) this._addEventsToArrArrows();
			//if (this.optionsController.isMouseWheel) this.initMouseWheel();
			if (this.optionsController.isAutoChangeItem) this.initAutoChangeItem();
		}
	}
	
	removeControllers() {
		if (this._arrData.length > 1) {
			if (this.optionsController.isAutoChangeItem) this.removeAutoChangeItem();
			//if (this.optionsController.isMouseWheel) this.removeMouseWheel();
			if (this.optionsController.isArrow) this._removeEventsFromArrArrows();
		}
	}
	//arrows
		
	getArrClassArrows() {
		return [];
	}
	
	_createArrArrows() {
		this.elemContainerArrArrows = document.createElement("div");
		this.elem.appendChild(this.elemContainerArrArrows);
		this._arrArrows = [];
		if (this._arrData.length > 1) {
			const arrClassArrows = this.getArrClassArrows();
			this._arrArrows = new Array(arrClassArrows.length);
			for (const [i, classArrows] of arrClassArrows.entries()) {
				const arrows = new classArrows(i, this);
				this.elemContainerArrArrows.appendChild(arrows.elem);
				this._arrArrows[i] = arrows;
			}
		}
	}
	
	_removeArrArrows() {
		for (const arrows of this._arrArrows) {
			arrows.dispose();
			this.elemContainerArrArrows.removeChild(arrows.elem);
			arrows = null;
		}
		this._arrArrows = [];
		this.elem.removeChild(this.elemContainerArrArrows);
		this.elemContainerArrArrows = null;
	}
	
	_addEventsToArrArrows() { 
		for (const arrows of this._arrArrows)
			arrows.addEventListener(ArrowsGalleryMulti.ON_ARROWS_RELEASED, this._onArrowsReleased);
	}
	
	_onArrowsReleased(e) {
		this.selectPrevNextItemInDimension(e.data.isPrevNext, e.data.dimension);
	}
	
	_removeEventsFromArrArrows() { 
		for (const arrows of this._arrArrows)
			arrows.removeEventListener(ArrowsGalleryMulti.ON_ARROWS_RELEASED, this._onArrowsReleased);
	}
	
	//automate change items
		
	initAutoChangeItem() {
		this.waitAndSetAutoChangeItemOnItemChanged();
	}
	
	waitAndSetAutoChangeItemOnItemChanged() {
		clearInterval(this._intervalChangeItem);
		clearTimeout(this._timeoutChangeItemFirstTime);
		this._timeoutChangeItemFirstTime = setTimeout(this.changeItemFirstTime, this.optionsController.timeChangeItemFirstTime);
	}
	
	changeItemFirstTime() {
		this.selectItemOnAuto();
		clearInterval(this._intervalChangeItem);
		this._intervalChangeItem = setInterval(this.selectItemOnAuto, this.optionsController.timeChangeItem);
	}
	
	selectItemOnAuto() {
		this._isSelectFromAuto = true;
		this.selectPrevNextItem(1);
		this._isSelectFromAuto = false;
	}
	
	removeAutoChangeItem() {
		clearInterval(this._intervalChangeItem);
		clearTimeout(this._timeoutChangeItemFirstTime);
	}
	
	//destroy
	
	destroy() {
		if ((this._arrData && this._arrData.length) && (this.stage)) {
			//this.removeControllers();
			this.removeEventSelectItemChanged();
			if (this.optionsController.isArrow) this._removeArrArrows();
			this._removeRow();
			this._removeItems();
		}
	}

}
MultiCircleGallery.BASE_NAME_ELEMENT_DOM_GALLERY = "gallery";
MultiCircleGallery.BASE_NAME_PARAMETER_ID_ITEM_GALLERY = "ig";
MultiCircleGallery.ARR_CHAR_DIMENSION_TO_ID_WHEN_CLONE = ["u", "v", "w", "x", "y", "z"];