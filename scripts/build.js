//steal/js form_binder/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('form_binder/scripts/build.html',{to: 'form_binder'});
});
