define(['jquery', 'underscore', 'backbone', 'api_config'], function($, _, Backbone, api_config) {
    var sessionModel = Backbone.Model.extend({
        url: api_config.protocol + api_config.domain + api_config.path + 'applicationtoken',
        defaults: {
            applicationtoken: '',
            
            
            expire: '',
            result_code: '',
            uuid: '',
            // complete: false
        },
        update: async function() {
            var success = false;
            for (let i = 0; i < 2 && !success; i++) {
                await new Promise((resolve, reject) => {
                    this.fetch({
                        success: function() {
                            success = true;
                            resolve()
                        },
                        error: async function() {
                            resolve();
                            console.log('Try ' + i + ': Token renew failed');
                        }
                    })
                })
            }
            if (success) {
                Backbone.Events.trigger('showError', 'sessionTimeOut');
                return true;
            }
            return false;
        }
    })
    return new sessionModel();
})