# FormBinder 

FormBinder is a form builder for JavaScriptMVC with automatic binding to a model. It is inspired by the [SimpleForm](https://github.com/plataformatec/simple_form) library for Rails.

It provides a builder for your forms and it binds that form to a model instance. That way you can implement live validation for your form in a model.

It can inspect Model's attributes property and automatically build form from that.

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

It currently works with edge version of JavaScriptMVC 3.0 (future 3.0.6 version),

FormBinder is published under MIT License.