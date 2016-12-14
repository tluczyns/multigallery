import $ from 'jquery-address'

$.address.CHANGE = "change";

$.address.once = function(event, handler) {
	return this.unbind(event, handler).bind(event, handler);
};

$.address.getParametersObject = function() {
	var arrParamName = this.parameterNames();
	var parameters = {};
	for (var i = 0; i < arrParamName.length; i++) {
		parameters[arrParamName[i]] = this.parameter(arrParamName[i]);
	}
	return parameters;
}

$.address.getPath = function(value) {
	if (value == undefined) value = this.value();
	return value.split('#')[0].split('?')[0];
}

$.address.getParametersString = function(objParams) {
	var strParameters = "";
	if (objParams == undefined) strParameters = "?" + this.queryString();
	else {
		var i = 0;
		for (var nameParam in objParams) strParameters += (["?", "&"][Number(i++ > 0)] + nameParam + "=" + objParams[nameParam]);
	}
	return strParameters;
}

$.address.setPathWithParameters = function({value, objParamsNewAndChanged = {}, isReplaceParams = false}) { //the same as setValueWithCurrentParameters({value})  setValueWithParameters setCurrentPathWithParameters({objParamsNewAndChanged}) setCurrentSwfAddressValueWithParameters({objParamsNewAndChanged}) setValueWithCurrentParameters({objParamsNewAndChanged})
	var objParamsCurrent;
	if (isReplaceParams) objParamsCurrent = objParamsNewAndChanged;
	else {
		objParamsCurrent = this.getParametersObject();
		for (var prop in objParamsNewAndChanged)
			objParamsCurrent[prop] = objParamsNewAndChanged[prop];
	}
	const oldValue = this.value();
	const path = ((value == undefined) ? this.path() : this.getPath(value));
	const newValue = path + this.getParametersString(objParamsCurrent);
	this.value(newValue);
	//if ((newValue == oldValue) && (ManagerSection.isForceRefresh)) 
	//	 $(this).trigger("change");
}

$.address.refreshView = function() {
	//ManagerSection.isForceRefresh = true;
	this.setPathWithParameters({objParamsNewAndChanged: {refresh: Math.floor(Math.random() * 1000000)}});
}

export default $;