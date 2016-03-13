var helpers = {
    room: function() {
        return Rooms.findOne({ _id: Router.current().params._id })
    },
    members: function () {
        var room = helpers.room();

        if (room.members && room.members.length) {
            return Meteor.users.find({ _id: { $in: room.members } });
        }
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
    },
    allMembersHaveChosen: function () {
        var allMembersHaveChosen = Estimations.find({
                userStoryId: helpers.room().currentUserStoryId,
                room: helpers.room()._id
            }).fetch().length == helpers.room().members.length

        if (allMembersHaveChosen && helpers.currentUserStory()) {
            var oldUserStoryId = helpers.currentUserStory()._id;
            //Meteor.call('rooms-remove-current-userstory', helpers.room()._id);
            //Router.go('', { _id: oldUserStoryId, room: helpers.room()._id })
        }

        return allMembersHaveChosen
    },
    memberHasChosen: function () {
        Meteor.subscribe('points', helpers.room().project)

        var memberEstimation = Estimations.findOne({
            uid: this._id,
            userStoryId: helpers.room().currentUserStoryId,
            room: helpers.room()._id
        });

        var point = Points.findOne({ _id: memberEstimation.numberId });

        return point;
    }
};

Template.room.helpers(helpers);
