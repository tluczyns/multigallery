const trace = console.log.bind(console);

let aggregation = (baseClass, ...mixins) => {
	let copyProps = (source, target) => {
		Object.getOwnPropertyNames(source).concat(Object.getOwnPropertySymbols(source)).forEach((prop) => {
			if ((typeof prop != "symbol") && (prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/)))
				return
			Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop))
		})
	}
	let base = class _Combined extends baseClass {
		constructor (...args) {
			super(...args)
			mixins.forEach((mixin) => {
				copyProps(new mixin(), this)
				//mixin.prototype.initializer.call(this)
			})
		}
	}
	mixins.forEach((mixin) => {
		copyProps(mixin.prototype, base.prototype)
		copyProps(mixin, base)
	})
	return base;
};

let filterObj = (obj, predicate) => 
    Object.keys(obj)
          .filter(key => predicate(key, obj[key]))
          .reduce((res, key) => (res[key] = obj[key], res), {});

export {trace, aggregation, filterObj}