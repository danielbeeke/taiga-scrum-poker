var apiCollections = [
    {
        name: 'projects',
        path: '/projects?member=UID'
    },
    {
        name: 'projectdetails',
        path: '/projects/ARGUMENT'
    },
    {
        name: 'userstories',
        path: '/userstories?project=ARGUMENT'
    },
    {
        name: 'points',
        path: '/points?project=ARGUMENT'
    },
    {
        name: 'members',
        path: '/users?project=ARGUMENT'
    },
];

_.each(apiCollections, function (apiCollection) {
    Meteor.publish(apiCollection.name, function(argument) {
        var self = this;
        if (this.userId) {
            var user = Meteor.users.findOne(this.userId);

            try {
                var path = apiCollection.path;

                if (argument) {
                    path = path.replace('ARGUMENT', parseInt(argument));
                }

                var hasUidInPath = path.search('UID');

                if (hasUidInPath != -1) {
                    path = path.replace('UID', user.taiga.id);
                }

                var response = HTTP.get(user.taiga.url + path, {
                    headers: {
                        'Authorization': 'Bearer ' + user.taiga.bearer
                    }
                });

                if (response.data && response.data.id) {
                    self.added(apiCollection.name, response.data.id, response.data);
                }
                else {
                    _.each(response.data, function(item) {
                        self.added(apiCollection.name, item.id, item);
                    });
                }

                self.ready();

            } catch(error) {

                console.log(apiCollection.name)
                console.log(user.taiga.url + path)
                console.log(error)
            }
        }
    });
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


Meteor.publish('roles', function(projectId) {
    var self = this;

    if (this.userId) {
        var user = Meteor.users.findOne(this.userId);
        try {

            var response = HTTP.get(user.taiga.url + '/roles?project=' + projectId, {
                headers: {
                    'Authorization': 'Bearer ' + user.taiga.bearer
                }
            });

            _.each(response.data, function(item) {
                self.added('roles', item.id, item);
            });

            self.ready();

        } catch(error) {
            console.log(error);
        }

    }
});


Meteor.publish('tables', function(tableId) {
    if (this.userId) {
        var user = Meteor.users.findOne(this.userId);

        if (tableId) {
            return Tables.find({ _id: tableId, instance: user.taiga.url });
        }
        else {
            return Tables.find({instance: user.taiga.url});
        }
    }
});

Meteor.publish('instances', function() {
    return Instances.find();
});

Meteor.publish('estimations', function(tableId) {
    if (tableId && this.userId) {
        return Estimations.find({ table: tableId });
    }
});

Meteor.publish("users", function () {
    if (this.userId) {
        return Meteor.users.find({}, { fields: {'taiga': 1}});
    }
});
