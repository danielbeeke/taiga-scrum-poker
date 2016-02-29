Meteor.methods({
    'rooms-create': function (room) {
        room.uid = this.userId;
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
    'estimation-create': function (estimationSelector, number) {
        estimationSelector.uid = this.userId;

        Estimations.upsert(estimationSelector, {
            $set: { 'number': number }
        });
    }    ,
    'estimation-delete': function (estimationSelector) {
        estimationSelector.uid = this.userId;

        Estimations.remove(estimationSelector);
    }
})