Meteor.methods({
    'rooms-create': function (room) {
        return Rooms.insert(room)
    }
})