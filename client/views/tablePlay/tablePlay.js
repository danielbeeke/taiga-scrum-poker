Template.tablePlay.events({
    "click .card": function (event, template) {
        var numberId = Blaze.getData(event.currentTarget).id;
        var estimationSelector = {
            table: helpers.table()._id,
            userStoryId: helpers.table().currentUserStoryId
        };

        if (helpers.memberHasChosen() && helpers.memberHasChosen().numberId == numberId) {
            Meteor.call('estimation-delete', estimationSelector)
        }
        else {
            Meteor.call('estimation-create', estimationSelector, numberId)
        }
    }
});

var cardsInited = false;

var helpers = {
    cards: function () {
        Meteor.subscribe('points', helpers.table().project);

        if (Points.find().fetch().length && !cardsInited) {
            cardsInited = new Dragdealer('card-carousel', {
                steps: Points.find().fetch().length,
                speed: 0.3,
                loose: true,
                requestAnimationFrame: true
            });
        }

        return Points.find();
    },
    cardsCount: function () {
        return Points.find().fetch().length;
    },
    table: function() {
        return Tables.findOne({ _id: Router.current().params._id })
    },
    memberHasChosen: function () {
        return Estimations.findOne({
            uid: Meteor.user()._id,
            userStoryId: helpers.table().currentUserStoryId,
            table: helpers.table()._id
        });
    },
    activeCard: function () {
        if (helpers.memberHasChosen()) {
            var chosenNumber = helpers.memberHasChosen().numberId;
            return this.id == chosenNumber
        }
    }
};

Template.tablePlay.helpers(helpers);
