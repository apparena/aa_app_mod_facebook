define([
    'ModelExtend',
    'underscore',
    'backbone'
], function (Model, _, Backbone) {
    'use strict';

    return function () {
        Model.namespace = 'facebookShareModel';

        Model.code = Backbone.Model.extend({
            defaults: {
                method:      'feed',
                link:        '',        // link in the message
                picture:     '',        // image in the message
                name:        '',        // title
                caption:     '',        // subtitle
                description: ''         // message
            }
        });

        return Model;
    }
});