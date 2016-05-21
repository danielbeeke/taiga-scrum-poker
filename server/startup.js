var apiCollections = [
    {
        collection: 'projects',
        taigaApiUrl: '/projects?member=UID'
    },
    {
        collection: 'projectdetails',
        taigaApiUrl: '/projects/ARGUMENT'
    },
    {
        collection: 'userstories',
        taigaApiUrl: '/userstories?project=ARGUMENT'
    },
    {
        collection: 'points',
        taigaApiUrl: '/points?project=ARGUMENT'
    },
    {
        collection: 'members',
        taigaApiUrl: '/users?project=ARGUMENT'
    },
    {
        collection: 'issues',
        taigaApiUrl: '/issues?project=ARGUMENT'
    },
    {
        collection: 'roles',
        taigaApiUrl: '/roles?project=ARGUMENT'
    }
];

_.each(apiCollections, function (apiCollection) {
    Meteor.publish(apiCollection.collection, function(argument) {
        var self = this;
        if (this.userId) {
            var user = Meteor.users.findOne(this.userId);

            try {
                var path = apiCollection.taigaApiUrl;

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
                    self.added(apiCollection.collection, response.data.id, response.data);
                }
                else {
                    _.each(response.data, function(item) {
                        self.added(apiCollection.collection, item.id, item);
                    });
                }

                self.ready();

            } catch(error) {
                console.log(error);
            }
        }
    });
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
