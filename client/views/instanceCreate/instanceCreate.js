Template.instanceCreate.events({
    "submit #instance-create-form": function (event, template) {
        event.preventDefault();

        var instanceUrl = template.find('[name="instance-url"]').value;
        var instanceName = template.find('[name="instance-name"]').value;

        Meteor.call('instance-create', {
            url: instanceUrl,
            name: instanceName
        }, function (error) {
            $('.button').on('animationend', function () {
                Router.go('login');
            }).addClass('success');
        })
    }
});
