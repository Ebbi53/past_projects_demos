define(['jquery', 'underscore', 'backbone', 'text!template/preview.html', 'model/session', 'router', 'form_dataPreparation', 'file_upload'], function ($, _, Backbone, template, Session, Router, dataPreparation, uploadedFile) {
    return Backbone.View.extend({
        tagname: 'div',
        className: 'container',
        id: 'preview',
        template: template,

        initialize: function () {
            this.render()
        },

        events: {
            'click #submit_button': async function () {
                $('#confirmation').modal('hide');
                if (await dataPreparation()) {
                    // Session.set('complete', true);
                    Router.navigate('success', {
                        trigger: true
                    });
                } else {
                    Backbone.Events.trigger('showError', 'server')
                }
            },
            'click #print_button': function () {
                window.print()
            },
            'click #back_button': function () {
                Router.navigate('', {
                    trigger: false
                });
                $(window).scrollTop(0);;
                this.remove();
                $('#form_wrapper').show();
            }

        },

        render: function () {
            this.$el.html(_.template(this.template));

            $(document).ready(function () {
                $('footer').show();
                $(window).scrollTop(0);

                if ($('#body').height() + 100 > window.innerHeight) {
                    $('body').css('position', 'relative')
                    $('footer').css('bottom', -$('footer').height() + 'px')
                } else {
                    $('body').css('position', 'static')
                    $('footer').css('bottom', 0)
                }

                $('#applicant_name').text($('#first_name').val() + " " + $('#family_name').val())

                $('.second_column').each(function () {
                    var content_id = $(this).attr('id').split('_preview')[0],
                        content = '',
                        $input = $(`[name=${content_id}]`);

                    if (content_id == 'contact_number') {
                        content += $('#phone_mobile_country').val() + ' ' + $('#phone_mobile_telephone').val();

                    } else if ($input.is('input[type=radio]')) {
                        content += $('input[name=' + content_id + ']:checked').val();
                        if ($('input[name=' + content_id + ']:checked').val() == 'Yes' && $input.parents('div.parentWithSpecific').length) {
                            var $elSelector = $input.parents('div.parentWithSpecific').find(`${$input.hasClass('withRadio') ? `input[name=${$input.siblings('label').attr('for')}]:checked` : 'input.specific'}`)
                            content += ` (${$elSelector.val()})`
                        }

                    } else if ($input.is('input[type=checkbox]')) {
                        $input.each(function () {
                            $(this).prop('checked') ? content += `${$(this).val()}` : null;
                            if ($(this).prop('checked') && $(this).parents('div.parentWithSpecific').length) {
                                var $elSelector = $(this).parents('div.parentWithSpecific').find(`${$(this).hasClass('withRadio') ? `input[name=${$(this).siblings('label').attr('for')}]:checked` : 'input.specific'}`)
                                content += ` (${$elSelector.val()})`
                            }
                            $(this).prop('checked') ? content += '\n' : null;
                        })
                    } else {
                        content += $input.val();
                        if ($input.val() == 'Other' && $input.parents('div.parentWithSpecific').length) {
                            var $elSelector = $input.parents('div.parentWithSpecific').find('input.specific')
                            content += ` (${$elSelector.val()})`
                        }
                    }

                    $(this).text(content)

                })
                for (var key in uploadedFile.uploadData) {
                    $('#' + key + '_preview').text((uploadedFile.uploadData)[key])
                }

            })
        }
    })
})
