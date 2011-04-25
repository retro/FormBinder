steal.plugins(
	'jquery/class',
	'jquery/view/ejs'
).then(function(){
	$.Class.extend('FormBinderManager', {
		getFormBinder : function(model){
			return new FormBinderManager(model);
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
			var fieldType = opts.as || this.model.Class.attributes[field];
			if(fieldType == 'array') fieldType = 'checkboxGroup';
			var method    = (typeof this['_' + fieldType + 'Input'] != 'undefined') ? this['_' + fieldType + 'Input'] : this['_stringInput'];
			var templateMethod = (typeof this['_' + fieldType + 'Template'] != 'undefined') ? this['_' + fieldType + 'Template'] : this['_stringTemplate'];
			var template  = templateMethod();
			delete opts.as;
			return $.String.sub(template, {
				input : method($.extend(opts, {id: id, name: name, value: value, field: field, label: $.String.niceName(field), model: this.model})),
				fieldType : fieldType,
				fieldId : id,
				label : $.String.niceName(field)
			})
		},
		_stringInput : function(opts){
			var template = '<input type="text" id="{id}" name="{name}" value="';
			if(opts.value){
				template += "{value}";
			}
			template += '" />';
			return $.String.sub(template, opts);
		},
		_textInput : function(opts){
			var template = '<textarea id="{id}" name="{name}">';
			if(opts.value){
				template += "{value}";
			}
			template += '</textarea>';
			return $.String.sub(template, opts);
		},
		_booleanInput : function(opts){
			var template = '<label><input type="checkbox" id="' + opts.id + '" name="' + opts.name +'" value="true"';
			if(opts.model.attr(opts.field) === true){
				templat += ' checked';
			}
			template  += ' /><input type="hidden" name="' + opts.name + '" value="false" />' + opts.label + '</label>';
			return template;
		},
		_radioInput : function(opts){
			var values  = opts.values || opts.model.Class['valuesFor' + $.String.capitalize(opts.field)];
			if($.isFunction(values)) values = values(opts.model);
			var options = []; 
			if(typeof values != 'undefined'){
				for(var i = 0; i < values.length; i++){
					var option = '<label><input type="radio" name="' + opts.name + '" value="' + values[i][0] +'"'
					if(values[i][0] == opts.value){
						option += " checked";
					}
					option += " />" + values[i][1] + '</label>';
					options.push(option);
				}
			}
			return options.join('');
		},
		_checkboxGroupInput : function(opts){
			var values  = opts.values || opts.model.Class['valuesFor' + $.String.capitalize(opts.field)];
			if($.isFunction(values)) values = values(opts.model);
			var options = []; 
			var value   = opts.value || [];
			if(typeof values != 'undefined'){
				for(var i = 0; i < values.length; i++){
					var v = values[i];
					if(typeof v == 'string') v = [v, v];
					var option = '<label><input type="checkbox" name="' + opts.name + '[]" value="' + v[0] +'"';
					if($.inArray(v[0], value) > -1){
						option += " checked";
					}
					option += " />" + v[1] + '</label>';
					options.push(option);
				}
			}
			return options.join('');
		},
		_selectInput : function(opts){
			var select  = '<select name="' + opts.name + '" id="' + opts.id + '">';
			var values  = opts.values || opts.model.Class['valuesFor' + $.String.capitalize(opts.field)];
			if($.isFunction(values)) values = values(opts.model);
			var options = []; 
			if(typeof values != 'undefined'){
				for(var i = 0; i < values.length; i++){
					var option = '<option value="' + values[i][0] +'"'
					if(values[i][0] == opts.value){
						option += " selected";
					}
					option += ">" + values[i][1] + '</option>';
					options.push(option);
				}
			}
			return select + options.join('') + '</select>';
		},
		_booleanTemplate : function(){
			return '<div class="{fieldType} input-wrapper">{input}<div class="errors"></div></div>'; 
		},
		_checkboxGroupTemplate : function(){
			return '<div class="{fieldType} input-wrapper">{input}<div class="errors"></div></div>'; 
		},
		_radioTemplate : function(){
			return '<div class="{fieldType} input-wrapper">{input}<div class="errors"></div></div>'; 
		},
		_stringTemplate : function(){
			return '<div class="{fieldType} input-wrapper"><label for="{fieldId}">{label}</label>{input}<div class="errors"></div></div>';
		}
	});
	$.extend($.EJS.Helpers.prototype, {form_binder : FormBinderManager.getFormBinder});
})