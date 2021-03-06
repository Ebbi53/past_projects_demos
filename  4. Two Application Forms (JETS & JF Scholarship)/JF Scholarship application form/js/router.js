define(['jquery', 'underscore', 'backbone', 'model/session'], function ($, _, Backbone, Session) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            '': function () {
                if ($('#body').find('#preview').length == 0) {
                    Session.fetch()
                        .done(function () {
                            require(['view/form'], function (formView) {
                                $('#body').html(new formView().el);
                            });
                        })
                        .fail(function () {
                            Backbone.Events.trigger('showError', 'server')
                        })
                } else {
                    $('#form_wrapper').show();
                    $('#preview').remove();
                }

            },
            'preview': function () {
                if ($('#body').find('#form_wrapper').length) {
                    require(['view/preview'], function (previewView) {
                        $('#form_wrapper').hide()
                        $('#body').append(new previewView().el);
                    })
                } else {
                    this.navigate('', {
                        trigger: true
                    })
                }
            },
            'success': function () {
                if (Session.get('applicationtoken')) {
                    require(['view/success'], function (successView) {
                        $('#body').html(new successView().el);
                    })
                } else {
                    // Session.set('complete', false)
                    this.navigate('', {
                        trigger: true
                    })
                }
            },
        },
    });

    var errors = {
        validation: '<strong>FORM VALIDATION FAILED</strong><br><hr>Few compulsory fields are empty or there are some invalid inputs. Please review your form',
        fileSize: '<strong>FILE UPLOAD FAILED</strong><br><hr>File size is exceeding the limit.',
        fileUpload: '<strong>FILE UPLOAD FAILED</strong><br><hr>Please try again.',
        server: '<strong>UNEXPECTED SERVER ERROR</strong><br><hr>Please try again.',
        sessionTimeOut: '<strong>SESSION TIMEOUT</strong><br><hr>Please <b>upload the files again</b> and then proceed.',
        cancelUpload: 'File upload canceled.',
        fileType: '<strong>FILE UPLOAD FAILED</strong><br><hr>Invalid file type. Please select the correct file type.',
        emailReUse: '<strong>INVALID EMAIL</strong><br><hr>This email has already been used. Please use another email address.',
        declaration: '<strong>FORM VALIDATION FAILED</strong><br><hr>Sorry, we need your consents in order to proceed with this application.',
    };

    var showError = function (error) {
        $('div.alert div#errorMsg').html(errors[error]);
        $('div.alert').fadeIn(300);
        if (error == 'server' || error == 'sessionTimeOut' || error == 'emailReUse') {
            $('div[class*=container] div.row').css('opacity', 0.5);
        } else {
            setTimeout(function () {
                $('div.alert').fadeOut(300);
            }, 3500)
        }
    };

    Backbone.Events.on('showError', showError);

    $('div.alert span.closebtn').click(function (e) {
        $(e.currentTarget).parents('div.alert').fadeOut(300);
        $('div[class*=container] div.row').css('opacity', 1);
        if ($('div.alert div#errorMsg').html().includes('TIMEOUT')) {
            if ($('#body').find('#preview').length) {
                require(['router'], function (Router) {
                    Router.navigate('', {
                        trigger: true
                    })
                })
            } else {
                $(window).scrollTop($('#uploaded_files').offset().top - (window.innerWidth <= 991 ? $('nav.navbar').outerHeight() : 0));
            }
            $('.undoBtn').not(':disabled').trigger('click');
        }
    })

    window.addEventListener('beforeunload', (event) => {
        if (location.hash != '' && location.hash != '#success') {
            // Cancel the event as stated by the standard.
            event.preventDefault();
            // Chrome requires returnValue to be set.
            event.returnValue = '';
        }
    });

    return new AppRouter();
})