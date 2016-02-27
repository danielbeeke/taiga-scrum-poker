Meteor.publish('projectsHandle', function() {
    var self = this;

    if (this.userId) {

        var user = Meteor.users.findOne(this.userId);

        try {
            var response = HTTP.get('http://localhost:8000/api/v1/projects', {
                headers: {
                    'Authorization': 'Bearer ' + user.taiga.bearer
                }
            });

            _.each(response.data, function(item) {
                self.added('projects', item.id, item);
            });

            self.ready();

        } catch(error) {
            console.log(error);
        }
    }
});

Meteor.publish('rooms', function(roomId) {
    if (roomId) {
        return Rooms.find({ _id: roomId });
    }
    else {
        return Rooms.find();
    }
})

Meteor.publish("users", function () {
    return Meteor.users.find();
});