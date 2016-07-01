Template.login.events({
  "submit #login-form": function (event, template) {
    event.preventDefault();

    template.$('[name="name"]').addClass('used');
    template.$('[name="password"]').addClass('used');
    template.$('.radios-as-select').addClass('used');

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
          $('.button').on('animationend', function () {
            Router.go('tables')
          }).addClass('success');
        }
        else {
          Session.set('errorMessage', 'Something went wrong, please try again.');
        }
      }
    })

  },
  "click #create-taige-url": function (event, template) {
    Router.go('instance-create');
  },
  "click .delete-taiga-instance": function (event, template) {
    var that = this;
    event.preventDefault();
    template.$(event.target).parents('.radios-as-select').addClass('hover');
    template.$(event.target).parent().parent().on('transitionend', function (e) {
      if (e.originalEvent.propertyName == 'max-height') {
        $('.radios-as-select').removeClass('just-clicked').removeClass('hover');
        Meteor.call('instance-delete', that._id);
      }
    }).addClass('deleted');
    event.stopImmediatePropagation();
  },
  "click .radios-as-select": function (event, template) {
    template.$(event.target).addClass('hover');
  },
  "click .radios-as-select .label": function (event, template) {
    template.$(event.target).parents('.radios-as-select').addClass('used').addClass('just-clicked').one('mouseout', function () {
      var that = this;
      setTimeout(function () {
        $(that).removeClass('just-clicked').removeClass('hover')
      }, 1000)
    })
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