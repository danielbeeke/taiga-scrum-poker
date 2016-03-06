Router.configure({
  layoutTemplate: 'main',
  loadingTemplate: 'loading',
  onBeforeAction: function () {
    var routeName = Router.current().route.getName();
    if (!Meteor.user() && routeName != 'instance-create') {
      Router.go('login')
    }
    if (routeName != 'room' && routeName != 'room-play') {
      Meteor.call('rooms-user-leave', this.params._id);
    }
    this.next();
  }
});

Router.route('/', function () {
  Router.go('rooms')
});

Router.route('/login', {
  name: 'login',
  title: 'Login',
  layoutTemplate: false,
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

Router.route('/rooms', {
  name: 'rooms',
  title: 'Rooms',
  waitOn: function() {
    return [
      Meteor.subscribe('rooms'),
      Meteor.subscribe('users')
    ];
  }
});

Router.route('/rooms/create', {
  name: 'rooms-create',
  title: 'Create a room',
  waitOn: function() {
    return Meteor.subscribe('projects');
  }
});

Router.route('/rooms/:_id', {
  name: 'room',
  title: 'Room',
  waitOn: function() {
    return [
      Meteor.subscribe('rooms', this.params._id),
      Meteor.subscribe('estimations', this.params._id),
      Meteor.subscribe('users')
    ];
  }
});

Router.route('/rooms/:_id/play', {
  name: 'room-play',
  layoutTemplate: false,
  title: 'Room',
  waitOn: function() {
    return [
      Meteor.subscribe('rooms', this.params._id),
      Meteor.subscribe('estimations', this.params._id),
      Meteor.subscribe('users')
    ];
  },
  onBeforeAction: function () {
    Meteor.call('rooms-user-visit', this.params._id);
    this.next();
  }
});


Router.route('/instances/create', {
  name: 'instance-create',
  title: 'Create an instance',
  waitOn: function() {
    return Meteor.subscribe('instances');
  }
});