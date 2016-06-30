var previousRoute;

var animations = {
  'login_TO_instance-create': function (next) {
    setTimeout(function () {
      $('.login-form-wrapper .form-items').addClass('overflowHidden').on('transitionend', function (e) {
        setTimeout(function () {
          next();
        }, 2000);
      })
    }, 300)
  }
};

Router.configure({
  layoutTemplate: 'main',
  loadingTemplate: 'loading',
  onBeforeAction: function () {
    var next = this.next;
    var routeName = Router.current().route.getName();

    if (!Meteor.user() && routeName != 'instance-create') {
      Router.go('login')
    }

    if (routeName == 'table-play') {
      Meteor.call('tables-user-visit', this.params._id);
    }

    if (routeName != 'table' && routeName != 'table-play') {
      Meteor.call('tables-user-leave', this.params._id);
    }

    if (previousRoute && routeName) {
      var animationName = previousRoute + '_TO_' + routeName;
      $('body').attr('data-animation', animationName);

      if (animations[animationName] && typeof animations[animationName] == 'function') {
        animations[animationName](next);
      }
    }
    else {
      previousRoute = routeName;
      next();
    }
  }
});

Router.route('/', function () {
  if (!Meteor.user()) {
    Router.go('login')
  }
  else {
    Router.go('tables')
  }
});

Router.route('/login', {
  name: 'login',
  title: 'Login',
  //layoutTemplate: false,
  waitOn: function() {
    return [
      Meteor.subscribe('instances')
    ];
  }
});

Router.route('/logout', function () {
  Meteor.logout();
  Router.go('login');
});

Router.route('/tables', {
  name: 'tables',
  title: 'Tables',
  waitOn: function() {
    return [
      Meteor.subscribe('tables'),
      Meteor.subscribe('users'),
      Meteor.subscribe('projects')
    ];
  }
});

Router.route('/tables/create', {
  name: 'tables-create',
  title: 'Create a table',
  waitOn: function() {
    return Meteor.subscribe('projects');
  }
});

Router.route('/tables/:_id', {
  name: 'table',
  title: 'Table',
  waitOn: function() {
    return [
      Meteor.subscribe('tables', this.params._id),
      Meteor.subscribe('estimations', this.params._id),
      Meteor.subscribe('users')
    ];
  }
});

Router.route('/tables/:_id/:issue', {
  name: 'table-issue',
  title: 'Table',
  waitOn: function() {
    return [
      Meteor.subscribe('tables', this.params._id),
      Meteor.subscribe('estimations', this.params._id),
      Meteor.subscribe('users')
    ];
  }
});

Router.route('/success', {
  name: 'success',
  title: 'Success'
});


Router.route('/instances/create', {
  name: 'instance-create',
  title: 'Create an instance',
  waitOn: function() {
    return Meteor.subscribe('instances');
  }
});