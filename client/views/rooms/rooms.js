Template.rooms.onRendered(function () {

});

Template.rooms.helpers({
   rooms: function () {
      return Rooms.find({})
   }
});