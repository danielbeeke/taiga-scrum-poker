Template.roomPlay.events({
    "click .card": function (event, template) {
        var numberId = Blaze.getData(event.currentTarget).id;
        var estimationSelector = {
            room: helpers.room()._id,
            userStoryId: helpers.room().currentUserStoryId
        };

        if (helpers.memberHasChosen() && helpers.memberHasChosen().numberId == numberId) {
            Meteor.call('estimation-delete', estimationSelector)
        }
        else {
            Meteor.call('estimation-create', estimationSelector, numberId)
        }
    }
});

var helpers = {
    cards: function () {
        console.log(helpers.room().project)
        Meteor.subscribe('points', helpers.room().project)
        return Points.find();
    },
    room: function() {
        return Rooms.findOne({ _id: Router.current().params._id })
    },
    memberHasChosen: function () {
        return Estimations.findOne({
            uid: Meteor.user()._id,
            userStoryId: helpers.room().currentUserStoryId,
            room: helpers.room()._id
        });
    },
    activeCard: function () {
        if (helpers.memberHasChosen()) {
            var chosenNumber = helpers.memberHasChosen().numberId;
            return this.id == chosenNumber
        }
    }
};

Template.roomPlay.helpers(helpers);

Template.roomPlay.onRendered(function () {
    new Dragdealer('card-carousel', {
        steps: 12,
        speed: 0.3,
        loose: true,
        requestAnimationFrame: true
    });
})