define(['jquery', 'underscore', 'backbone', 'text!template/preview.html', 'formData_preparation', 'model/session', 'router', 'file_upload'], function ($, _, Backbone, template, dataPreparation, Session, Router, uploadedFile) {
    return Backbone.View.extend({
        tagname: 'div',
        className: 'fadeIn container',
        id: 'preview',
        template: template,

        initialize: function () {
            return this.render()
        },

        events: {
            'click #submit_button': async function (e) {
                $(e.currentTarget).html('<i class="fa fa-spinner fa-spin"></i> Submitting')
                $(e.currentTarget).prop('disabled', true)
                $(e.currentTarget).css({
                    'color': 'black',
                    'background-color': 'orange',
                    'border-color': 'orange',
                })

                var status = await dataPreparation();

                if (status != 'Session updated') {
                    if (status) {
                        // Session.set('complete', true);s
                        Router.navigate('success', {
                            trigger: true
                        });
                    } else {
                        Backbone.Events.trigger('showError', 'server')
                    }
                }
                $('#confirmation').modal('hide');

                $(e.currentTarget).html('Submit')
                $(e.currentTarget).prop('disabled', false)
                $(e.currentTarget).css({
                    'color': 'white',
                    'background-color': '#428BCA',
                    'border-color': '#428BCA',
                })
            },
            'click #print_button': function () {
                window.print()
            },
            'click #back_button': function () {
                Router.navigate('', {
                    trigger: true
                });
            }
        },

        render: function () {
            var that = this;
            this.$el.html(_.template(this.template));

            $(document).ready(function () {
                $('footer').show();
                $(window).scrollTop(0)
                if ($('#body').height() + 100 > window.innerHeight) {
                    $('body').css('position', 'relative')
                    $('footer').css('bottom', -$('footer').height() + 'px')
                } else {
                    $('body').css('position', 'static')
                    $('footer').css('bottom', 0)
                }

                if (!(/*@cc_on!@*/ false || !!document.documentMode)) {
                    window.onafterprint = function () {
                        $('#preview').remove();
                        require(['view/preview'], function (previewView) {
                            $('#body').append(new previewView().el);
                        })
                    }
                }
                $('#uploadedPhoto').attr('src', uploadedFile.getFileURL())

                $('#applicant_name').text($('#first_name').val() + " " + $('#family_name').val())


                $('.second_column').each(function () {
                    var content_id = $(this).attr('id').slice(0, -8)
                    var content = $('#' + content_id).val()
                    $(this).text(content)

                })

                $('#home_number_preview').text($('#home_area_code').val() + ' ' + $('#home_number').val())
                $('#mobile_number_preview').text($('#mobile_area_code').val() + ' ' + $('#mobile_number').val())
                $('#referee_telephone_preview').text($('#referee_area_code').val() + ' ' + $('#referee_telephone').val())


                $('input:radio[name="gender"]:checked').each(function () {
                    $('#gender_preview').append($(this).val())
                })

                $('input:radio[name="university_invitation"]').each(function () {
                    if ($(this).is(':checked'))
                        if ($(this).val() == 'yes')
                            $('#interview_invitation_preview').append($(this).val() + ', on ' + $('#date_of_invitation').val())
                        else
                            $('#interview_invitation_preview').append($(this).val())
                })

                $('input:checkbox[name="source"]').each(function () {
                    if ($(this).is(':checked'))
                        if ($(this).val() == 'Others')
                            $('#source_preview').append($(this).val() + '( ' + $('input:text[name="specific_of_other_source"]').val() + ' ) ')
                        else
                            $('#source_preview').append($(this).val() + ', ')
                })

                $('input:radio[name="other_scholarship_application"]').each(function () {
                    if ($(this).is(':checked')) {
                        $('#other_scholarship_plan_preview').append($(this).val())
                        if ($(this).val() == 'yes') {
                            $('#other_scholarship_preview').show()
                            $('.scholarship').each(function () {
                                $('#scholarship_preview').append(($(this).index() + 1) + '. ' + $(this).find('.scholarship_name').val() + ' - ' + $(this).find('.scholarship_type').val() + '<br>')
                            })

                        }
                    }
                })

                $('input:radio[name="sent_email_to_school_principal"]').each(function () {
                    if ($(this).is(':checked'))
                        $('#request_reference_preview').append($(this).val())
                })

                $('#type_preview').text($('#type').val())
                str = ''
                $('.grades').each(function () {
                    $grade = '<b>' + $(this).prev().text() + ':</b> ' + $(this).val() + ' '
                    $('#grades_preview').append($grade)
                })


                $('.leadership_experience').each(function () {
                    $element = '<div class = "col-md-12"><span class="badge badge-primary" style="font-size:7px;">' + $(this).find('#record_num').text() + '</span><br><table class = "table table-striped table-sm"><tbody>'
                    $element = $element + '<tr><td class = "first_column">Association / Club / Project</td><td class = "second_column">' + $(this).find('.club_name').val() + '</td></tr>'
                    $element = $element + '<tr><td class = "first_column">Duration</td><td class = "second_column">' + $(this).find('.club_from').val() + " to " + $(this).find('.club_to').val() + '</td></tr>'
                    $element = $element + '<tr><td class = "first_column">Leadership Role</td><td class = "second_coolumn">' + $(this).find('.club_role').val() + '</td></tr></tbody></table></div>'

                    $('#activities_preview').append($element)
                })

                for (let key in uploadedFile.uploadData) {
                    $('#' + key + '_preview').text((uploadedFile.uploadData)[key])
                }
            })
            return this;
        }
    })
})