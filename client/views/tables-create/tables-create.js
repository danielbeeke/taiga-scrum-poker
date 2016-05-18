Template.tablesCreate.events({
    "submit #tables-create": function (event, template) {
        event.preventDefault();
        var formState = Session.get('forms.tables-create');
        formState.project = parseInt(formState.project);
        Meteor.call('tables-create', formState, function (error, tableId) {
            Router.go('table', {_id: tableId });
        })
    },
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
            return 'blabla';
        }
    }
});

Template.tablesCreate.rendered = function () {
    var that = this;

    this.autorun(function () {
        var formState = Session.get('forms.tables-create');

        if (typeof that.$('#tables-create').fullpage.reBuild == 'function') {
            that.$('#tables-create').fullpage.reBuild();
        }

        setTimeout(function () {
            that.$('#tables-create').fullpage({
                sectionSelector: '.form-group',
                verticalCentered: false,
                scrollOverflow: true
            });
        }, 40)

    });
}