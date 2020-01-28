define(['jquery', 'underscore', 'backbone', 'file_upload'], function ($, _, Backbone, fileUpload) {
    return async function () {

        var hasDeclared = true;
        var highlightField = function (highlight, tag) {
            if (highlight) {
                if ($(`label[for=${$(tag).attr('id')}]`).length == 0) {
                    $(tag).parents('.form-group').find('label').addClass('incomplete-label');
                } else {
                    $(`label[for=${$(tag).attr('id')}]`).addClass('incomplete-label');
                }
                ($(tag).is('select') && $(tag).attr('class').includes('select2')) ? $(`#select2-${$(tag).attr('id')}-container`).parent().addClass('incomplete-input') : $(tag).addClass('incomplete-input');
            } else {
                ($(tag).is('select') && $(tag).attr('class').includes('select2')) ? $(`#select2-${$(tag).attr('id')}-container`).parent().removeClass('incomplete-input') : $(tag).removeClass('incomplete-input');

                if ($(`label[for=${$(tag).attr('id')}]`).length == 0 && !($(tag).parents('.form-group').find('input').hasClass('incomplete-input'))) {
                    $(tag).parents('.form-group').find('label').removeClass('incomplete-label');
                } else {
                    $(`label[for=${$(tag).attr('id')}]`).removeClass('incomplete-label');
                }
            }
        };

        await new Promise((resolve, reject) => {
            if ($('input[name=accept_declaration]:checked').val() != 'yes') {
                $('#declaration').find('label').addClass('incomplete-label')
                hasDeclared = false;
                resolve();
            } else {
                $('#declaration').find('label').removeClass('incomplete-label')
                $('.compulsory').each(function (index) {
                    if ($(this).is('label')) {
                        if ($(`input[name=${$(this).attr('for')}]:checked`).length == 0) {
                            $(this).parents('.form-group').find('label').addClass('incomplete-label');
                        } else {
                            $(this).parents('.form-group').find('label').removeClass('incomplete-label');
                        }
                    } else {
                        if ($(this).attr('type') == 'file') {
                            if (fileUpload.uploadData[$(this).attr('name')] == '') {
                                highlightField(true, this);
                            } else {
                                highlightField(false, this)
                            }
                        } else {
                            if ($(this).val() == '' || $(this).val() == '--') {
                                highlightField(true, this);
                            } else {
                                !($(this).hasClass('invalid')) ? highlightField(false, this) : '';
                            }
                        }
                    }
                    if (index == $('.compulsory').length - 1) {
                        resolve();
                    }
                })
            }
        })

        // var response = grecaptcha.getResponse()
        // if (response.length === 0) {
        //     validField.push(false);
        // }

        await new Promise((resolve, reject) => {
            $('.sections').each(function (index) {
                if ($(this).find('[class*=incomplete]').length != 0) {
                    $section_incomplete = $(this)
                    $('.nav-link').each(function () {
                        if ($(this).attr('href') == '#' + $section_incomplete.attr('id')) {
                            $(this).css('color', '#CC0000')
                            $(this).addClass('incomplete_link')

                        }
                    })
                } else {
                    $section_complete = $(this)
                    $('.nav-link').each(function () {
                        if ($(this).attr('href') == '#' + $section_complete.attr('id')) {
                            $(this).css('color', '')
                            $(this).removeClass('incomplete_link')
                        }
                    })
                }
                if (index == $('.sections').length - 1) {
                    resolve();
                }
            })
        })

        return ({
            success: $('[class*=incomplete]').length == 0,
            hasDeclared
        });
    }
});