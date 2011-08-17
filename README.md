# FormBinder 

FormBinder is a form builder for JavaScriptMVC with automatic binding to a model. It is inspired by the [SimpleForm](https://github.com/plataformatec/simple_form) library for Rails.

It provides a builder for your forms and it binds that form to a model instance. That way you can implement live validation for your form in a model.

## Installation

You can install this plugin by either checking out the repo, or by downloading the code as an archive. If you're checking out the repo, make sure that you check it out in the form_binder folder instead of FormBinder:

    git checkout git@github.com:retro/FormBinder.git form_binder
    
When you want to use the plugin you have to steal it from your controller: 

    steal('form_binder', ....).then();
    
If you don't put FormBinder in your steal.root directory (one where the jquery, funcunit, steal, etc., folders are) you have to steal it by using path to the folder. For instance if you put it inside of ROOT\_JS\_DIRECTORY/my\_app/form\_binder you would steal it like this: 

    steal('my_app/form_binder', ....).then();

## Usage

FormBinder can inspect Model's attributes property and automatically build form from that.

If you have a model that looks like this:

    $.Model.extend("BlogPost",{
      attributes : { 
        title : 'string',
        lead   : 'text',
      }
    }, {});

You can build your form like this:

    <% var f = form_builder(model_instance) // You can pass this variable from controller %>
    <form <%= f.bindForm %>>
      <%= f.inputs(); %>
      <input type="submit" value="Submit form" />
    </form>

It will create fields for title and lead. Title will be rendered as a text input and lead as a textarea.

You can pass FormBuilder object from controller by instantiating it like this

    var f = FormBinder.Builder.getBuilder(model_instance);

If you need more customization you can render each field on it's own:

    <% var f = form_builder(model_instance) // You can pass this variable from controller %>
    <form <%= f.bindForm %>>
      <%= f.input('title'); %>
      <%= f.input('lead'); %>
      <input type="submit" value="Submit form" />
    </form>

## Customization

You can customize rendering of your fields by passing options to the input method:

    <form <%= f.bindForm %>>
      <%= f.input('title', {as: 'textarea', label: 'Insert title', hint: 'Blog title'}); %>
      <input type="submit" value="Submit form" />
    </form>

FormBinder currently supports following field types:

* string - renders as a text input
* password
* textarea
* boolean - renders as a checkbox
* checkboxGroup
* radioGroup
* select

If you want to provide available values to a radio group, a check box group or a select input there are two ways to do it. By default FormBinder's builder will look for a valuesForField class method on a Model:

    $.Model.extend("BlogPost",{
      attributes: {
        status: 'string'
      },
      valuesForStatus: [['published', 'Published'], ['draft', 'Draft']]
    }, {});

You can also provide values inline in template:
    
    <%= f.input('status', {as: 'select', values: [['published', 'Published'], ['draft', 'Draft']]}) %>
    
## Changing Input or Wrapper templates

FormBinder can load your custom field or wrapper templates. All you need to do is pass it as option to the FormBinder.Builder. Supported options are: 

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
    
If you wanted to change string_input's location you can initialize FormBinder.Builder like this: 

    <% var f = form_builder(model_instance, {string_input: "My/location/of/string/input"}) %>

or

    var f = FormBinder.Builder.getBuilder(model_instance, {string_input: "My/location/of/string/input"});


## Supported Versions and License

FormBinder works with the 3.1 and edge versions of JavaScriptMVC.

FormBinder is published under MIT License.