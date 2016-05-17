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
          Session.set('errorMessage', '');
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
  },
  "click .delete-taiga-instance": function (event, template) {
    event.preventDefault();
    Meteor.call('instance-delete', this._id);
  }
});

Template.login.helpers({
  instances: function () {
    return Instances.find({}, { sort: {'used': -1} })
  },
  errorMessage: function () {
    return Session.get('errorMessage');
  },
  favIcon: function () {
    var parser = document.createElement('a');
    parser.href = this.url;
    var hostnameSplitted = parser.hostname.split('.');
    var hostname = hostnameSplitted[hostnameSplitted.length - 2] + '.' +  hostnameSplitted[hostnameSplitted.length - 1];
    return 'https://icons.better-idea.org/icon?url=' + hostname + '&size=32';
  }
});