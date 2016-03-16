Template.main.events({
    // Global two way binding trick for Meteor.
    "change input, keyup input": function (event, template) {
        var formState = {};
        var formId = template.$(event.target).parents('form').attr('id');
        var formStateArray = template.$('#' + formId).serializeArray();

        if (formStateArray) {
            $.each(formStateArray, function (delta, formValue) {
                var inputType = template.$(event.target).parents('form').find('[name="' + formValue.name + '"]:first').attr('type');

                if (inputType == 'checkbox') {
                    if (!formState[formValue.name]) {
                        formState[formValue.name] = []
                    }
                    formState[formValue.name].push(formValue.value)
                }
                else {
                    formState[formValue.name] = formValue.value;
                }
            })
        }

        if (formState) {
            Session.set('forms.' + formId, formState);
        }
    },
    "click .button": function (event, template) {
        template.$(event.target).parents('form').submit()
    },
    "click .radios-as-select .label": function (event, template) {
        template.$(event.target).parents('.radios-as-select').addClass('just-clicked').one('mouseout', function () {
            var that = this;
            setTimeout(function () {
                $(that).removeClass('just-clicked')
            }, 1000)
        })
    }
});

Template.registerHelper('formState', function (formId, name, option) {
    var formState = Session.get('forms.' + formId);

    if (formState && formState[name]) {

        if (typeof option == 'number' || typeof option == 'string') {
            // Wrong types in javascript.
            if (typeof formState[name] == 'object' && $.inArray(option.toString(), formState[name]) != -1) {
                return 'checked';
            }
            if (typeof formState[name] == 'string' && formState[name] == option) {
                return 'checked';
            }
        }
        else {
            return formState[name];
        }
    }
});

Template.registerHelper('first', function (index) {
    if (index == 0) {
        return 'checked'
    }
});