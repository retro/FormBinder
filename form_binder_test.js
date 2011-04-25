steal.plugins(
	"jquery/class", 
	'jquery/controller', 
	'jquery/model', 
	'jquery/model/validations', 
	'funcunit/qunit',
	'jquery/view',
	'form_binder')
.then(function(){
	
	$.Controller.extend('Cntrlr', {
			init : function(){
			
			this.element.html($.View('form', {m: model}))
		}
	});
	$.Model.extend("BlogPost",{
		attributes : { 
			title        : 'string',
			lead         : 'text',
			body         : 'text',
			is_published : 'boolean',
			status       : 'string',
			tags         : 'array',
			author       : 'string'
		},
		valuesForTags   : ['test', 'tag'],
		valuesForStatus : [['published', 'Published'], ['draft', 'Draft']],
		valuesForAuthor : ['Mihael', 'Justin', 'Brian', 'Austin'],
		init : function(){
			this.validatePresenceOf('title');
			this.validatePresenceOf('lead');
		},

	}, {});
	
	model = new BlogPost();
	
	module("form_binder test", { 
		setup: function(){
			$('<div id="content"></div>').appendTo($("#qunit-test-area"));
			$('#content').cntrlr();
		}
	});

	test("Changing a value in form changes a value in model", function(){
		stop();
		$('#blog_post_title').val('Title').trigger('blur');
		equals('Title', model.attr('title'));
		start();
	});	
	
	test("Changing an attribute in model reflects in form", function(){
		model.attr('title', 'Title2');
		equals($('#blog_post_title').val(), 'Title2');
	})
	
	test("Setting an array attribute should check checkboxes in checkbox group", function(){
		model.attr('tags', ['test', 'tag'])
		equals($('[name="blog_post[tags][]"]:checked').length, 2)
		model.attr('tags', ['tag'])
		equals($('[name="blog_post[tags][]"]:checked').length, 1)
		model.attr('tags', [])
		equals($('[name="blog_post[tags][]"]:checked').length, 0)
	})
	
	test("Setting a value should reflect in select box", function(){
		model.attr('status', 'published')
		equals($('#blog_post_status').val(), 'published')
		model.attr('status', 'draft')
		equals($('#blog_post_status').val(), 'draft')
	})
	
	test("Validation should work on blur", function(){
		$('#blog_post_title').val('').trigger('blur')
		equals($('#blog_post_title').parents('.input-wrapper').find('.errors').text(), "can't be empty")
	})
	
	test("Errors should be removed after valid data is entered", function(){
		$('#blog_post_title').val('').trigger('blur')
		equals($('#blog_post_title').parents('.input-wrapper').find('.errors').text(), "can't be empty")
		$('#blog_post_title').val('Title').trigger('blur')
		equals($('#blog_post_title').parents('.input-wrapper').find('.errors').text(), "")
	})
	
	test("Errors should be removed after valid data is entered", function(){
		$('#blog_post_title').val('').trigger('blur')
		equals($('#blog_post_title').parents('.input-wrapper').find('.errors').text(), "can't be empty")
		$('#blog_post_title').val('Title').trigger('blur')
		equals($('#blog_post_title').parents('.input-wrapper').find('.errors').text(), "")
	})

	test("Setting an boolean value should reflect in checkbox being checked", function(){
		model.attr('is_published', true)
		equals($('#blog_post_is_published:checked').length, 1)
	})
	
	test("Setting an value in model should select this value in a radio group", function(){
		model.attr('author', 'Mihael')
		equals($('[name="blog_post[author]"]:checked').val(), 'Mihael')
		model.attr('author', 'Justin')
		equals($('[name="blog_post[author]"]:checked').val(), 'Justin')
	})
	
	test("Clicking an radio button should set value in model", function(){
		$('[name="blog_post[author]"]:eq(3)').trigger('click').trigger('change');
		equals(model.attr('author'), 'Austin')
	})
	
}) 

