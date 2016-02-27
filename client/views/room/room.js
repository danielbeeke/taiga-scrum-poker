var helpers = {
    room: function() {
        return Rooms.findOne({ _id: Router.current().params._id })
    },
    members: function () {
        var room = helpers.room();
        return Meteor.users.find({ _id: { $in: room.members } });
    }
};

Template.room.helpers(helpers);
