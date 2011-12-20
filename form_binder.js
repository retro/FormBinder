steal(
	'jquery',
	'jquery/class',
	'jquery/controller',
	'jquery/view/ejs',
	'jquery/model',
	'jquery/model/validations').then(function($){
	
	$.Controller("FormBinder",{
		
	}, 
	{
		'{model} updated.attr' : function(model, ev, attr, newValue, oldValue){
			this.modelAttrChanged(attr)
		},
		'{model} invalidated' : function(model, ev, errors){
			this.addErrorsForAttr(errors);
		},
		submit : function(el, ev){
			var errors = this.options.model.errors();
			if(errors){
				this.addErrorsForAttr(errors);
				ev.preventDefault();
				ev.stopPropagation();
			}
		},
		'input blur' : function(el, ev){
			if(['radio', 'checkbox'].indexOf(el.attr('type')) == -1) this.updateModelAttr(el)
		},
		'input change' : function(el, ev){
			this.updateModelAttr(el)
		},
		'textarea blur' : function(el, ev){
			this.updateModelAttr(el)
		},
		'textarea change' : function(el, ev){
			this.updateModelAttr(el)
		},
		'select change' : function(el, ev){
			this.updateModelAttr(el)
		},
		errorsElementForField : function(field){
			return this.element.find('#' + this.options.model.Class._shortName + '_' + field).parents('.input-wrapper').find('.errors');
		},
		addErrorsForAttr : function(errors){
			for(var k in errors){
				if(errors.hasOwnProperty(k)){
					this.errorsElementForField(k).html(errors[k].join('<br />')).show().parents('.input-wrapper').addClass('has-errors');
				}
			}
		},
		updateModelAttr : function(el){
			var attr = this.attrFromFieldName(el);
			var val = [];
			if(this.options.model.Class.attributes[attr] == 'array'){
				this.element.find('[name="' + el.attr('name') + '"]:checked').each(function(i, el){
					val.push($(el).val());
				})
			} else if(this.options.model.Class.attributes[attr] == 'boolean'){
				val = $('el').is(':checked');
			} else if($(el).attr('type') == 'radio') {
				val = $('[name="' + el.attr('name') + '"]:checked').val()
			} else {
				val = el.val();
			}
			this.options.model.attr(attr, val, null, this.callback('addErrorsForAttr'));
		},
		modelAttrChanged : function(attr){
			if(typeof attr != 'undefined'){
				var name = '[name="'+this.options.model.Class._shortName+'['+attr+']"]';
				if(this.options.model.Class.attributes[attr] == 'array'){
					var self = this;
					name = '[name="'+this.options.model.Class._shortName+'['+attr+'][]"]';
					this.element.find(name).each(function(i, el){
						if(self.options.model.attr(attr).indexOf($(el).val()) > -1) $(el).attr('checked', true)
						else $(el).attr('checked', false);
					}).parents('.input-wrapper').removeClass('has-errors').find('.errors').html('').hide();
				} else if(this.options.model.Class.attributes[attr] == 'boolean') {
					this.errorsElementForField(attr).html('').hide().parents('.input-wrapper').removeClass('has-errors');
					this.element.find(name).attr('checked', this.options.model.attr(attr));
				} else if(this.element.find(name).attr('type') == 'radio'){
					var self = this;
					var el = this.element.find(name).map(function(i, element){
						if($(element).val() == self.options.model.attr(attr))
						return element;
					})
					$(el).attr('checked', true);
				} else {
					this.errorsElementForField(attr).html('').hide().parents('.input-wrapper').removeClass('has-errors');
					this.element.find(name).val(this.options.model.attr(attr));
				}
			}
		},
		attrFromFieldName : function(el){
			return el.attr('name').match(/\[[a-zA-Z0-9_-]+\]/g).pop().replace(/\[|\]/g, '');
		}
	})
	
	$.Class.extend('FormBinder.Builder', {
		getBuilder : function(model, options){
			return new FormBinder.Builder(model, options);
		},
		defaults : {
			// Wrappers
			generic_wrapper                : 'views/wrappers/generic.ejs',
			boolean_checkbox_radio_wrapper : 'views/wrappers/boolean_checkbox_radio.ejs',
			
			// Inputs
			boolean_input        : 'views/inputs/boolean.ejs',
			checkbox_group_input : 'views/inputs/checkbox_group.ejs',
			password_input       : 'views/inputs/password.ejs',
			radio_group_input    : 'views/inputs/radio_group.ejs',
			select_input         : 'views/inputs/select.ejs',
			string_input         : 'views/inputs/string.ejs',
			textarea_input       : 'views/inputs/textarea.ejs'
			
		}
	}, {
		setup : function(model, opts){
			var options = opts || {};
			this.options = $.extend($.extend(true, {}, this.Class.defaults), options);
		},
		init : function(model){
			this.model = model;
		},
		bindForm : function(){
			var self = this;
			return function( el ) {
				var shortName = self.model.Class._shortName,
							 models = $.data(el, "models") || $.data(el, "models", {});
				$(el).addClass(shortName + " " + self.model.identity());
				models[shortName] = self.model;
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
			
			return $.View(FormBinder.Builder.folder + this._templateMethod(fieldType).apply(this), {
				input: this._renderMethod(fieldType).call(this, opts),
				fieldType : fieldType,
				fieldId : id,
				label : opts.label,
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
			return $.View(FormBinder.Builder.folder + this.options.password_input, opts);
		},
		_stringInput : function(opts){
			return $.View(FormBinder.Builder.folder + this.options.string_input, opts);
		},
		_textInput : function(opts){
			return $.View(FormBinder.Builder.folder + this.options.textarea_input, opts);
		},
		_booleanInput : function(opts){
			return $.View(FormBinder.Builder.folder + this.options.boolean_input, opts);
		},
		_radioGroupInput : function(opts){
			opts.values  = opts.values || opts.model.Class['valuesFor' + $.String.capitalize(opts.field)];
			if($.isFunction(opts.values)) opts.values = opts.values(opts.model);
			return $.View(FormBinder.Builder.folder + this.options.radio_group_input, opts);
		},
		_checkboxGroupInput : function(opts){
			opts.values  = opts.values || opts.model.Class['valuesFor' + $.String.capitalize(opts.field)];
			if($.isFunction(opts.values)) opts.values = opts.values(opts.model);
			opts.value = opts.value || [];
			if($.isFunction(opts.values)) opts.values = opts.values(opts.model);
			return $.View(FormBinder.Builder.folder + this.options.checkbox_group_input, opts);
		},
		_selectInput : function(opts){
			var select  = '<select name="' + opts.name + '" id="' + opts.id + '">';
			var values  = opts.values || opts.model.Class['valuesFor' + $.String.classize(opts.field)];
			if($.isFunction(values)) values = values(opts.model);
			opts.values = values;
			return $.View(FormBinder.Builder.folder + this.options.select_input, opts);
		},
		_booleanTemplate : function(){
			return this.options.boolean_checkbox_radio_wrapper; 
		},
		_checkboxGroupTemplate : function(){
			return this.options.boolean_checkbox_radio_wrapper; 
		},
		_radioGroupTemplate : function(){
			return this.options.boolean_checkbox_radio_wrapper; 
		},
		_stringTemplate : function(){
			return this.options.generic_wrapper;
		}
	});
	
	FormBinder.Builder.folder = "//" + steal.cur().dir() + "/";
	
	$.extend($.EJS.Helpers.prototype, {form_builder : FormBinder.Builder.getBuilder});
	
});

