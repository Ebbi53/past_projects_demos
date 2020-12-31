define(['jquery', 'underscore', 'backbone', 'text!template/form.html', 'file_upload', 'router', 'model/applicant', 'fileUpload', 'jquery.iframe-transport', "core-js/modules/es6.date.to-json", "core-js/modules/es6.array.find", "core-js/modules/es6.function.name", "core-js/modules/es7.array.includes", "core-js/modules/es6.string.includes"], function ($, _, Backbone, template, fileUpload, Router, applicantModel, upload, fileUploadIframe, _es6Date, _es6Array, _es6Function, _es7Array, _es6String) {
    return Backbone.View.extend({
        tagname: 'div',
        className: 'fadeIn',
        id: 'form',
        template: template,
        initialize: function initialize() {
            this.render();
        },
        events: {
            'click #submitBtn': function clickSubmitBtn(e) {
                if ($('input[name=principal_reference_letter]').val() == '') {
                    Backbone.Events.trigger('showError', 'validation');
                    return;
                }

                var filesList = [],
                    paramName = [];
                $('input[type="file"]').each(function () {
                    if ($(this).prop('files').length) {
                        filesList.push($(this).prop('files')[0]);
                        paramName.push($(this).prop('name'));
                    }
                });
                $('#fileUpload').fileupload('send', {
                    files: filesList,
                    paramName: paramName
                });
            },
            'change input[type=file]': function changeInputTypeFile(e) {
                if ($(e.currentTarget).prop('files')[0].size > 4000000) {
                    Backbone.Events.trigger('showError', 'fileSize');
                    $(e.currentTarget).val('');
                    return;
                }

                if (!$(e.currentTarget).prop('files')[0].name.toLowerCase().includes($(e.currentTarget).attr('accept'))) {
                    Backbone.Events.trigger('showError', 'fileType');
                    $(e.currentTarget).val('');
                    return;
                }

                $(e.currentTarget).parents('.form-group').children('div.col-md-6').toggle();
                $(e.currentTarget).parents('.form-group').find('span.fileStatus i').text($(e.currentTarget).prop('files')[0].name + ' chosen.');
            },
            'click button.undoBtn': function clickButtonUndoBtn(e) {
                $(e.currentTarget).parents('.form-group').find('input').val('');
                $(e.currentTarget).parents('.form-group').children('div.col-md-6').toggle();
            }
        },
        render: function render() {
            this.$el.html(_.template(this.template)(applicantModel.toJSON()));
            $(document).ready(function () {
                $('footer').show();
                $(window).scrollTop(0)
                if ($('#body').height() + 100 > window.innerHeight) {
                    $('body').css('position', 'relative');
                    $('footer').css('bottom', -$('footer').height() + 'px');
                } else {
                    $('body').css('position', 'static');
                    $('footer').css('bottom', 0);
                }

                fileUpload.init();
                var isIE =
                    /*@cc_on!@*/
                    false || !!document.documentMode;
                if (isIE) {
                    $('input[type=file]').click(function(e) {
                        e.stopPropagation();
                    })
                    $('button.fileinput-button').click(function(e) {
                        $(e.currentTarget).find('input').trigger('click')
                    })
                }
            });
        }
    });
});