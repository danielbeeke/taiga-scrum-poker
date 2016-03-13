Accounts.registerLoginHandler('taiga', function(loginRequest) {

  var result = HTTP.call('POST', loginRequest.url + '/auth', {
    params: {
      type: 'normal',
      username: loginRequest.name,
      password: loginRequest.password
    }
  });

  if (result.statusCode == 200) {
    var userId = null;
    var user = Meteor.users.findOne({ username: loginRequest.name });
    if(!user) {
      userId = Meteor.users.insert({ username: loginRequest.name });
    } else {
      userId = user._id;
    }

    // Creating the token and adding to the user
    var stampedToken = Accounts._generateStampedLoginToken();
    // Hashing is something added with Meteor 0.7.x,
    // You don't need to do hashing in previous versions
    var hashStampedToken = Accounts._hashStampedToken(stampedToken);

    console.log(loginRequest)

    Meteor.users.update(userId, {
      $set: {
        'taiga.bearer': result.data.auth_token,
        'taiga.id': result.data.id,
        'taiga.url': loginRequest.url,
        'avatar': result.data.photo
      },
      $push: { 'services.resume.loginTokens': hashStampedToken }
    });

    Instances.update({ url: loginRequest.url }, {
      $set: {
        'used': Date.now()
      },
    });

    //sending token along with the userId
    return {
      userId: userId,
      token: stampedToken.token
    }
  }
})
