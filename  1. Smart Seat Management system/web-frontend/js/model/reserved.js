define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var Reserved = Backbone.Model.extend({

        url: `${window.location.origin}${window.location.pathname}reserved`,
        initialize: function() {
            // this.fetch();
        }
    });

    return new Reserved();
})