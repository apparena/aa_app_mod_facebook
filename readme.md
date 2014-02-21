# App-Arena.com App Module: Facebook
Github: https://github.com/apparena/aa_app_mod_facebook

Docs:   http://www.appalizr.com/index.php/facebook.html

This is a module of the [aa_app_template](https://github.com/apparena/aa_app_template)

## Module job
Handles all interactions with the Facbook API. 
Login, Share, Friend Selector, Send, OpenGraph Posts

### Dependencies
* Nothing

### Load module with requirejs
```
modules/aa_app_mod_facebook/js/views/FacebookView
```
## Module methodes
### Multi Friend Selector
To call the Multi Friend Selector use the following snippet:
```
facebook.model_friends.set({
    title:   'mein App Titel',
    message: 'Meine Nachricht an meine Freunde',
    data:    {}
});

facebook.login('email', function(){
    facebook.friendsSelector();
});
```

### Facebook Share
To call the Facebook Share Function use the following snippet:
```
facebook.model_share.set({
    link:        '', // link in the message
    picture:     '', // image
    name:        '', // title
    caption:     '', // subtitle
    description: ''  // message
});

facebook.login('email', function(){
    facebook.share();
});
```
For full list of elements -> [Facebook Documentation Share](https://developers.facebook.com/docs/reference/dialogs/feed/)

### Facebook Send
To call the Facebook Send Function use the following snippet:
```
facebook.login('email', function(){
    var options = new Object();
    options.title = ''; //title
    options.link = ''; //link
    options.redirect_uri = ''; //redirection after click on send button
    facebook.send(options);
});
```
For full list of elements -> [Facebook Documentation Send](https://developers.facebook.com/docs/reference/dialogs/send/)

### Facebook Post
To call the Facebook Send Function use the following snippet:
```
facebook.login('email', function(){
    var obj = new Object();
    obj.title = ''; //title
    obj.message = ''; //message
    obj.redirect_uri = ''; //redirection after click on send button
    facebook.send(obj);
});
```
For full list of elements -> [Facebook Documentation Post](https://developers.facebook.com/docs/reference/api/post/)
