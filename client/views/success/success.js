var isRequesting = false;

Template.success.helpers({
    url: false,
    gifUrl: function () {
        if (!isRequesting) {
            isRequesting = true;
            $.ajax({
                url: "http://api.giphy.com/v1/gifs/search?q=good&api_key=dc6zaTOxFJmzC"
            }).done(function(result) {
                var randomItem = Math.floor((Math.random() * 25) + 1);
                Session.set('imageUrl', result.data[randomItem].images.original.url);
            });
        }

        return Session.get('imageUrl');
    }
});
