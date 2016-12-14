import $ from 'base/vspm/jquery.address.addons.js';

const onAddressChange = function(e) {
	console.log("change called:", e)
}
$.address.once('change', onAddressChange);
$($.address).trigger("change");

console.log(`value: ${$.address.value()}, 
path: ${$.address.path()},
pathNames: ${$.address.pathNames()},
parameterNames: ${$.address.parameterNames()},
hash: ${$.address.hash()},
queryString: ${$.address.queryString()},
state: ${$.address.state()},
baseURL: ${$.address.baseURL()},
autoUpdate: ${$.address.autoUpdate()},
history: ${$.address.history()},
frames: ${$.address.frames()},
strict: ${$.address.strict()},
tracker: ${$.address.tracker()},
wrap: ${$.address.wrap()},
title: ${$.address.title()}`);

$.address.setPathWithParameters({value: "foo", objParamsNewAndChanged: {kk: "vkk", ll: "vll"}});
$.address.setPathWithParameters({objParamsNewAndChanged: {ll: "vll2", mm: "vmm"}, isReplaceParams: true});
$.address.setPathWithParameters({isReplaceParams: true});
$.address.setPathWithParameters({value: "bar", objParamsNewAndChanged: {kk: "vkk", ll: "vll"}});
$.address.setPathWithParameters({objParamsNewAndChanged: {ll: "vll2", mm: "vmm"}});
$.address.setPathWithParameters({value: "test"});
console.log($.address.getPath(), $.address.getParametersObject(), $.address.getParametersString());