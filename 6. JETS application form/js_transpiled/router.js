define(['jquery', 'underscore', 'backbone', 'model/session', "core-js/modules/es7.array.includes", "core-js/modules/es6.string.includes", "core-js/modules/es6.array.find"], function ($, _, Backbone, Session, _es7Array, _es6String, _es6Array) {
  var AppRouter = Backbone.Router.extend({
    routes: {
      '': function () {
        require(['view/privacy_notice'], function (privacy_noticeView) {
          $('#body').html(new privacy_noticeView().el);
        })
      },
      'form': function () {
        if (Session.get('applicationtoken')) {
          if ($('#body').find('#preview').length == 0) {
            require(['view/form'], function (formView) {
              $('#body').html(new formView().el);
            });
          } else {
            $('#form_wrapper').show();
            $('#preview').remove();
          }
        } else {
          this.navigate('', {
            trigger: true
          })
        }
        // if ($('#body').find('#preview').length == 0) {
        //     Session.fetch({
        //         success: function () {
        //             require(['view/form'], function (formView) {
        //                 $('#body').html(new formView().el);
        //             });
        //         },
        //         error: function () {
        //             Backbone.Events.trigger('showError', 'server')
        //         }
        //     })
        // } else {
        //     $('#form_wrapper').show();
        //     $('#preview').remove();
        // }
      },
      'preview': function preview() {
        var that = this;
        if ($('#body').find('#form_wrapper').length) {
          require(['view/preview'], function (previewView) {
            $('#form_wrapper').hide()
            $('#body').append(new previewView().el);
          })
        } else {
          // $('#questionnaire_modal').modal('hide')
          // console.log('asdas')
          if ($('#questionnaire_modal').length) {
            $('#questionnaire_modal').modal('hide')
            $('#questionnaire_modal').on('hidden.bs.modal', function (e) {
              that.navigate('', {
                trigger: true
              })
            })
          } else {
            this.navigate('', {
              trigger: true
            })
          }
        }
      },
      'success': function success() {
        if (Session.get('applicationtoken')) {
          require(['view/success'], function (successView) {
            $('#body').html(new successView().el);
          });
        } else {
          // Session.set('complete', false)
          this.navigate('', {
            trigger: true
          });
        }
      }
    }
  });
  var errors = {
    validation: '<strong>FORM VALIDATION FAILED</strong><br><hr>Few compulsory fields are empty or there are some invalid inputs. Please review your form',
    fileSize: '<strong>FILE UPLOAD FAILED</strong><br><hr>File size is exceeding the limit.',
    fileupload: '<strong>FILE UPLOAD FAILED</strong><br><hr>Please try again.',
    server: '<strong>UNEXPECTED SERVER ERROR</strong><br><hr>Please try again.',
    sessionTimeOut: '<strong>SESSION TIMEOUT</strong><br><hr>Please <b>upload the files again</b> and then proceed.',
    cancelUpload: 'File upload canceled.',
    fileType: '<strong>FILE UPLOAD FAILED</strong><br><hr>Invalid file type. Please select the correct file type.',
    emailReUse: '<strong>INVALID EMAIL</strong><br><hr>This email has already been used. Please use another email address.',
    declaration: '<strong>FORM VALIDATION FAILED</strong><br><hr>Sorry, we need you to accept the "Declaration" in order to proceed with this application.',
  };

  var showError = function showError(error) {
    $('div.alert div#errorMsg').html(errors[error]);
    $('div.alert').fadeIn(300);

    if (error == 'server' || error == 'sessionTimeOut') {
      $('div[class*=container] div.row').css('opacity', 0.5);
    } else {
      setTimeout(function () {
        $('div.alert').fadeOut(300);
      }, 4000);
    }
  };

  Backbone.Events.on('showError', showError);
  Backbone.Events.on('surveySuccess', function () {
    $('div.alert div#errorMsg').html('Thank You for your additional Information!');
    $('div.alert').removeClass().addClass('alert alert-success').fadeIn(300);
    setTimeout(function () {
        $('div.alert').fadeOut(300);
    }, 3000)
});
  $('div.alert span.closebtn').click(function (e) {
    $(e.currentTarget).parents('div.alert').fadeOut(300);
    $('div[class*=container] div.row').css('opacity', 1); // $(window).scrollTop($('#uploaded_files').offset().top - $('div.alert').height() - 20);

    if ($('div.alert div#errorMsg').html().includes('TIMEOUT')) {
      if ($('#body').find('#preview').length) {
        require(['router'], function (Router) {
          Router.navigate('', {
            trigger: true
          })
        })
      } else {
        $(window).scrollTop($('#working_exp').offset().top - (window.innerWidth <= 991 ? $('nav.navbar').outerHeight() : 0));
      }

      $('.undoBtn').not(':disabled').trigger('click');
    } // $(window).scrollTop($($(e.currentTarget).attr('href')).offset().top);

  });
  window.addEventListener('beforeunload', function (event) {
    if (location.hash != '' && location.hash != '#success') {
      // Cancel the event as stated by the standard.
      event.preventDefault(); // Chrome requires returnValue to be set.

      event.returnValue = '';
    }
  });
  return new AppRouter(); // var init = function () {
  //     var app_router = new AppRouter();
  //     Backbone.history.start(); // Backbone.history.start();
  // }
  // return {
  //     init: init
  // };
});