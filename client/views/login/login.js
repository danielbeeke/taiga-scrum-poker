Template.login.events({
  "submit #login-form": function (event, template) {
    event.preventDefault();

    var login = {
      name: template.find('[name="name"]').value,
      password: template.find('[name="password"]').value,
      url: template.find('[name="taiga-url"]:checked').value
    };

    Accounts.callLoginMethod({
      methodArguments: [login],
      userCallback: function (error) {
        if (!error) {
          Router.go('rooms')
        }
        else {
          Session.set('errorMessage', 'Something went wrong, please try again.');
        }
      }
    })

  },
  "click #create-taige-url": function (event, template) {
    setTimeout(function () {
      Router.go('instance-create');
    }, 500)
  }
});

Template.login.helpers({
  instances: function () {
    return Instances.find({}, { sort: {'used': -1} })
  },
  errorMessage: function () {
    return Session.get('errorMessage');
  }
})