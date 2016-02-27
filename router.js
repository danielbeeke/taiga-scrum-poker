Router.configure({
  layoutTemplate: 'main',
  loadingTemplate: 'loading',
});

Router.route('/', function () {
  Router.go('rooms')
});

Router.route('/login', {
  name: 'login',
  title: 'Login'
});

Router.route('/logout', function () {
  Meteor.logout();
  Router.go('login');
});

Router.route('/rooms', {
  name: 'rooms',
  title: 'Rooms',
  waitOn: function() {
    return Meteor.subscribe('rooms');
  }
});

Router.route('/rooms/create', {
  name: 'rooms-create',
  title: 'Create a room',
  waitOn: function() {
    return Meteor.subscribe('projectsHandle');
  }
});

Router.route('/rooms/:_id', {
  name: 'room',
  title: 'Room',
  waitOn: function() {
    return Meteor.subscribe('rooms', this.params._id);
  }
});