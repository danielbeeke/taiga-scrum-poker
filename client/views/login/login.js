Template.login.events({
  "click .button": function (event, template) {
    var login = {
      name: template.find('[name="name"]').value,
      password: template.find('[name="password"]').value
    };

    Accounts.callLoginMethod({
      methodArguments: [login],
      userCallback: function (err) {
        if (!err) {
          Router.go('rooms')
        }
      }
    })
  },
  "click #create-taige-url": function (event, template) {
    Router.go('instance-create');
  }
});

Template.login.helpers({
  instances: function () {
    return Instances.find()
  },
  first: function (index) {
    if (index == 0) {
      return 'checked'
    }
  }
})