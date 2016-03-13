Template.main.events({
    // Global two way binding trick for Meteor.
    "change input, keyup input": function (event, template) {
        var formState = {};
        var formId = template.$(event.target).parents('form').attr('id');
        var formStateArray = template.$('#' + formId).serializeArray();

        if (formStateArray) {
            $.each(formStateArray, function (delta, formValue) {
                formState[formValue.name] = formValue.value;
            })
        }

        if (formState) {
            Session.set('forms.' + formId, formState);
        }
    }
});

Template.registerHelper('formState', function (formId, name, option) {
    var formState = Session.get('forms.' + formId);

    if (formState && formState[name]) {

        if (typeof option == 'number' || typeof option == 'string') {
            if (formState[name] == option) {
                return 'checked';
            }
        }
        else {
            return formState[name];
        }
    }
});