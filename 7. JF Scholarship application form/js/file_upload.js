define(['jquery', 'underscore', 'backbone', 'jquery.iframe-transport', 'fileUpload', 'model/session', 'api_config'], function ($, _, Backbone, fileUploadIframe, fileUpload, Session, api_config) {
    var uploadData = {};
    var jqXHR = {};
    var photoURL = '';

    var getFileURL = function () {
        return photoURL;
    }

    var init = function () {
        $('input[type=file]').each(function (index) {
            uploadData[$(this).attr('name')] = '';

            $(this).fileupload({
                url: api_config.protocol + api_config.domain + api_config.path + "document",
                maxFileSize: 4000000, //4MB //Not supported by all browsers
                dataType: 'json',
                add: function (e, data) {

                    // if (!(await Session.checkExpiry())) {
                    //     data.submit()
                    // }


                    data.formData = {
                        "data": JSON.stringify({
                            "token": Session.get('applicationtoken')
                        }),
                        "file-meta-data": {}
                    };

                    if ($(this).attr('name') == 'others_doc') {
                        if (data.files[0].size > 8000000) {
                            Backbone.Events.trigger('showError', 'fileSize')
                            return false;
                        }
                    } else {
                        if (data.files[0].size > 4000000) {
                            Backbone.Events.trigger('showError', 'fileSize')
                            return false;
                        }
                    }

                    if ($(this).attr('name') == 'photo') {
                        if (!data.files[0].name.toLowerCase().includes('.jpg') && !data.files[0].name.toLowerCase().includes('.jpeg')) {
                            Backbone.Events.trigger('showError', 'fileType');
                            return false;
                        }
                    } else {
                        if (!data.files[0].name.toLowerCase().includes($(this).attr('accept'))) {
                            Backbone.Events.trigger('showError', 'fileType');
                            return false;
                        }
                    }

                    jqXHR[$(this).attr('name')] = data.submit();
                },
                submit: function (e, data) {

                },
                send: function (e, data) {
                    $(this).parents('button').children('div').toggle();
                    $(this).parents('.form-group').children('div.uploadProgress').removeClass('hidden')
                },
                progress: function (e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    $(this).parents('.form-group').find('div.progress div.progress-bar').css('width', progress + '%');

                    if (progress == 100) {

                        // Backbone.Events.trigger('success')
                    }
                },
                done: function (e, data) {
                    $(this).parents('.form-group').children('div.uploadProgress').addClass('hidden');
                    $(this).parents('.form-group').find('div.progress div.progress-bar').css('width', 0);

                    $(this).parents('button').children('div').toggle();
                    // if (data.result.result_code > 0) {
                    $(this).parents('.form-group').children('div.uploadBtn').toggle();
                    $(this).parents('.form-group').find('span.fileStatus i').text(data.files[0].name + ' successfully uploaded!');
                    $(this).parents('.form-group').find('.undoBtn').removeAttr('disabled')

                    uploadData[$(this).attr('name')] = data.files[0].name;
                    if (data.paramName[0] == 'photo') {
                        var reader = new FileReader();

                        reader.onload = function () {
                            photoURL = reader.result;
                        };

                        reader.readAsDataURL(data.files[0]);
                    }

                    // } else if (data.result.result_code == -2) {
                    //     Backbone.Events.trigger('showError', 'fileType');

                    // } else if (data.result.result_code == -3) {
                    //     Backbone.Events.trigger('showError', 'fileSize')
                    // } else if (data.result.result_code == -9 || data.result.result_code == -10) {
                    //     Session.update();
                    //     Backbone.Events.trigger('showError', 'fileUpload')
                    // }
                },
                fail: function (e, data) {
                    $(this).parents('.form-group').children('div.uploadProgress').addClass('hidden');
                    $(this).parents('.form-group').find('div.progress div.progress-bar').css('width', 0);
                    $(this).parents('button').children('div').toggle();
                    jqXHR[$(this).attr('name')].statusText != 'abort' ? Backbone.Events.trigger('showError', 'server') : '';
                }
            });

        });
    };

    return {
        init,
        uploadData,
        jqXHR,
        getFileURL
    }
})