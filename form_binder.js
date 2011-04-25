steal.plugins(
	'jquery',
	'jquery/controller',
	'jquery/view/ejs',
	'jquery/model',
	'jquery/model/validations').then('form_binder_manager', function($){
	$.Controller.extend("FormBinder",{
		
	}, {
		init : function(){
			m = this.options.model
			for(var k in this.options.model.Class.attributes){
				if(this.options.model.Class.attributes.hasOwnProperty(k)){
					this.options.model.bind(k, this.callback('modelAttrChanged', k));
				}
			}
		},
		submit : function(el, ev){
			var errors = this.options.model.errors();
			if(errors){
				this.addErrorsForAttr(errors);
				ev.preventDefault();
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
			
		},
		attrFromFieldName : function(el){
			return el.attr('name').match(/\[[a-zA-Z0-9_-]+\]/g).pop().replace(/\[|\]/g, '');
		}
	})
});

