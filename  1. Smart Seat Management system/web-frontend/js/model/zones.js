define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var Zones = Backbone.Model.extend({

        url: `${window.location.origin}${window.location.pathname}zones`,
        initialize: function() {
            // this.fetch();
        }
    });

    return new Zones();
})