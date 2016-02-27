Template.login.events({
  "submit #login": function (event, template) {
    event.preventDefault();

    var login = {
      name: template.find('[name="name"]').value,
      password: template.find('[name="password"]').value
    };

    Accounts.callLoginMethod({
      methodArguments: [login],
      userCallback: function (err) {
        if (!err) {
          Router.go('rooms')
        }
      }
    })
  }
});
