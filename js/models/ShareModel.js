define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var namespace = 'facebookShareModel',
        Model, Init, Remove, Instance;

    Model = Backbone.Model.extend({
        defaults: {
            method:      'feed',
            link:        '',        // link in the message
            picture:     '',        // image in the message
            name:        '',        // title
            caption:     '',        // subtitle
            description: ''         // message
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