define([
    'ModelExtend',
    'underscore',
    'backbone',
    'localstorage'
], function (Model, _, Backbone) {
    'use strict';

    return function () {
        Model.namespace = 'facebookLoginModel';

        Model.code = Backbone.Model.extend({
            localStorage: new Backbone.LocalStorage('aa_app_mod_facebook_' + _.aa.instance.i_id + '_FbLoginData'),

            defaults: {
                'id':         1,
                'verified':   false,
                'fbid':       '',
                'email':      '',
                'firstname':  '',
                'lastname':   '',
                'city':       '',
                'gender':     'men',
                'login_type': 'fbuser',
                'logintime':  ''
            }
        });

        return Model;
    }
});