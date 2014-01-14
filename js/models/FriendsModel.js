define([
    'ModelExtend',
    'underscore',
    'backbone'
], function (Model, _, Backbone) {
    'use strict';

    return function () {
        Model.namespace = 'facebookFriendsModel';

        Model.code = Backbone.Model.extend({
            defaults: {
                method:      'apprequests',
                title:       '',        // Title of the request
                message:     '',        // Message send to the user. The user will only see the message, if he authorized your facebook app before.
                data:        {},        // Additional parameter, which can be passed with the request.
                exclude_ids: ''         // array with friend id's to disable selection
            }
        });

        return Model;
    }
});