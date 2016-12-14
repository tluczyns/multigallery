(function () {
  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   };

  CustomEvent.prototype = window.CustomEvent.prototype;

  window.CustomEvent = CustomEvent;
})();

/**********package vsm**********/

this.vsm = new function() {

	/** class ViewSectionManager **/
	
	var ViewSectionManager = new function() {
		
		function constructorFn() {
			throw "cannot construct object";
		};
		
		var _dictDescriptionViewSection;
		var _currIndSection = "";
		
		constructorFn.dspObjContainerSection;
		constructorFn.startIndSection = "";
		constructorFn.newIndSection = null;
		constructorFn.oldIndSection = null;
		
		constructorFn.isEngagingParallelViewSections = false;
		var isNotShowFirstViewSection;
		constructorFn.isForceRefresh;
		
		constructorFn.init = function(dspObjContainerSection, startIndSection, arrMetrics) {
			startIndSection = startIndSection || "";
			ViewSectionManager.dspObjContainerSection = dspObjContainerSection;
			ViewSectionManager.startIndSection = startIndSection || ViewSectionManager.startIndSection;
			arrMetrics = arrMetrics || [];
			/*for (var i: uint = 0; i < arrMetrics.length; i++) {
				var metrics: DisplayObject = arrMetrics[i];//
				dspObjContainerSection.addChild(metrics);
				metrics["parse"]();  
			}*/
			ModelSection.addEventListener(EventModelSection.START_CHANGE_SECTION, changeSection, -1);
			ModelSection.init();
		}
		
		constructorFn.addSectionDescription = function(descriptionViewSection) {
			//trace("addSectionDescription:", descriptionViewSection.ind)
			if (!_dictDescriptionViewSection) {
				_dictDescriptionViewSection = {};
				ViewSectionManager.startIndSection = ViewSectionManager.startIndSection || descriptionViewSection.ind;
			}
			_dictDescriptionViewSection[descriptionViewSection.ind] = descriptionViewSection;
		}
		
		constructorFn.removeSectionDescription(descriptionViewSection) {
			_dictDescriptionViewSection[descriptionViewSection.ind] = null;
		}
		
		var changeSection = function(e) {
			var newIndSection = String(e.data.newIndSection);
			newIndSection = ViewSectionManager.joinIndSectionFromArrElement(ViewSectionManager.splitIndSectionFromStr(newIndSection));
			if (!_dictDescriptionViewSection[newIndSection]) {
				if (newIndSection.charAt(newIndSection.length - 1) == "0") newIndSection = newIndSection.substring(0, newIndSection.length - 1); //normalizeNewIndSectionWhenOnlyOneDescriptionWithNum
			}
			//trace("changeSection:", newIndSection, _dictDescriptionViewSection[newIndSection], ViewSectionManager.currIndSection)
			//C.log("changeSection:" + newIndSection+ ", " +  _dictDescriptionViewSection[newIndSection] + ", " + ViewSectionManager.currIndSection)
			if ((_dictDescriptionViewSection) && (_dictDescriptionViewSection[newIndSection] != undefined)) {
				if ((newIndSection != ViewSectionManager.currIndSection) || (ViewSectionManager.isForceRefresh)) ViewSectionManager.oldIndSection = ViewSectionManager.currIndSection;
				isNotShowFirstViewSection = ((ViewSectionManager.newIndSection == null) && (ViewSectionManager.currIndSection != ""));
				ViewSectionManager.newIndSection = newIndSection;
				if (ViewSectionManager.currIndSection != "") ViewSectionManager.stopSection();
				else ViewSectionManager.startSection();
			}
		}
		
		constructorFn.startSection = function() {
			//trace("start:" + ViewSectionManager.currIndSection + ", " +  ViewSectionManager.newIndSection); //,isSetNewIndSectionToNullWhenEqualsCurrIndSection);
			//C.log("start:" + ViewSectionManager.currIndSection + ", " +  ViewSectionManager.newIndSection)
			ViewSectionManager.isForceRefresh = false;
			if (ViewSectionManager.newIndSection != null) {
				if (ViewSectionManager.currIndSection != ViewSectionManager.newIndSection) {
					var arrElementCurrIndSection = ViewSectionManager.splitIndSectionFromStr(ViewSectionManager.currIndSection);
					var arrElementNewIndSection = ViewSectionManager.splitIndSectionFromStr(ViewSectionManager.newIndSection);
					//arrNew nie może być krótsze niż arrCurr
					arrElementCurrIndSection.push(arrElementNewIndSection[arrElementCurrIndSection.length]);
					ViewSectionManager.currIndSection = ViewSectionManager.joinIndSectionFromArrElement(arrElementCurrIndSection);
					var descriptionViewSectionNew = _dictDescriptionViewSection[ViewSectionManager.currIndSection];
					if (descriptionViewSectionNew != null) {
						descriptionViewSectionNew.createViewSection();
						descriptionViewSectionNew.viewSection.show();
					} else {
						ViewSectionManager.startSection();
					}
				} else {
					var newIndSection = ViewSectionManager.newIndSection;
					ViewSectionManager.newIndSection = null;
					ModelSection.dispatchEvent(EventModelSection.CHANGE_SECTION, {oldIndSection: ViewSectionManager.oldIndSection, newIndSection: newIndSection}); 
				}
			}
		}
		
		constructorFn.stopSection = function() {
			//trace("stop:"+ViewSectionManager.currIndSection +", " +  ViewSectionManager.newIndSection, isNotShowFirstViewSection, ViewSectionManager.isForceRefresh);
			//C.log("stop:" + ViewSectionManager.currIndSection + ", " +  ViewSectionManager.newIndSection)
			var descriptionViewSectionCurrent = DescriptionViewSection(_dictDescriptionViewSection[ViewSectionManager.currIndSection]);
			if (((ViewSectionManager.isNewEqualsCurrentElementsIndSection()) || (ViewSectionManager.newIndSection == null)) && (!ViewSectionManager.isForceRefresh)) {
				if ((descriptionViewSectionCurrent != null) && (descriptionViewSectionCurrent.viewSection != null) && (!isNotShowFirstViewSection)) descriptionViewSectionCurrent.viewSection.show();
				else {
					isNotShowFirstViewSection = false;
					ViewSectionManager.startSection();
				}
			} else {
				isNotShowFirstViewSection = false;
				var indSectionNext = ViewSectionManager.getSubstringIndSection(0, ViewSectionManager.getLengthIndSection() - 1);
				if ((isEngagingParallelViewSections) && (ViewSectionManager.isEqualsElementsIndSection(indSectionNext, ViewSectionManager.newIndSection)) && (ViewSectionManager.getLengthIndSection(ViewSectionManager.newIndSection) > ViewSectionManager.getLengthIndSection(indSectionNext))) {
					//if (ViewSectionManager.descriptionViewSectionEngaged) 
					DescriptionViewSection(_dictDescriptionViewSection[ViewSectionManager.currIndSection]).isEngaged = true;
				}	
				if (DescriptionViewSection(_dictDescriptionViewSection[ViewSectionManager.currIndSection]).isEngaged) {
					ViewSectionManager.currIndSection = indSectionNext;
					ViewSectionManager.startSection();
				}
				if ((descriptionViewSectionCurrent != null) && (descriptionViewSectionCurrent.viewSection != null))
					descriptionViewSectionCurrent.viewSection.hide();
				else ViewSectionManager.finishStopSection();
			}
		}
		
		constructorFn.finishStopSection = function(descriptionViewSectionToDelete) {
			//trace("finishStop:"+ViewSectionManager.currIndSection +", " +  ViewSectionManager.newIndSection);
			//C.log("finishStop:" + ViewSectionManager.currIndSection + ", " +  ViewSectionManager.newIndSection)
			ViewSectionManager.isForceRefresh = false;
			if (!descriptionViewSectionToDelete) descriptionViewSectionToDelete = DescriptionViewSection(_dictDescriptionViewSection[ViewSectionManager.currIndSection]);
			if (descriptionViewSectionToDelete != null) descriptionViewSectionToDelete.removeViewSection();
			if ((!descriptionViewSectionToDelete) || (!descriptionViewSectionToDelete.isEngaged)) {
				var arrElementCurrIndSection = ViewSectionManager.splitIndSectionFromStr(ViewSectionManager.currIndSection);
				arrElementCurrIndSection.splice(arrElementCurrIndSection.length - 1, 1);
				ViewSectionManager.currIndSection = ViewSectionManager.joinIndSectionFromArrElement(arrElementCurrIndSection);
				if (ViewSectionManager.isNewEqualsCurrentElementsIndSection()) ViewSectionManager.startSection();
				else ViewSectionManager.stopSection();
			} else descriptionViewSectionToDelete.isEngaged = false;
		}
		
		var isNewEqualsCurrentElementsIndSection = function() {
			return ViewSectionManager.isEqualsElementsIndSection(ViewSectionManager.currIndSection, ViewSectionManager.newIndSection);
		}
		
		//czy current jest zawarty w new
		constructorFn.isEqualsElementsIndSection = function(parCurrIndSection, parNewIndSection) {
			var arrElementCurrIndSection = ViewSectionManager.splitIndSectionFromStr(parCurrIndSection);
			var arrElementNewIndSection = ViewSectionManager.splitIndSectionFromStr(parNewIndSection);
			var i = 0;
			while ((i < arrElementCurrIndSection.length) && (i < arrElementNewIndSection.length) && (arrElementCurrIndSection[i] == arrElementNewIndSection[i])) i++;
			return ((i >= arrElementCurrIndSection.length))//|| (ViewSectionManager.currIndSection == ""));
		}
		
		constructorFn.getEqualsElementsIndSection = function(parCurrIndSection, parNewIndSection) {
			var arrElementCurrIndSection = ViewSectionManager.splitIndSectionFromStr(parCurrIndSection);
			var arrElementNewIndSection = ViewSectionManager.splitIndSectionFromStr(parNewIndSection);
			var i = 0;
			while ((i < arrElementCurrIndSection.length) && (i < arrElementNewIndSection.length) && (arrElementCurrIndSection[i] == arrElementNewIndSection[i])) i++;
			if (i >= arrElementCurrIndSection.length) return ViewSectionManager.joinIndSectionFromArrElement(arrElementNewIndSection.slice(0, i));
			else return "";
		}
		
		constructorFn.joinIndSectionFromArrElement = function(arrElementIndSection) {
			var strIndSection = arrElementIndSection.join("/");
			if (strIndSection.charAt(0) == "/") strIndSection = strIndSection.substring(1, strIndSection.length);
			if (strIndSection.charAt(strIndSection.length - 1) == "/") strIndSection = strIndSection.substring(0, strIndSection.length - 1);
			return strIndSection;
		}
		
		constructorFn.splitIndSectionFromStr = function(strIndSection) {
			var arrElementIndSection;
			if (strIndSection == null) arrElementIndSection = [];
			else arrElementIndSection = strIndSection.split("/");
			if ((arrElementIndSection.length == 1) && (arrElementIndSection[0] == "")) arrElementIndSection = [];
			return arrElementIndSection;
		}
		
		Object.defineProperty(constructorFn, "dictDescriptionViewSection", {get: function() {
			return _dictDescriptionViewSection;
		}});
		
		constructorFn.getCurrentDescriptionViewSection = function() {
			return ViewSectionManager.dictDescriptionViewSection[ViewSectionManager.currIndSection];
		}
		
		Object.defineProperty(constructorFn, "currIndSection", {get: function() {
			return _currIndSection;
		}})
		
		Object.defineProperty(
		
		public static function set currIndSection(value: String): void {
			if (value != _currIndSection) {
				var oldIndSection: String = _currIndSection;
				_currIndSection = value;
				ModelSection.dispatchEvent(EventModelSection.CHANGE_CURR_SECTION, {currIndSection: value, oldIndSection: oldIndSection, newIndSection: value}); 
			}
		}
		
		
		return constructorFn;
	};
	

	
/*	

		
		
		
		
		
		
		
		
		
		
		
		public static function getElementIndSection(numElement: uint, indSection: String = null): String {
			if (indSection == null) indSection = ViewSectionManager.currIndSection;
			var arrElementIndSection: Array = ViewSectionManager.splitIndSectionFromStr(indSection);
			var strElementIndSection: String = "";
			if (numElement < arrElementIndSection.length) strElementIndSection = arrElementIndSection[numElement];
			return strElementIndSection;
		}
		
		public static function getLengthIndSection(indSection: String = null): uint {
			if (indSection == null) indSection = ViewSectionManager.currIndSection;
			return ViewSectionManager.splitIndSectionFromStr(indSection).length;
		}
		
		public static function getSubstringIndSection(start: uint = 0, length: int = -1, indSection: String = null): String {
			if (indSection == null) indSection = ViewSectionManager.currIndSection;
			if (length == -1) length = ViewSectionManager.getLengthIndSection(indSection);
			var substringIndSection: String = "";
			for (var i: uint = start; i < start + length; i++)
				substringIndSection += (ViewSectionManager.getElementIndSection(i, indSection) + ["/", ""][uint(i == start + length - 1)]);
			return substringIndSection;
		}
		
	}*/


	/** class ModelSection **/
	
	var ModelSection = new function() {
		var modelDispatcher = document.createElement("div");
		var _parameters	= {};
		function constructorFn() {
			throw "cannot construct object";
		};
		constructorFn.gaTracker;
		constructorFn.omnitureTracker;
		constructorFn.init = function() {
			if (!SWFAddress.hasEventListener(SWFAddressEvent.CHANGE))
				SWFAddress.addEventListener(SWFAddressEvent.CHANGE, handleSWFAddress);
		};
		constructorFn.addEventListener = function(type, func) {
			modelDispatcher.addEventListener(type, func, false);
		}
		constructorFn.removeEventListener = function(type, func) {
			modelDispatcher.addEventListener(type, func, false);
		}
		constructorFn.dispatchEvent = function(type, data) {
			modelDispatcher.dispatchEvent(new EventModelSection(type, data));
		}
		Object.defineProperty(constructorFn, "parameters", {get: function() {
			return _parameters;
		}});
		constructorFn.trackPageview = function(indPage) {
			//if (ModelSection.gaTracker) ModelSection.gaTracker["trackPageview"](indPage);
			//if (ModelSection.omnitureTracker) ModelSection.omnitureTracker["trackPageview"](indPage);
		}
		var handleSWFAddress = function() {
			/*var currentSwfAddressValue = SWFAddress.getValue();
			if ((currentSwfAddressValue != ModelSection.currentSwfAddressValue) || (ViewSectionManager.isForceReload)) {*/
			var oldParameters = _parameters;
			_parameters = SWFAddress.getParametersObject();
			var currentSwfAddressPath = SWFAddress.getPath();
			trace("ddddSWFAddress.getValue():", SWFAddress.getValue())
			var indSectionAlias = ViewSectionManager.joinIndSectionFromArrElement(ViewSectionManager.splitIndSectionFromStr(currentSwfAddressPath));
			var indSection;
			/*if ((LoaderXMLContentViewSection.dictAliasIndToIndSection) && (LoaderXMLContentViewSection.dictAliasIndToIndSection[indSectionAlias])) indSection = LoaderXMLContentViewSection.dictAliasIndToIndSection[indSectionAlias];
			else */indSection = indSectionAlias;
			/*if ((indSection != "") && (indSection != ViewSectionManager.currIndSection)) {
				var descriptionViewSection: DescriptionViewSection = ViewSectionManager.dictDescriptionViewSection[indSection];
				if ((descriptionViewSection) && (descriptionViewSection is DescriptionViewSectionWithContent)) {
					var contentViewSection: ContentViewSection = DescriptionViewSectionWithContent(descriptionViewSection).content;
					if ((!uint(contentViewSection.isNotOmniture)) && (!((uint(contentViewSection.isOnlyForwardOmniture)) && (ViewSectionManager.isEqualsElementsIndSection(indSection, ViewSectionManager.currIndSection)))))
						ModelSection.trackPageview(indSectionAlias);
				}
			}*/
			if ((indSection == "") && (ViewSectionManager.startIndSection != "")) SWFAddress.setValue(ViewSectionManager.startIndSection);
			else ModelSection.dispatchEvent(EventModelSection.START_CHANGE_SECTION, {oldIndSection: ViewSectionManager.currIndSection, newIndSection: indSection});
			ModelSection.dispatchEvent(EventModelSection.PARAMETERS_CHANGE, {oldParameters: oldParameters, oldIndSection: ViewSectionManager.currIndSection, newIndSection: indSection});
		}
		return constructorFn;
	};
	
	/** class EventModel **/
	
	var EventModel = new function() {
		function constructorFn(type, data, bubbles) {
			bubbles = bubbles || false;
			CustomEvent.call(this, type, {detail: data, bubbles: bubbles});
			var _data = data;
			Object.defineProperty(this, "data", {get: function() {
				return _data;
			}});
			this.clone = function() { 
				return new EventModel(type, this._data, bubbles);
			}
		}
		constructorFn.inheritsFrom(CustomEvent);
		return constructorFn;
	};
	
	/** class EventModelSection **/
	
	var EventModelSection = new function() {
		function constructorFn(type, data) {
			EventModel.call(this, type, data);
		}
		constructorFn.START_CHANGE_SECTION = "startChangeSection";
		constructorFn.CHANGE_SECTION = "changeSection";
		constructorFn.CHANGE_CURR_SECTION = "changeCurrSection";
		constructorFn.PARAMETERS_CHANGE = "parametersChange";
		constructorFn.inheritsFrom(EventModel);
		return constructorFn;
	};
	
	
	return {
		ViewSectionManager: ViewSectionManager,
		ModelSection: ModelSection,
		EventModel: EventModel,
		EventModelSection: EventModelSection,
	}
	
}

vsm.ViewSectionManager.init(window, "marian");
//SWFAddress.setValueWithParameters("szczepan", {parA: 1, parB: 2})
trace("SWFAddress", SWFAddress.getCurrentSwfAddress())