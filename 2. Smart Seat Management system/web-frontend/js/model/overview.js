define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    var Overview = Backbone.Model.extend({

        url: `${window.location.origin}${window.location.pathname}overview`,
        initialize: function() {
            // this.fetch();
        }
    });

    return new Overview();
})