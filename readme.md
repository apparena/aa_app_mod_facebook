# App-Arena.com App Module: Facebook
Github: https://github.com/apparena/aa_app_mod_facebook

Docs:   http://www.app-arena.com/docs/display/developer

This is a module of the [aa_app_template](https://github.com/apparena/aa_app_template)

## Module job
...

### Dependencies
* Nothing

### Example
```
Multi Friend Selector
To Call the Multi Friend Selector use this snippet:

var facebook = FacebookView().init();

        facebook.model_friends.set({
            title:   'mein App Titel',
            message: 'Meine Nachricht an meine Freunde',
            data:    {}
        });

        facebook.login('email', function(){
            facebook.friendsSelector();
        });
```        

### Load module with require
```
modules/aa_app_mod_facebook/js/views/FacebookView
```
