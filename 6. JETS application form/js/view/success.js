define(['jquery', 'underscore', 'backbone', 'text!template/success.html', 'select2', 'data', 'model/session', 'questionnaire_dataPreparation'], function ($, _, Backbone, template, select2, data, Session, dataPreparation) {
    return Backbone.View.extend({
        tagname: 'div',
        className: ['container', 'success-container'],
        template: template,

        initialize: function () {
            this.render()
        },

        events: {
            'click #submitButton': async function () {
                if (await dataPreparation()) {
                    Backbone.Events.trigger('surveySuccess')
                    $('#questionnaire_modal').modal('hide');
                } else {
                    
                }
            },


        },

        render: function () {
            var that = this;
            this.$el.html(_.template(this.template));

            $(document).ready(function () {
                $(window).scrollTop(0)
                if ($('#body').height() + 100 > window.innerHeight) {
                    $('body').css('position', 'relative')
                    $('footer').css('bottom', -$('footer').height() + 'px')
                } else {
                    $('body').css('position', 'static')
                    $('footer').css('bottom', 0)
                }
                data.nationalities.forEach(e => {
                    $('#nationality').append('<option value="' + e + '">' + e + '</option>');
                })

                //Questionnaire Modal
                $('#questionnaire_modal').modal('show')
                $('#nationality').select2({
                    placeholder: 'Select Nationality'
                })

            });
        },


    })
})
