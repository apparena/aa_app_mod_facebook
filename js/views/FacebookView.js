require.config({
    paths: {
        'facebook_us': '//connect.facebook.net/en_US/all',
        'facebook_de': '//connect.facebook.net/de_DE/all'
    },
    shim:  {
        'facebook_us': {
            exports: 'FB'
        },
        'facebook_de': {
            exports: 'FB'
        }
    }
});

define([
    'ViewExtend',
    'jquery',
    'underscore',
    'backbone',
    'modules/aa_app_mod_facebook/js/models/ShareModel',
    'modules/aa_app_mod_facebook/js/models/FriendsModel',
    'modules/aa_app_mod_facebook/js/collections/FriendsCollection',
    'modules/aa_app_mod_facebook/js/models/LoginModel'
], function (View, $, _, Backbone, ShareModel, FriendsModel, FriendsCollection, LoginModel) {
    'use strict';

    return function () {
        View.namespace = 'facebook';

        View.code = Backbone.View.extend({
            el: $('#fb-root'),

            callbackStorage: null,

            initialize: function () {
                _.bindAll(this, 'createElement', 'libInit', 'addClickEventListener', 'login', 'getUserData',
                    'logout', 'autoGrow', 'autoScrollTo', 'scrollTo', 'getScrollPosition', 'share', 'friendsSelector',
                    'getSelectedFriends', 'saveSelectedFriends', 'saveFriendInDatabase', 'handleFriendReturns', 'handleCallback',
                    'fbUiCall', 'like', 'send', 'openGraphPost');

                // we must store the require config value into the global scope for build process
                this.facebook = 'facebook_us';
                if (_.t('share_lang') === 'de') {
                    this.facebook = 'facebook_de';
                }

                this.createElement();
                this.libInit();

                this.model_share = ShareModel().init();

                this.model_friends = FriendsModel().init();

                this.collection_friends = FriendsCollection().init();
                this.collection_friends.on('add', this.saveFriendInDatabase, this);

                this.model_login = LoginModel().init();
            },

            createElement: function () {
                var fb_element = $('#fb-root');

                if (_.isUndefined(fb_element) === false) {
                    fb_element = $('<div/>', {
                        id: 'fb-root'
                    });
                    $('body').prepend(fb_element);
                }
            },

            libInit: function () {
                if (!$('body').hasClass('fb-init')) {
                    require([this.facebook], function (FB) {
                        FB.init({
                            appId:               _.aa.instance.fb_app_id, // App ID
                            channelUrl:          _.aa.instance.fb_canvas_url + 'channel.html', // Channel File
                            status:              true, // check login status
                            cookie:              true, // enable cookies to allow the server to access the session
                            xfbml:               true, // parse XFBML
                            oauth:               true,
                            frictionlessRequest: true
                        });
                    });
                }
                return this;
            },

            addClickEventListener: function () {
                // add click event listener on FB login buttons
                var that = this,
                    connect = $('.fbconnect');
                connect.off('click');
                connect.on('click', function () {
                    that.login();
                });
            },

            login: function (scope, callback) {
                var that = this;
                require([this.facebook], function (FB) {
                    if (typeof scope !== 'string') {
                        scope = 'email';
                    }

                    FB.login(function (response) {
                        if (response.status === 'connected') {
                            if (typeof callback === 'function') {
                                callback(response);
                            } else {
                                that.getUserData(response);
                            }
                        }
                    }, {scope: scope});
                });
                return this;
            },

            getUserData: function () {
                var that = this;

                require([this.facebook], function (FB) {
                    FB.api('/me', function (response) {
                        var data = that.model_login.toJSON(),
                            city, birthday;

                        if (typeof( response.id ) !== 'undefined' && parseInt(response.id, 10) > 0) {
                            data.fbid = parseInt(response.id, 10);
                        }
                        if (typeof( response.email ) !== 'undefined' && response.email.length > 0) {
                            //_.debug.log('get FB mail:', response.email);
                            data.email = response.email;
                        }
                        if (typeof( response.first_name ) !== 'undefined' && response.first_name.length > 0) {
                            data.firstname = response.first_name;
                        }
                        if (typeof( response.last_name ) !== 'undefined' && response.last_name.length > 0) {
                            data.lastname = response.last_name;
                        }
                        // response format = MM/DD/YYYY, needed format = DD.MM.YYYY
                        if (typeof( response.birthday ) !== 'undefined' && response.birthday.length > 0) {
                            birthday = response.birthday.split('/');
                            data.birthday = birthday[1] + '.' + birthday[0] + '.' + birthday[2];
                        }
                        if (typeof( response.location ) !== 'undefined' && response.location.name.length > 0) {
                            city = response.location.name.split(',');
                            data.city = city[0];
                        }
                        data.gender = 'woman';
                        if (typeof( response.gender ) !== 'undefined' && response.gender === 'male') {
                            data.gender = 'men';
                        }
                        if (typeof( response.verified ) !== 'undefined' && response.verified === true) {
                            data.verified = response.verified;
                        }

                        that.model_login.set({
                            'fbid':      data.fbid,
                            'verified':  data.verified,
                            'email':     data.email,
                            'firstname': data.firstname,
                            'lastname':  data.lastname,
                            'city':      data.city,
                            'gender':    data.gender,
                            'logintime': _.uniqueId()
                        });
                        that.model_login.save();

                        // handle facebook focus bug in iframes
                        // @see: http://stackoverflow.com/questions/17173083/cant-edit-input-fields-inside-iframe-app-after-using-fb-login-on-firefox
                        window.parent.focus();

                        return this;
                    });
                });
            },

            logout: function () {
                require([this.facebook], function (FB) {
                    FB.getLoginStatus(function (response) {
                        //_.debug.log('response', response);

                        if (response.status === 'connected') {
                            FB.logout(function (response) {
                                //_.debug.log('user is now logged out', response);
                            });
                        }
                    });
                });

                return this;
            },

            autoGrow: function () {
                var body = $('body'),
                    that = this;
                if (body.hasClass('website') === false) {
                    require([this.facebook], function (FB) {
                        FB.Canvas.setAutoGrow();
                    });
                }
                return this;
            },

            autoScrollTo: function () {
                if ($('body').hasClass('website') === false) {
                    var pos = this.getScrollPosition();
                    this.scrollTo(pos.left, pos.top);
                }
                return this;
            },

            scrollTo: function (left, top) {
                if ($('body').hasClass('website') === false) {
                    require([this.facebook], function (FB) {
                        FB.Canvas.scrollTo(left, top);
                    });
                }
                return this;
            },

            getScrollPosition: function (callback) {
                if (typeof callback !== 'function') {
                    _.debug.warn('callback is not a function on FacebookView->getScrollPosition call');
                    return false;
                }

                if ($('body').hasClass('website') === false) {
                    require([this.facebook], function (FB) {
                        FB.Canvas.getPageInfo(function (info) {
                            //_.debug.log(info);

                            callback({
                                left: info.scrollLeft,
                                top:  info.scrollTop
                            });
                        });
                    });
                } else {
                    callback(false);
                }

                return this;
            },

            share: function (callback) {
                this.fbUiCall(this.model_share.toJSON(), callback);
            },

            friendsSelector: function (callback, door_id) {
                if (typeof callback !== 'function') {
                    callback = function () {
                        //do nothing
                    };
                }

                if (_.isUndefined(door_id)) {
                    door_id = _.current_door_id;
                }

                this.callbackStorage = callback;

                var that = this,
                    selected_friends = this.getSelectedFriends();
                this.model_friends.set('exclude_ids', selected_friends);
                this.fbUiCall(this.model_friends.toJSON(), function (resp) {
                    that.saveSelectedFriends(resp, door_id);
                });
            },

            getSelectedFriends: function () {
                return this.collection_friends.pluck('fbid');
            },

            saveSelectedFriends: function (response, door_id) {
                if (typeof response !== 'undefined') {
                    var that = this,
                        request_length = response.request.split(',');

                    this.log('action', 'user_facebook_friends_amount', {
                        auth_uid:      _.uid,
                        auth_uid_temp: _.uid_temp,
                        code:          5001,
                        data_obj:      {
                            'amount':      response.to.length,
                            'request_ids': response.request,
                            'door_id':     door_id
                        }
                    });

                    // start stored callback function
                    this.callbackStorage(response);

                    if (typeof response !== 'undefined' && typeof response.to !== 'undefined') {
                        // put all friends into a new model and store them in a collection
                        _.each(response.to, function (fbid) {
                            // create new model in the collection
                            that.collection_friends.create({
                                id:         fbid + _.aa.instance.i_id,
                                fbid:       fbid,
                                request_id: response.request
                            });
                        });
                    }
                }
            },

            saveFriendInDatabase: function () {
                // get last inserted model
                var last_model = _.last(this.collection_friends.models);
                last_model.set({
                    'auth_uid': _.uid,
                    'door_id':  _.current_door_id
                });
                // safe attribute into database
                this.ajax(last_model.attributes);
            },

            handleFriendReturns: function () {
                // create basic log entry, that user comes from a friend select request
                this.log('action', 'user_facebook_friends_return', {
                    auth_uid:      _.uid,
                    auth_uid_temp: _.uid_temp,
                    code:          5002,
                    data_obj:      {
                        'request_id': _.aa.fb.request_id,
                        'invited_by': _.aa.fb.invited_by,
                        'door_id':    _.aa.fb.invited_for_door
                    }
                });
            },

            handleCallback: function (callback) {
                if (typeof callback === 'undefind') {
                    callback = function (response) {
                    };
                }
                return callback;
            },

            fbUiCall: function (data, callback) {
                callback = this.handleCallback(callback);
                require([this.facebook], function (FB) {
                    FB.ui(data, callback);
                });
            },

            like: function (callback) {
                callback = this.handleCallback(callback);
                require([this.facebook], function (FB) {
                    FB.Event.subscribe('edge.create', callback);
                });
            },

            /**
             * Facebook send dialog
             * @param options - name, message, link, picture, redirect_uri, to, callback
             * @param callback
             * @see https://developers.facebook.com/docs/reference/dialogs/send/
             * @returns {*}
             */
            send: function (options, callback) {
                if (_.isUndefined(options) || typeof options !== 'object' || Object.keys(options).length < 6) {
                    return false;
                }
                if (typeof callback !== 'function') {
                    callback = function () {
                    };
                }
                require([this.facebook], function (FB) {
                    FB.ui({
                        method:       'send',
                        name:         options.title,
                        link:         options.link, // link in the message
                        redirect_uri: options.redirect_uri,//redirection after click on send button
                        to:           options.to
                    }, callback);
                });

                return this;
            },

            openGraphPost: function (obj, callback) {
                var that = this;
                require([this.facebook], function (FB) {
                    var fb_app_url = _.aa.instance.share_url + '&og-object=' + obj.object + '&share-door=' + obj.door_index;

                    //_.debug.log(fb_app_url);

                    that.login('publish_actions', function (resp) {
                        obj[obj.object] = fb_app_url;
                        FB.api(
                            '/me/' + _.aa.instance.fb_app_url + ':' + obj.action,
                            'post', obj,
                            function (resp) {
                                _.debug.log('open graph resp', resp);
                                if (typeof callback === 'function') {
                                    callback(resp);
                                }
                            }
                        );
                    });
                });

            }
        });

        return View;
    }
});