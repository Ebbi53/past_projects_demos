define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {
    var applicantModel = Backbone.Model.extend({
        defaults: {
            applicationtoken: '',
            uuid: '',
            applicant_name: '',
            submitted: false
        },
    })
    return new applicantModel();
})