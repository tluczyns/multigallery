import Abstract from 'base/types/Abstract.js'
import EventStateModel from 'base/vspm/EventStateModel.js'
import $ from 'base/vspm/jquery.address.addons.js';
import {EventDispatcher} from 'base/events/EventReceiverDispatcher.js'

//import com.google.analytics.GATracker;

let StateModel  = (() => {
	let dispatcher = Symbol();
	let parameters = Symbol();

	class StateModel extends Abstract {
		
		static init() {
			$.address.once($.address.CHANGE, StateModel.handleSWFAddress);
		}
		
		static addEventListener(type, func, priority = 0) {
			StateModel[dispatcher].addEventListener(type, func, priority);
		}
		
		static removeEventListener(type, func) {
			StateModel[dispatcher].removeEventListener(type, func);
		}
		
		static dispatchEvent(type, data = {}) {
			StateModel[dispatcher].dispatchEvent(new EventStateModel(type, data));
		}
		
		static get parameters() { 
			return StateModel[parameters];
		}
		
		static trackPageview(indPage) {
			//console.log("trackPageview:", indPage)
			if (StateModel.gaTracker) StateModel.gaTracker["trackPageview"](indPage);
		}
		
		static handleSWFAddress(e) {
			/*var currentSwfAddressValue: String = SWFAddress.getValue();
			if ((currentSwfAddressValue != StateModel.currentSwfAddressValue) || (ManagerSection.isForceReload)) {*/
			var oldParameters = StateModel[parameters];
			StateModel[parameters] = $.address.getParametersObject();
			/*var currentSwfAddressPath: String = SWFAddress.getPath();
			//console.log("SWFAddress.getValue():", SWFAddress.getValue())
			var indSectionAlias: String = ManagerSection.joinIndSectionFromArrElement(ManagerSection.splitIndSectionFromStr(currentSwfAddressPath));
			var indSection: String;
			if ((LoaderXMLContentView.dictAliasIndToIndSection) && (LoaderXMLContentView.dictAliasIndToIndSection[indSectionAlias])) indSection = LoaderXMLContentView.dictAliasIndToIndSection[indSectionAlias];
			else indSection = indSectionAlias;
			if ((indSection != "") && (indSection != ManagerSection.currIndSection)) {
				var descriptionViewSection: DescriptionViewSection = ManagerSection.dictDescriptionViewSection[indSection];
				if (descriptionViewSection) {
					var contentViewSection: ContentViewSection = ContentViewSection(descriptionViewSection.content);
					if ((contentViewSection) && (!uint(contentViewSection.isNotTrack)) && (!((uint(contentViewSection.isOnlyForwardTrack)) && (ManagerSection.isEqualsElementsIndSection(indSection, ManagerSection.currIndSection)))))
						StateModel.trackPageview(indSectionAlias);
				}
			}
			if ((indSection == "") && (ManagerSection.startIndSection != "")) SWFAddress.setValue(ManagerSection.startIndSection);
			else StateModel.dispatchEvent(EventStateModel.START_CHANGE_SECTION, {oldIndSection: ManagerSection.currIndSection, newIndSection: indSection});*/
			StateModel.dispatchEvent(EventStateModel.PARAMETERS_CHANGE, {oldParameters: oldParameters/*, oldIndSection: ManagerSection.currIndSection, newIndSection: indSection*/});
		}
		
	}
	
	StateModel[dispatcher] = new EventDispatcher();
	StateModel[parameters] = {};
	StateModel.gaTracker;

	return StateModel;
})();

export default StateModel;