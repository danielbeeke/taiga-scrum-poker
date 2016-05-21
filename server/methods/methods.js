Meteor.methods({
    'tables-create': function (table) {
        table.uid = this.userId;
        var currentUser = Meteor.users.findOne({ _id: this.userId });
        table.instance = currentUser.taiga.url;
        return Tables.insert(table)
    },
    'tables-user-visit': function (tableId) {
        Tables.update(tableId, {
            $addToSet: { 'members': this.userId }
        });
    },
    'tables-user-leave': function () {
        Tables.update({ 'members': this.userId }, {
            $pull: { 'members': this.userId }
        });
    },
    'tables-set-current-userstory': function (tableId) {
        var userStoryId = UserStories.find({}, { limit: 1 }).fetch()[0].id;
        Tables.update(tableId, {
            $set: { 'currentUserStoryId': userStoryId }
        });
    },
    'tables-remove-current-userstory': function (tableId) {
        Tables.update(tableId, {
            $set: { 'currentUserStoryId': false }
        });
    },
    'estimation-create': function (estimationSelector, numberId) {
        estimationSelector.uid = this.userId;

        Estimations.upsert(estimationSelector, {
            $set: {'numberId': numberId}
        });
    },
    'instance-create': function (instanceData) {
        Instances.upsert({ url: instanceData.url }, {
            $set: { url: instanceData.url, name: instanceData.name, used: Date.now() }
        });
    },
    'instance-delete': function (instanceId) {
        Instances.remove(instanceId);
    },
    'estimation-delete': function (estimationSelector) {
        estimationSelector.uid = this.userId;
        Estimations.remove(estimationSelector);
    }
})