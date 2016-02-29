Template.roomPlay.events({
    "click .card": function (event, template) {
        var number = Blaze.getData(event.currentTarget);

        var estimationSelector = {
            room: helpers.room()._id,
            userStoryId: helpers.room().currentUserStoryId
        };

        Meteor.call('estimation-create', estimationSelector, number)
    },
    "click .delete": function (event, template) {
        var estimationSelector = {
            room: helpers.room()._id,
            userStoryId: helpers.room().currentUserStoryId
        };

        Meteor.call('estimation-delete', estimationSelector)
    }
});


var helpers = {
    cards: function () {
        return [1,2,3,5,8,10,20]
    },
    room: function() {
        return Rooms.findOne({ _id: Router.current().params._id })
    }
};

Template.roomPlay.helpers(helpers);