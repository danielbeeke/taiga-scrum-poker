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
    }
})