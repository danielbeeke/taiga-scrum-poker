Template.tablesCreate.events({
    "submit #tables-create": function (event, template) {
        event.preventDefault();
        var formState = Session.get('forms.tables-create');
        formState.project = parseInt(formState.project);
        Meteor.call('tables-create', formState, function (error, tableId) {
            Router.go('table', {_id: tableId });
        })
    },
    "click .group-header": function (event, template) {
        var delta = $('.group-header').index(event.target);

        $('html, body').animate({
            scrollTop: $(event.target).next('.form-group').offset().top - $('.group-header:first').outerHeight() - (delta * 35) + 'px'
        }, 600);
    }
});


Template.tablesCreate.helpers({
    projects: function () {
        return Projects.find()
    },
    members: function () {
        var formState = Session.get('forms.tables-create');
        if (formState && formState.project) {
            Meteor.subscribe('members', parseInt(formState.project));

            var currentProject = Projects.findOne({ id: parseInt(formState.project) });
            if (currentProject && currentProject.members && currentProject.members.length) {
                var members = Members.find({ _id: {$in: currentProject.members }});
                return members;
            }
        }
    },
    userstories: function () {
        var formState = Session.get('forms.tables-create');
        if (formState && formState.project) {
            Meteor.subscribe('userstories', parseInt(formState.project));

            return UserStories.find()
        }
    },
    groupClasses: function (name) {
        var formState = Session.get('forms.tables-create');
        if (formState && formState[name]) {
            return 'allowed';
        }
    }
});

Template.tablesCreate.rendered = function () {
    $(window).on('scroll', function () {
        $('.form-group').each(function (delta, group) {
            var header = $(group).prev('.group-header');
            var deltaAdjustment = delta * 35;

            if ($(group).offset().top - $(header).outerHeight() - deltaAdjustment < $(window).scrollTop()) {
                $(header).addClass('sticky');
            }
            else if ($(group).offset().top + deltaAdjustment > $(window).scrollTop()) {
                $(header).removeClass('sticky');
            }
        })
    })
}