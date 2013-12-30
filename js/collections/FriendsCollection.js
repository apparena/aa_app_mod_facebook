define([
    'underscore',
    'backbone',
    'modules/facebook/js/models/SelectedFriendModel',
    'localstorage'
], function (_, Backbone, SelectedFriendModel) {
    'use strict';

    var namespace = 'facebookFriendsCollection',
        Collection, Init, Remove, Instance;

    Collection = Backbone.Collection.extend({
        localStorage: new Backbone.LocalStorage('AppArenaAdventskalenderApp_SelectedFacebookFirends'),

        model: SelectedFriendModel.model,

        initialize: function () {
            this.fetch();
        }
    });

    Remove = function () {
        _.singleton.collection[namespace].unbind().remove();
        delete _.singleton.collection[namespace];
    };

    Init = function (init) {

        if (_.isUndefined(_.singleton.collection[namespace])) {
            _.singleton.collection[namespace] = new Collection();
        } else {
            if (!_.isUndefined(init) && init === true) {
                Remove();
                _.singleton.collection[namespace] = new Collection();
            }
        }

        return _.singleton.collection[namespace];
    };

    Instance = function () {
        return _.singleton.collection[namespace];
    };

    return {
        init:        Init,
        collection:  Collection,
        remove:      Remove,
        namespace:   namespace,
        getInstance: Instance
    };
});