Meteor.publish('projects', function() {
    var self = this;
    if (this.userId) {
        var user = Meteor.users.findOne(this.userId);

        try {
            var response = HTTP.get(user.taiga.url + '/projects?member=' + user.taiga.id, {
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
            var response = HTTP.get(user.taiga.url + '/userstories?project=' + parseInt(projectId), {
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

            var response = HTTP.get(user.taiga.url + '/points?project=' + projectId, {
                headers: {
                    'Authorization': 'Bearer ' + user.taiga.bearer
                }
            });

            _.each(response.data, function(item) {
                self.added('points', item.id, item);
            });

            self.ready();

        } catch(error) {
            console.log(error);
        }

    }
});


Meteor.publish('members', function(projectId) {
    var self = this;

    if (this.userId) {
        var user = Meteor.users.findOne(this.userId);
        try {

            var response = HTTP.get(user.taiga.url + '/users?project=' + projectId, {
                headers: {
                    'Authorization': 'Bearer ' + user.taiga.bearer
                }
            });

            _.each(response.data, function(item) {
                self.added('members', item.id, item);
            });

            self.ready();

        } catch(error) {
            console.log(error);
        }

    }
});


Meteor.publish('issues', function(projectId) {
    var self = this;

    if (this.userId) {
        var user = Meteor.users.findOne(this.userId);
        try {

            var response = HTTP.get(user.taiga.url + '/issues?project=' + projectId, {
                headers: {
                    'Authorization': 'Bearer ' + user.taiga.bearer
                }
            });

            _.each(response.data, function(item) {
                self.added('issues', item.id, item);
            });

            self.ready();

        } catch(error) {
            console.log(error);
        }

    }
});


Meteor.publish('rooms', function(roomId) {
    if (this.userId) {
        var user = Meteor.users.findOne(this.userId);

        if (roomId) {
            return Rooms.find({ _id: roomId, instance: user.taiga.url });
        }
        else {
            return Rooms.find({instance: user.taiga.url});
        }
    }
});

Meteor.publish('instances', function() {
    return Instances.find();
});

Meteor.publish('estimations', function(roomId) {
    if (roomId && this.userId) {
        return Estimations.find({ room: roomId });
    }
});

Meteor.publish("users", function () {
    if (this.userId) {
        return Meteor.users.find({}, { fields: {'taiga': 1}});
    }
});