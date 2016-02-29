var helpers = {
    room: function() {
        return Rooms.findOne({ _id: Router.current().params._id })
    },
    members: function () {
        var room = helpers.room();
        return Meteor.users.find({ _id: { $in: room.members } });
    },
    issues: function () {
        Meteor.subscribe('userstories', helpers.room().project);

        return UserStories.find();
    },
    currentUserStory: function () {
        Meteor.subscribe('userstories', helpers.room().project);

        if (helpers.room().currentUserStoryId) {
            return UserStories.findOne({ id: helpers.room().currentUserStoryId });
        }
        else {
            var currentUserStoryId = UserStories.find({}, { limit: 1 }).fetch()[0].id;
            if (currentUserStoryId) {
                Meteor.call('rooms-set-current-userstory', helpers.room()._id, currentUserStoryId);
            }
        }
    }
};

Template.room.helpers(helpers);
