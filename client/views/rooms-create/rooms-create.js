Template.roomsCreate.events({
    "submit #rooms-create": function (event, template) {
        event.preventDefault();

        var room = {
            name: template.find('[name="name"]').value,
            project: template.find('[name="project"]').value
        };

        Meteor.call('rooms-create', room, function (error, roomId) {
            Router.go('room', {_id: roomId });
        })
    }
});


Template.roomsCreate.helpers({
    projects: function () {
        return Projects.find()
    }
});