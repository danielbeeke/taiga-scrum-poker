var helpers = {
    table: function() {
        return Tables.findOne({ _id: Router.current().params._id })
    },
    members: function () {
        var table = helpers.table();

        if (table.members && table.members.length) {
            return Meteor.users.find({ _id: { $in: table.members } });
        }
    },
    issues: function () {
        Meteor.subscribe('userstories', helpers.table().project);

        return UserStories.find();
    },
    currentUserStory: function () {
        Meteor.subscribe('userstories', helpers.table().project);

        if (helpers.table().currentUserStoryId) {
            return UserStories.findOne({ id: helpers.table().currentUserStoryId });
        }
    },
    allMembersHaveChosen: function () {
        var allMembersHaveChosen = Estimations.find({
                userStoryId: helpers.table().currentUserStoryId,
                table: helpers.table()._id
            }).fetch().length == helpers.table().members.length

        if (allMembersHaveChosen && helpers.currentUserStory()) {
            var oldUserStoryId = helpers.currentUserStory()._id;
            //Meteor.call('tables-remove-current-userstory', helpers.table()._id);
            //Router.go('', { _id: oldUserStoryId, table: helpers.table()._id })
        }

        return allMembersHaveChosen
    },
    memberHasChosen: function () {
        Meteor.subscribe('points', helpers.table().project)

        var memberEstimation = Estimations.findOne({
            uid: this._id,
            userStoryId: helpers.table().currentUserStoryId,
            table: helpers.table()._id
        });

        var point = Points.findOne({ _id: memberEstimation.numberId });

        return point;
    }
};

Template.table.helpers(helpers);
