define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var namespace = 'facebookFriendsModel',
        Model, Init, Remove, Instance;

    Model = Backbone.Model.extend({
        defaults: {
            method:      'apprequests',
            title:       '',        // Title of the request
            message:     '',        // Message send to the user. The user will only see the message, if he authorized your facebook app before.
            data:        {},        // Additional parameter, which can be passed with the request.
            exclude_ids: ''         // array with friend id's to disable selection
        }
    });

    Remove = function () {
        _.singleton.model[namespace].unbind().remove();
        delete _.singleton.model[namespace];
    };

    Init = function (init) {

        if (_.isUndefined(_.singleton.model[namespace])) {
            _.singleton.model[namespace] = new Model();
        } else {
            if (!_.isUndefined(init) && init === true) {
                Remove();
                _.singleton.model[namespace] = new Model();
            }
        }

        return _.singleton.model[namespace];
    };

    Instance = function () {
        return _.singleton.model[namespace];
    };

    return {
        init:        Init,
        model:       Model,
        remove:      Remove,
        namespace:   namespace,
        getInstance: Instance
    };
});