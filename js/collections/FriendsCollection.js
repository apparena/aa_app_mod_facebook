define([
    'CollectionExtend',
    'underscore',
    'backbone',
    'modules/aa_app_mod_facebook/js/models/SelectedFriendModel',
    'localstorage'
], function (Collection, _, Backbone, SelectedFriendModel) {
    'use strict';

    return function () {
        Collection.namespace = 'facebookFriendsCollection';

        Collection.code = Backbone.Collection.extend({
            localStorage: new Backbone.LocalStorage('AppArenaAdventskalenderApp_SelectedFacebookFirends'),

            model: SelectedFriendModel().code,

            initialize: function () {
                this.fetch();
            }
        });

        return Collection;
    }
});