Template.tables.helpers({
   tables: function () {
      return Tables.find({})
   }
});

Template.tables.onRendered = function () {
   Meteor.subscribe('tables');
   Meteor.subscribe('users');
   Meteor.subscribe('projects');
};