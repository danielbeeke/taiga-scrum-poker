Template.roomsCreate.events({
    "submit #rooms-create": function (event, template) {
        event.preventDefault();

        var room = {
            name: template.find('[name="name"]').value,
            project: template.find('[name="project"]:checked').value
        };

        Meteor.call('rooms-create', room, function (error, roomId) {
            Router.go('room', {_id: roomId });
        })
    },
    "click .button": function (event, template) {
        $(template.find('#rooms-create')).submit()
    },
    "click .label": function (event, template) {
        $(template.find('.radios-as-select')).addClass('just-clicked').one('mouseout', function () {
            var that = this;
            setTimeout(function () {
                $(that).removeClass('just-clicked')
            }, 1000)
        })
    }
});


Template.roomsCreate.helpers({
    projects: function () {
        return Projects.find()
    },
    first: function (index) {
        if (index == 0) {
            return 'checked'
        }
    },
});