# App-Arena.com App Module: Facebook
**Github:** https://github.com/apparena/aa_app_mod_facebook
**Docs:** http://www.appalizr.com/index.php/facebook.html

This is a module of the [aa_app_template](https://github.com/apparena/aa_app_template)

## Module job
Handles all interactions with the Facbook API.
Login, Share, Friend Selector, Send, OpenGraph Posts

### Dependencies
* Nothing

### Important functions
* **addClickEventListener** - add a click event to login buttons with a css class .fbconnect
* **login** - start facebook login process
    * **scope** - FB login scope
    * **callback** - callback function
* **getUserData** - get userdata from facebook after login (automatically called)
* **logout** - logout from facebook
* **autoGrow** - start the FB.Canvas.setAutoGrow function
* **scrollTo** - scroll the fanpage tab to a defined position
    * **left** - scroll position in px from left left as integer
    * **top** - scroll position in px from top left as integer
* **getScrollPosition** - get current scroll position in fanpage tab
    * **callback** - callback function
* **share** - shares information over fbUiCall with information from share model
    * **callback** - callback function
* **friendsSelector** - Shows the friend selector facebook window without currently selected friends. Is called on all elements with the css class .btn-facebook-mfs.
    * **elem** - button element
    * **callback** - callback function
    * **data** - additional data, that can be stored into database. If is empty, we try to get them from the button tag data-additional. (As string)
* **getSelectedFriends** - Get the selected friends from the collections. This function is used in friendsSelector(...)
* **like** - set a callback function to all like buttons
    * **callback** - callback function
* **send** - Facebook send dialog
    * **options** - name, message, link, picture, redirect_uri, to, callback
    * **callback** - callback function
* **openGraphPost** - sent an open graph post
    * **obj** - name, message, link, picture, redirect_uri, to, callback
    * **callback** - callback function

### Examples
#### Multi Friend Selector
To call the Multi-Friend-Selector use the following snippet:
```javascript
facebook.model_friends.set({
	title:   'mein App Titel',
	message: 'Meine Nachricht an meine Freunde'
});

facebook.friendsSelector();
```

#### Share
To call the Facebook Share Function use the following snippet:
```javascript
require([
    'modules/aa_app_mod_facebook/js/views/FacebookView',
    'modules/aa_app_mod_share/js/models/ShareInfosModel'
], function (Facebook, hareInfoModel) {
    var facebook = Facebook().init({init: true}),
        shareInfos = ShareInfoModel().init({init: true});
    facebook.model_share.set({
        link:        shareInfos.get('url'),
        picture:     shareInfos.get('image'),
        name:        shareInfos.get('title'), // title
        caption:     '',                      // subtitle
        description: shareInfos.get('desc')   // message
    });
    facebook.libInit().share();
});
```
For full list of elements -> [Facebook Documentation Share](https://developers.facebook.com/docs/reference/dialogs/feed/)

#### Send
To call the Facebook Send Function use the following snippet:
```javascript
facebook.login('email', function(){
    var options = new Object();
    options.title = ''; //title
    options.link = ''; //link
    options.redirect_uri = ''; //redirection after click on send button
    facebook.send(options);
});
```
For full list of elements -> [Facebook Documentation Send](https://developers.facebook.com/docs/reference/dialogs/send/)

#### Open-Graph Post
To call the Facebook Open-Graph Post Function use the following snippet with additional parameters:
```javascript
require(['modules/aa_app_mod_facebook/js/views/FacebookView'], function (Facebook) {
    Facebook().init().openGraphPost({
        'action': _.c('open_graph_action'),
        'object': _.c('open_graph_object'),
        'params': '&share-team=' + attr.team_id + '&general_title=' + _.t('team') + ' ' + attr.name
    });
});
```
For full list of elements -> [Facebook Documentation Send](https://developers.facebook.com/docs/reference/api/post/)


#### Like button with callback function
To call the Facebook Open-Graph Post Function use the following snippet with additional parameters:
```javascript
require(['modules/aa_app_mod_facebook/js/views/FacebookView'], function (Facebook) {
    var facebook = Facebook().init({init: true});

    facebook.libInit();
    facebook.like(function () {
        // after a like click, we save the click as a fan flag to database
        that.saveAsFan({
            target: {
                className: 'fangate_btn_facebook'
            }
        });

        // close fangate if user liked the page, but only if activated or only FB button is shown
        if ((social_networks.indexOf('gplus') === -1 && social_networks.indexOf('twitter') === -1) || _.c('fangate_close_on_like').toString() !== '0') {
            $('#fangateModal').modal('hide');
        }
    });
});
```

#### Scrolling functions for a fanpage tab
Scroll fanpage tab to top position (maybe for notifications):
```javascript
require(['modules/aa_app_mod_facebook/js/views/FacebookView'], function (Facebook) {
    // scroll to top in FB-Tab
    Facebook().init().scrollTo(0, 0);
});
```

| param | description |
|--------|--------|
| left | position in px from top left as integer |
| top | position in px from top left as integer |

Scroll fanpage tab to special position to show the notification module window on the right place:
```javascript
require([
    'modules/aa_app_mod_facebook/js/views/FacebookView',
    'modules/aa_app_mod_notification/js/views/NotificationView'
], function (FacebookView, NotificationView) {
    var facebook = FacebookView().init();

    // define notification position in facebook tabs. works also on normal pages
    facebook.getScrollPosition(function (position) {
        // in this callback we define the notification options
        var options = {
            title:       _.t('msg_login_wrongdata_title'),
            description: _.t('msg_login_wrongdata_description'),
            type:        'notice'
        };

        // now we define the notification position with the parameter
        if (position !== false) {
            options.before_open = function (pnotify) {
                pnotify.css({
                    'top':  position.top,
                    'left': 810 - pnotify.width()
                });
            };
            options.position = '';
        }

        // show notification
        NotificationView().init().setOptions(options, true).show();
    });
});
```

#### Fanpage tab autoGrow
Adaptive function to the original FB.Canvas.setAutoGrow:
```javascript
require(['modules/aa_app_mod_facebook/js/views/FacebookView'], function (Facebook) {
    Facebook().init().libInit().autoGrow();
});
```
Additional information on: https://developers.facebook.com/docs/reference/javascript/FB.Canvas.setAutoGrow/

### Load module with require
```
modules/aa_app_mod_facebook/js/views/FacebookView
```

#### App-Manager config values
| config | default | description |
|--------|--------|--------|
| general_title | empty | app title |
| general_desc | empty | app description |

#### App-Manager locale values
| locale | value example |
|--------|--------|
| share_lang | de |