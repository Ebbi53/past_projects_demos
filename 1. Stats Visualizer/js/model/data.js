define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var sessionModel = Backbone.Model.extend({
        url: '',
        defaults: {
            applicationtoken: '',
            
            
            expire: '',
            result_code: '',
            uuid: '',
            // complete: false
        },
    })
    return new sessionModel();
})