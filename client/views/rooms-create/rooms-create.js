Template.roomsCreate.events({
    "submit #rooms-create": function (event, template) {
        event.preventDefault();
        var formState = Session.get('forms.rooms-create');
        formState.project = parseInt(formState.project);
        Meteor.call('rooms-create', formState, function (error, roomId) {
            Router.go('room', {_id: roomId });
        })
    },
});


Template.roomsCreate.helpers({
    projects: function () {
        return Projects.find()
    },
    members: function () {
        var formState = Session.get('forms.rooms-create');
        if (formState && formState.project) {
            Meteor.subscribe('members', parseInt(formState.project));

            var currentProject = Projects.findOne({ id: parseInt(formState.project) });
            if (currentProject && currentProject.members && currentProject.members.length) {
                var members = Members.find({ _id: {$in: currentProject.members }});
                return members;
            }
        }
    },
    issues: function () {
        var formState = Session.get('forms.rooms-create');
        if (formState && formState.project) {
            Meteor.subscribe('issues', parseInt(formState.project));

            return Issues.find()
        }
    },
    groupClasses: function (name) {
        //var formState = Session.get('forms.rooms-create');

        //switch (name) {
        //    case 'name':
        //        if (formState && formState.name && formState.name != '') {
        //            return 'done enabled'
        //        }
        //        else {
        //            return 'enabled'
        //        }
        //
        //        break;
        //    case 'project':
        //        break;
        //    case 'issues':
        //        break;
        //    case 'players':
        //        break;
        //}
    },
});