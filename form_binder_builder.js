steal.plugins(
	'jquery/class',
	'jquery/view',
	'jquery/view/ejs'
).then(function(){
	$.Class.extend('FormBinderBuilder', {
		getBuilder : function(model){
			return new FormBinderBuilder(model);
		}
	}, {
		init : function(model){
			this.model = model;
		},
		bindForm : function(){
			var self = this;
			return function( el ) {
				$(el).form_binder({model: self.model});
			};
		},
		inputs : function(){
			var inputs = [];
			var fields = [];
			var modelAttrs = this.model.Class.attributes;
			var renderFields = $.makeArray(arguments);
			if(renderFields.length != 0){
				for(var i = 0; i < renderFields.length; i++){
					fields.push(renderFields[i])
				}
			} else {
				for(var k in modelAttrs){
					if(modelAttrs.hasOwnProperty(k)){
						fields.push(k)
					}
				}
			}
			for(var i = 0; i < fields.length; i++){
				inputs.push(this.input(fields[i]))
			}
			return inputs.join('');
		},
		input : function(field, options){
			var opts      = options || {};
			var name      = $.String.sub("{model.Class._shortName}[{field}]", {model: this.model, field: field});
			var id        = $.String.sub("{model.Class._shortName}_{field}", {model: this.model, field: field});
			var value     = this.model.attr(field) || null;
			
			var fieldType = opts.as || this.model.Class.attributes[field] || 'string';
			if(fieldType == 'array') 
				fieldType = 'checkboxGroup';
			
			opts = $.extend(opts, {id: id, name: name, value: value, field: field, model: this.model});
			if(typeof opts.label == 'undefined') 
				opts.label = $.String.niceName(field);
			
			var hint = opts.hint || null;
			
			return $.View('views/wrappers/' + this._templateMethod(fieldType).apply(this), {
				input: this._renderMethod(fieldType).call(this, opts),
				fieldType : fieldType,
				fieldId : id,
				label : $.String.niceName(field),
				hint : hint
			});
		},
		_renderMethod : function(f){
			return (typeof this['_'+f+'Input'] != 'undefined') ? this['_'+f+'Input'] : this['_stringInput'];
		},
		_templateMethod : function(f){
			return (typeof this['_'+f+'Template'] != 'undefined') ? this['_'+f+'Template'] : this._stringTemplate;
		},
		_passwordInput : function(opts){
			return $.View('views/inputs/password', opts);
		},
		_stringInput : function(opts){
			return $.View('views/inputs/string', opts);
		},
		_textInput : function(opts){
			return $.View('views/inputs/textarea', opts);
		},
		_booleanInput : function(opts){
			return $.View('views/inputs/boolean', opts);
		},
		_radioGroupInput : function(opts){
			opts.values  = opts.values || opts.model.Class['valuesFor' + $.String.capitalize(opts.field)];
			if($.isFunction(opts.values)) opts.values = opts.values(opts.model);
			return $.View('views/inputs/radio_group', opts);
		},
		_checkboxGroupInput : function(opts){
			opts.values  = opts.values || opts.model.Class['valuesFor' + $.String.capitalize(opts.field)];
			if($.isFunction(opts.values)) opts.values = opts.values(opts.model);
			opts.value = opts.value || [];
			if($.isFunction(opts.values)) opts.values = opts.values(opts.model);
			return $.View('views/inputs/checkbox_group', opts);
		},
		_selectInput : function(opts){
			var select  = '<select name="' + opts.name + '" id="' + opts.id + '">';
			var values  = opts.values || opts.model.Class['valuesFor' + $.String.capitalize(opts.field)];
			if($.isFunction(values)) values = values(opts.model);
			opts.values = values;
			return $.View('views/inputs/select', opts);
		},
		_booleanTemplate : function(){
			return 'boolean_checkbox_radio'; 
		},
		_checkboxGroupTemplate : function(){
			return 'boolean_checkbox_radio'; 
		},
		_radioTemplate : function(){
			return 'boolean_checkbox_radio'; 
		},
		_stringTemplate : function(){
			return 'generic';
		}
	});
	$.extend($.EJS.Helpers.prototype, {form_builder : FormBinderBuilder.getBuilder});
})