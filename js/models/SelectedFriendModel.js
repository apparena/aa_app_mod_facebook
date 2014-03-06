define([
    'ModelExtend',
    'underscore',
    'backbone'
], function (Model, _, Backbone) {
    'use strict';
    return function () {
        Model.namespace = 'facebookSelectFriendsModel';

        Model.code = Backbone.Model.extend({
            defaults: {
                module:     'aa_app_mod_facebook',
                action:     'saveFriends',
                fbid:       '',
                request_id: ''
            }
        });

        return Model;
    }
});