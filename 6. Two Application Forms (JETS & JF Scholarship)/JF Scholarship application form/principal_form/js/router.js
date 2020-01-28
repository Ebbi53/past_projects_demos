define(['jquery', 'underscore', 'backbone', 'model/applicant', 'api_config'], function ($, _, Backbone, applicantModel, api_config) {
    var AppRouter = Backbone.Router.extend({
        execute: function (callback, args, name) {
            callback ? callback.apply(this, args) : '';
            $(window).scrollTop() ? $(window).scrollTop(0) : '';
        },
        routes: {
            '': function () {
                var that = this;
                applicantModel.set('uuid', window.location.search.substring(7));

                applicantModel.sync('read', applicantModel, {
                    url: api_config.protocol + api_config.domain + api_config.path + 'principal/' + applicantModel.get('uuid') + '',
                    success: function (model, response, options) {
                        applicantModel.set(model)
                        applicantModel.set('submitted', false);
                        if (options.responseJSON.result_code == 5) {
                            that.navigate('form', {
                                trigger: true
                            })
                        } else if (options.responseJSON.result_code == -18) {
                            that.navigate('invalid_url', {
                                trigger: true
                            })
                        } else if (options.responseJSON.result_code == -19) {
                            that.navigate('success', {
                                trigger: true
                            })
                        } else if (options.responseJSON.result_code == -9) {
                            that.navigate('expired_url', {
                                trigger: true
                            })
                        }
                    },
                    error: function (model, response, options) {
                        Backbone.Events.trigger('showError', 'server')
                    }
                })
            },
            'form': function () {
                if (applicantModel.get('applicant_name')) {
                    if (!applicantModel.get('submitted')) {
                        require(['view/form'], function (formView) {
                            $('#body').html(new formView().el);
                        });
                    }
                } else {
                    this.navigate('', {
                        trigger: true
                    })
                }
            },
            'success': function () {
                require(['view/success'], function (successView) {
                    $('#body').html(new successView().el);
                })
            },
            'invalid_url': function () {
                require(['view/invalid_url'], function (invalid_urlView) {
                    $('#body').html(new invalid_urlView().el);
                })
            },
            'expired_url': function () {
                require(['view/expired_url'], function (expired_urlView) {
                    $('#body').html(new expired_urlView().el);
                })
            }
        },
    });

    var errors = {
        validation: '<strong>VALIDATION FAILED</strong><br><hr>Please upload the compulsory files.',
        fileSize: '<strong>FILE UPLOAD FAILED</strong><br><hr>File size is exceeding the limit.',
        fileUpload: '<strong>FILE UPLOAD FAILED</strong><br><hr>Please try again.',
        server: '<strong>UNEXPECTED SERVER ERROR</strong><br><hr>Please try again.',
        fileType: '<strong>FILE UPLOAD FAILED</strong><br><hr>Invalid file type. Please select the correct file type.',
    };

    var showError = function (error) {
        $('div#alertBox div#alertMsg').html(errors[error]);
        $('div#alertBox').removeClass().addClass('alert alert-danger').fadeIn(300);
        if (error == 'server') {
            $('div[class*=container]').css('opacity', 0.5);
        } else {
            setTimeout(function () {
                $('div#alertBox').fadeOut(300);
            }, 3000)
        }
    };

    Backbone.Events.on('showError', showError);

    Backbone.Events.on('success', function () {
        $('div#alertBox div#alertMsg').html('Files submitted successfully!');
        $('div#alertBox').removeClass().addClass('alert alert-success').fadeIn(300);
        setTimeout(function () {
            $('div#alertBox').fadeOut(300);
        }, 3000)
    });

    Backbone.Events.on('uploading', function () {
        $('div#alertBox div#alertMsg').html('<div class="loading-dots">File(s) uploading <div class="loading-dots--dot"></div><div class="loading-dots--dot"></div><div class="loading-dots--dot"></div></div>');
        $('div#alertBox').removeClass().addClass('alert alert-info').fadeIn(300);
        $('div.progress').removeClass('hidden')
    })

    $('div#alertBox span.closebtn').click(function (e) {
        $(e.currentTarget).parents('div#alertBox').fadeOut(300);
        $('div[class*=container]').css('opacity', 1);
    });

    window.addEventListener('beforeunload', (event) => {
        if (location.hash == '#form') {
            // Cancel the event as stated by the standard.
            event.preventDefault();
            // Chrome requires returnValue to be set.
            event.returnValue = '';
        }
    });

    return new AppRouter();
})