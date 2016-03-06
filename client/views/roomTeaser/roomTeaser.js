Template.roomTeaser.helpers({
    members: function () {
        return Meteor.users.find({ _id: { $in: this.members } });
    },
    project: function () {
        return Projects.findOne({ _id: parseInt(this.project) });
    }
});