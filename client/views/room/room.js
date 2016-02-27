Template.room.helpers({
    room: function() {
        return Rooms.findOne({ _id: Router.current().params._id })
    }
});