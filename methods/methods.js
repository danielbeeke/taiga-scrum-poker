Meteor.methods({
    'rooms-create': function (room) {
        room.uid = this.userId;

        var currentUser = Meteor.users.findOne({ _id: this.userId });

        room.instance = currentUser.taiga.url;

        return Rooms.insert(room)
    },
    'rooms-user-visit': function (roomId) {
        Rooms.update(roomId, {
            $addToSet: { 'members': this.userId }
        });
    },
    'rooms-user-leave': function () {
        Rooms.update({ 'members': this.userId }, {
            $pull: { 'members': this.userId }
        });
    },
    'rooms-set-current-userstory': function (roomId) {
        var userStoryId = UserStories.find({}, { limit: 1 }).fetch()[0].id;

        Rooms.update(roomId, {
            $set: { 'currentUserStoryId': userStoryId }
        });
    },
    'rooms-remove-current-userstory': function (roomId) {
        Rooms.update(roomId, {
            $set: { 'currentUserStoryId': false }
        });
    },
    'estimation-create': function (estimationSelector, numberId) {
        estimationSelector.uid = this.userId;

        Estimations.upsert(estimationSelector, {
            $set: {'numberId': numberId}
        });
    },
    'instance-create': function (instanceUrl) {
        Instances.upsert({url: instanceUrl}, {
            $set: {'url': instanceUrl}
        });
    },
    'estimation-delete': function (estimationSelector) {
        estimationSelector.uid = this.userId;

        Estimations.remove(estimationSelector);
    }
})