var previousRoute;

var animations = {
  'login_TO_instance-create': function (next) {
    $('.login-form-wrapper .form-items').on('transitionend', function (e) {
     if (e.target == $('.login-form-wrapper .form-items')[0] && e.originalEvent.propertyName == 'max-height') {
       next();
     }
    });

    setTimeout(function () {
      $('.login-form-wrapper .form-items').addClass('overflowHidden')
    }, 300);

  },
  'instance-create_TO_login': function (next) {
    $('.instance-create-form-wrapper .form-items').on('transitionend', function (e) {
      if (e.target == $('.instance-create-form-wrapper .form-items')[0] && e.originalEvent.propertyName == 'max-height') {
        next();
      }
    });
  }
};

Router.configure({
  layoutTemplate: 'main',
  loadingTemplate: 'loading',
  onBeforeAction: function () {
    var next = this.next;
    var proxyNext = function () {
      setTimeout(function () {
        $('body').attr('data-animation', '');
      }, 300);
      next();
    }
    var routeName = Router.current().route.getName();
    var animationName = previousRoute + '_TO_' + routeName;

    if (!Meteor.user() && routeName != 'instance-create' && routeName != 'login') {
      Router.go('login')
    }

    if (routeName == 'table-play') {
      Meteor.call('tables-user-visit', this.params._id);
    }

    if (this.params._id && routeName != 'table' && routeName != 'table-play') {
      Meteor.call('tables-user-leave', this.params._id);
    }

    if (animations[animationName]) {
      animations[animationName](proxyNext);
      $('body').attr('data-animation', animationName);
    }
    else {
      next();
    }
  },
  onStop: function () {
    previousRoute = Router.current().route.getName();
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