define(['jquery', 'underscore', 'backbone', 'jquery.iframe-transport', 'fileUpload', 'model/applicant', 'router', 'api_config'], function ($, _, Backbone, fileUploadIframe, fileUpload, applicantModel, Router, api_config) {

    var init = function () {
        $('#fileUpload').fileupload({
            url: api_config.protocol + api_config.domain + api_config.path + "principal",
            maxFileSize: 4000000, //4MB //Not supported by all browsers
            dataType: 'json',
            formData: {
                "data": JSON.stringify({
                    "id": applicantModel.get('uuid'),
                    "token": applicantModel.get('applicationtoken')
                }),
                "file-meta-data": JSON.stringify({
                    "consent": ""
                })
            },

            add: function (e, data) {
                // data.submit()
            },
            submit: function (e, data) {

            },
            send: function (e, data) {
                Backbone.Events.trigger('uploading')
            },
            progress: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('div.progress div.progress-bar').css('width', progress + '%');

            },
            done: function (e, data) {
                $('div.progress').addClass('hidden');
                $('div.progress div.progress-bar').css('width', 0);

                if (data.result.result_code == 6 || data.result.result_code == -19) {
                    applicantModel.set('submitted', true);
                    Backbone.Events.trigger('success')
                    Router.navigate('success', {
                        trigger: true
                    })

                } else if (data.result.result_code == -2) {
                    Backbone.Events.trigger('showError', 'fileType');

                } else if (data.result.result_code == -9) {
                    $('div#alertBox').fadeOut(300);
                    Router.navigate('expired_url', {
                        trigger: true
                    })
                } else if (data.result.result_code == -3) {
                    // $('div#alertBox div#alertMsg').html('<strong>FILE UPLOAD FAILED</strong><br><hr>File size is exceeding the limit.')
                    // $('div#alertBox').fadeIn(300)
                    // setTimeout(function() {
                    //     $('div#alertBox').fadeOut(300);
                    // }, 3500)
                    Backbone.Events.trigger('showError', 'fileSize')
                } else {
                    // $('div#alertBox div#alertMsg').html('<strong>FILE UPLOAD FAILED</strong><br><hr>Please try again.')
                    // $('div#alertBox').fadeIn(300)
                    // setTimeout(function() {
                    //     $('div#alertBox').fadeOut(300);
                    // }, 3500)
                    Backbone.Events.trigger('showError', 'fileUpload')
                }
            },
            fail: function (e, data) {
                // $('div#alertBox div#alertMsg').html('<strong>UNEXPECTED SERVER ERROR</strong><br><hr>Please try again.')
                // $('div#alertBox').fadeIn(300)
                // setTimeout(function() {
                //     $('div#alertBox').fadeOut(300);
                // }, 3500)
                Backbone.Events.trigger('showError', 'server')
            }
        });
    };

    return {
        init
    }
})