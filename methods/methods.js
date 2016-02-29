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
        console.log('test')

        Rooms.update(roomId, {
            $set: { 'currentUserStoryId': userStoryId }
        });
    }
})