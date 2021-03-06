Template.main.events({
    // Global two way binding trick for Meteor.
    "change input, keyup input": function (event, template) {
        var formState = {};
        var formId = template.$(event.target).parents('form').attr('id');
        var formStateArray = template.$('#' + formId).serializeArray();

        template.$(event.target).addClass('used');

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
    }
});

Template.main.helpers({
    correction: function () {
        return parseInt(Session.get('baseline-correction'));
    }
});

if (document) {
    document.onkeypress = function (e) {
        e = e || window.event;

        if (e.charCode == 45) {
            $('body').toggleClass('has-visible-baseline');
        }

        if (e.charCode == 61) {
            var baseLineCorrection = parseInt(Session.get('baseline-correction'));
            if (!baseLineCorrection) {
                baseLineCorrection = 1;
            }
            else {
                baseLineCorrection = baseLineCorrection + 1;
            }

            Session.set('baseline-correction', baseLineCorrection);
        }
    };
}

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


Template.registerHelper('pathForDestination', function (options) {
    var routeName;

    if (arguments.length > 1) {
        routeName = arguments[0];
        options = arguments[1] || {};
    }

    var opts = options && options.hash;

    if (Router.current().params.query && Router.current().params.query.destination) {
        routeName = Router.current().params.query.destination;
    }

    opts = opts || {};

    var path = '';
    var query = opts.query;
    var hash = opts.hash;
    routeName = routeName || opts.route;
    var data = _.extend({}, opts.data || this);

    var route = Router.routes[routeName];

    if (route) {
        _.each(route.handler.compiledUrl.keys, function (keyConfig) {
            var key = keyConfig.name;
            if (_.has(opts, key)) {
                data[key] = EJSON.clone(opts[key]);

                // so the option doesn't end up on the element as an attribute
                delete opts[key];
            }
        });

        path = route.path(data, {query: query, hash: hash});
    }
    else {
        warn(route, "pathFor couldn't find a route named " + JSON.stringify(routeName));
    }

    return path;
});


Template.registerHelper('compare', function(v1, v2) {
    if (typeof v1 === 'object' && typeof v2 === 'object') {
        return _.isEqual(v1, v2); // do a object comparison
    } else {
        return v1 === v2;
    }
});

Blaze.addBodyClass(function() {
    if ( Router.current() &&  Router.current().route) {
        var routeName = Router.current().route.getName();

        if (routeName) {
            return routeName;
        }
    }
});