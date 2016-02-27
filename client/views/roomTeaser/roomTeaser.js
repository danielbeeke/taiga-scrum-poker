Template.roomTeaser.helpers({
    members: function () {
        return Meteor.users.find({ _id: { $in: this.members } });
    }
});