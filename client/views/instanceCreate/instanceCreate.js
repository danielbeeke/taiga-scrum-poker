Template.instanceCreate.events({
    "click .button": function (event, template) {
        var instanceUrl = template.find('[name="instance-url"]').value;

        Meteor.call('instance-create', instanceUrl, function (error) {
            Router.go('login');
        })
    }
});
