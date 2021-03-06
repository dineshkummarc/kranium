/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(global){
	
	K.classes = {};
	K.loadClass = function(name, liveKlass){
		var klass, cls;
		if(global.DEBUG || liveKlass || !(klass = K.classes[name])){
			if(!liveKlass){ K.loadStyle(name); }
			//klass = liveKlass||(exports = {}, Ti.include('kui/' + name + '.js'), exports.Class);
			klass = liveKlass || (require('kui/' + name)).Class;
			cls = klass.prototype.className;
			klass.prototype.className = cls ? cls + ' ' + name : name;
			klass.prototype._klass = name;
			
			K.classes[name] = klass;
		}
		return klass;
	};


	var initializing = false,
		fnTest = /xyz/.test(function() {xyz;}) ? /\b_super\b/ : /.*/;

	// The base Class implementation (does nothing)
	this.Class = function() {};

	// Create a new Class that inherits from this class
	Class.extend = function(prop, o) {
		// Extended with autoloading
		if (typeof prop === 'string' && o) {
			return K.loadClass(prop).extend(o);
		}

		var _super = this.prototype;
		//K.log('got prop', { prop: prop, o: o });

		// Instantiate a base class (but only create the instance,
		// don't run the init constructor)
		initializing = true;
		var prototype = new this();
		initializing = false;

		// Copy the properties over onto the new prototype
		for (var name in prop) {
			// Check if we're overwriting an existing function
			prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ? (function(name, fn) {
				return function() {
					var tmp = this._super;

					// Add a new ._super() method that is the same method
					// but on the super-class
					this._super = _super[name];

					// The method only need to be bound temporarily, so we
					// remove it when we're done executing
					var ret = fn.apply(this, arguments);
					this._super = tmp;

					return ret;
				};
			})(name, prop[name]) : prop[name];
		}

		// The dummy class constructor
		// Slight modification to set init return value to default el
		var el;


		function Class(o) {
			// All construction is actually done in the init method
			if (!initializing && this.init) {
				o && K.extend(this, o);
				(el = this.init.apply(this, arguments)) && !this.el && (this.el = el);
			}
		}

		// Populate our constructed prototype object
		Class.prototype = prototype;

		// Enforce the constructor to be what we expect
		Class.constructor = Class;

		// And make this class extendable
		Class.extend = arguments.callee;

		return Class;
	};

})(this);