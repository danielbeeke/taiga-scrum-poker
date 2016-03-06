Template.login.events({
  "submit #login-form": function (event, template) {
    event.preventDefault()

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
  "click .button": function (event, template) {
    $(template.find('#login-form')).submit()
  },
  "click #create-taige-url": function (event, template) {
    setTimeout(function () {
      Router.go('instance-create');
    }, 500)
  },
  "click .label": function (event, template) {
    $(template.find('.radios-as-select')).addClass('just-clicked').one('mouseout', function () {
      var that = this;
      setTimeout(function () {
        $(that).removeClass('just-clicked')
      }, 1000)
    })
  }
});

Template.login.helpers({
  instances: function () {
    return Instances.find({}, { sort: {'used': -1} })
  },
  first: function (index) {
    if (index == 0) {
      return 'checked'
    }
  },
  errorMessage: function () {
    return Session.get('errorMessage');
  }
})