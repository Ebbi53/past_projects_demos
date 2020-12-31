define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var Available = Backbone.Model.extend({

        url: `${window.location.origin}${window.location.pathname}available`,
        initialize: function() {
        
        }
    });

    return new Available();
})