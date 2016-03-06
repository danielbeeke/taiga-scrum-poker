Meteor.publish('projects', function() {
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

Meteor.publish('userstories', function(projectId) {
    var self = this;
    if (this.userId) {
        var user = Meteor.users.findOne(this.userId);

        try {
            var response = HTTP.get('http://localhost:8000/api/v1/userstories?project=' + projectId, {
                headers: {
                    'Authorization': 'Bearer ' + user.taiga.bearer
                }
            });

            _.each(response.data, function(item) {
                self.added('userstories', item.id, item);
            });

            self.ready();

        } catch(error) {
            console.log(error);
        }
    }
});


Meteor.publish('points', function(projectId) {
    var self = this;

    if (this.userId) {
        var user = Meteor.users.findOne(this.userId);
        try {

            var response = HTTP.get('http://localhost:8000/api/v1/points?project=1', {
                headers: {
                    'Authorization': 'Bearer ' + user.taiga.bearer
                }
            });

            console.log(response.data)

            _.each(response.data, function(item) {
                self.added('points', item.id, item);
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
});

Meteor.publish('instances', function() {
    return Instances.find();
});

Meteor.publish('estimations', function(roomId) {
    if (roomId) {
        return Estimations.find({ room: roomId });
    }
});

Meteor.publish("users", function () {
    return Meteor.users.find();
});