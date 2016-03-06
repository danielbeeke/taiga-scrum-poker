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
    'rooms-set-current-userstory': function (roomId, userStoryId) {
        Rooms.update(roomId, {
            $set: { 'currentUserStoryId': userStoryId }
        });
    },
    'estimation-create': function (estimationSelector, numberId) {
        estimationSelector.uid = this.userId;

        Estimations.upsert(estimationSelector, {
            $set: {'numberId': numberId}
        });
    },
    'instance-create': function (instanceUrl) {
        console.log(instanceUrl)
        Instances.upsert({url: instanceUrl}, {
            $set: {'url': instanceUrl}
        });
    },
    'estimation-delete': function (estimationSelector) {
        estimationSelector.uid = this.userId;

        Estimations.remove(estimationSelector);
    }
})