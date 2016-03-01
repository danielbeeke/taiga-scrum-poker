Template.roomPlay.events({
    "click .card": function (event, template) {
        var number = Blaze.getData(event.currentTarget);

        if (helpers.memberHasChosen() && helpers.memberHasChosen().number == number) {
            var estimationSelector = {
                room: helpers.room()._id,
                userStoryId: helpers.room().currentUserStoryId
            };

            Meteor.call('estimation-delete', estimationSelector)
        }
        else {
            var estimationSelector = {
                room: helpers.room()._id,
                userStoryId: helpers.room().currentUserStoryId
            };

            Meteor.call('estimation-create', estimationSelector, number)
        }
    }
});


var helpers = {
    cards: function () {
        return [1,2,3,5,8,10,20]
    },
    room: function() {
        return Rooms.findOne({ _id: Router.current().params._id })
    },
    memberHasChosen: function () {
        var memberEstimation = Estimations.findOne({
            uid: Meteor.user()._id,
            userStoryId: helpers.room().currentUserStoryId,
            room: helpers.room()._id
        });

        return memberEstimation;
    },
    activeCard: function () {
        var chosenNumber = helpers.memberHasChosen().number;

        return this.toString() == chosenNumber
    }
};

Template.roomPlay.helpers(helpers);

Template.roomPlay.onRendered(function () {
    new Dragdealer('card-carousel', {
        steps: helpers.cards().length,
        speed: 0.3,
        loose: true,
        requestAnimationFrame: true
    });
})