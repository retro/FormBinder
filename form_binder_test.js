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
			title : 'string',
			lead  : 'text',
			body  : 'text',
			is_published : 'boolean',
			status : 'string',
			tags   : 'array'
		},
		valuesForTags   : ['test', 'tag'],
		valuesForStatus : [['test', 'Test'], ['mamatijejama', 'Mama ti je jama']],
		init : function(){
			this.validatePresenceOf('title');
			this.validatePresenceOf('lead');
		},

	}, {});
	
	model = new BlogPost();
	
	module("form_binder test", { 
		setup: function(){
			$('<div id="content"></div>').appendTo($("#qunit-test-area"))
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

	/*
	




		

		
	*/
}) 

