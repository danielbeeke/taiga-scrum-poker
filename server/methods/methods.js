Meteor.methods({
    'rooms-create': function (room) {
        room.uid = this.userId;

        var currentUser = Meteor.users.findOne({ _id: this.userId });

        console.log(currentUser)

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
    'instance-create': function (instanceData) {
        Instances.upsert({ url: instanceData.url }, {
            $set: { url: instanceData.url, name: instanceData.name }
        });
    },
    'instance-delete': function (instanceId) {
        Instances.remove(instanceId);
    },
    'estimation-delete': function (estimationSelector) {
        estimationSelector.uid = this.userId;

        Estimations.remove(estimationSelector);
    }
})