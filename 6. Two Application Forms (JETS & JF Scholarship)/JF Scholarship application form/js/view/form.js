define(['jquery', 'underscore', 'backbone', 'text!template/form.html', 'file_upload', 'select2', 'datepicker', 'data', 'form_validation', 'router', 'model/session', 'api_config'], function ($, _, Backbone, template, fileUpload, select2, datepicker, data, validation, Router, Session, api_config) {
    return Backbone.View.extend({
        tagname: 'div',
        className: 'fadeIn container-fluid form_page',
        template: template,
        listItem: '',
        scholarshipCounter: 1,
        counter: 1,

        initialize: function () {
            this.render();
        },

        events: {
            'change .from': function (e) {
                $from = $(e.currentTarget)
                $to = $from.parent().parent().next().find('.to')

                $to.datepicker('setStartDate', $from.datepicker('getDate'))
                $to.datepicker('clearDates')
                $to.datepicker('show')
            },
            'change #home_area_code': function (e) {
                $('#select2-home_area_code-container').text($(e.currentTarget).val())
            },
            'change #mobile_area_code': function (e) {
                $('#select2-mobile_area_code-container').text($(e.currentTarget).val())
            },
            'change #referee_area_code': function (e) {
                $('#select2-referee_area_code-container').text($(e.currentTarget).val())
            },
            'click .section_heading': function (e) {
                $(e.currentTarget.nextElementSibling).slideToggle(300);
                $(e.currentTarget.children[0].children).toggleClass('hidden');
            },
            'click #dual': function (e) {
                if ($(e.currentTarget).is(':checked')) {
                    $('#nationality2').css('display', 'block')
                    $('#second_nationality').addClass('compulsory')
                } else {
                    $('#nationality2').css('display', 'none')
                    $('#second_nationality').removeClass('compulsory')
                }
            },
            'change #preferred_university': function (e) {
                $("select[id$=preferred_college] > option").remove();
                var selectedUni = $(e.currentTarget).children("option:selected").val();
                if (selectedUni == 'Cambridge')
                    this.populateDropdown("#preferred_college", data.cambridge_college)

                else if (selectedUni == 'Oxford')
                    this.populateDropdown("#preferred_college", data.oxford_college)
            },
            'change #type': 'updateQualificationSection',

            'click #add_button': 'addNewRecord',
            'click .topnav': function (e) {
                $("#myLinks").toggle(200);
            },
            'input #statement_content': function (e) {
                if ($(e.currentTarget).val() == '') {
                    $('#count').hide(200)
                } else {
                    var num_words = $(e.currentTarget).val().match(/.[^\s]+/gm) ? $(e.currentTarget).val().match(/.[^\s]+/gm).length : 0;
                    $('#count').show(200)
                    $('#count').html(num_words + " / 700")
                    if (num_words > 700) {
                        $('#count').css('background-color', '#CC0000')
                        $(e.currentTarget).addClass('incomplete-input invalid')
                    } else if (num_words == 700) {
                        $('#count').css('background-color', 'orange')
                        $(e.currentTarget).removeClass('incomplete-input invalid')
                    } else {
                        $('#count').css('background-color', 'green')
                        $(e.currentTarget).removeClass('incomplete-input invalid')
                    }
                }

            },
            'input .num': function (e) {
                if (!this.checkValid($(e.currentTarget).val(), ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '', '-', ' ', '(', ')'])) {
                    $(e.currentTarget).addClass('incomplete-input invalid');
                    $(e.currentTarget).next('.invalid_number').show();
                } else {
                    $(e.currentTarget).removeClass('incomplete-input invalid')
                    $(e.currentTarget).next('.invalid_number').hide()
                    //
                }
            },
            'change .email_address': function (e) {
                valid_email = false

                if ($(e.currentTarget).val().length != 0 && (!$(e.currentTarget).val().includes('@') || !$(e.currentTarget).val().includes('.')))
                    $(e.currentTarget).next('.invalid_email').show()
                else
                    $(e.currentTarget).next('.invalid_email').hide()

                if ($(e.currentTarget).parent().next().find('.conf_email_address').val() != '') {
                    if ($(e.currentTarget).val() != $(e.currentTarget).parent().next().find('.conf_email_address').val()) {
                        $(e.currentTarget).parent().next().find('.conf_email_address').nextAll('.invalid_conf_email').show()
                    } else {
                        $(e.currentTarget).parent().next().find('.conf_email_address').nextAll('.invalid_conf_email').hide()
                    }
                }


                if ($(e.currentTarget).hasClass('conf_email_address')) {
                    if ($(e.currentTarget).val() != $(e.currentTarget).parent().prev().find('.email_address').val())
                        $(e.currentTarget).nextAll('.invalid_conf_email').show()
                    else
                        $(e.currentTarget).nextAll('.invalid_conf_email').hide()

                }

                $('.invalid_email').each(function () {
                    if ($(this).css('display') == 'block' || $(this).next('.invalid_conf_email').css('display') == 'block')
                        $(this).prevAll('.email_address').addClass('incomplete-input invalid')
                    else
                        $(this).prevAll('.email_address').removeClass('incomplete-input invalid')
                })

                if (!$(e.currentTarget).hasClass('incomplete-input') && $(e.currentTarget).val().length != 0)
                    valid_email = true


                if (valid_email && !($(e.currentTarget).hasClass('secondary_email'))) {
                    $.ajax({
                        type: 'PUT',
                        data: JSON.stringify({
                            "token": Session.get('applicationtoken'),
                            "email": $(e.currentTarget).val()
                        }),
                        contentType: 'application/json',
                        url: api_config.protocol + api_config.domain + api_config.path + 'application',
                    })
                        .done(function (data) {
                            if (data.result_code == -6) {
                                Backbone.Events.trigger('showError', 'emailReUse');
                            } else if (data.result_code == -9 || data.result_code == -10) {
                                Session.update();
                            }
                        })
                }
            },
            'click input.specifyInput': function (e) {
                if ($(e.currentTarget).prop('checked')) {
                    $(e.currentTarget).parents('.form-group').children('.specifyInputBoxDiv').show({
                        duration: 100,
                        easing: 'linear'
                    });
                    $(e.currentTarget).parents('.form-group').children('.specifyInputBoxDiv').find('input, select').addClass('compulsory')
                } else {
                    this.removeInput(e);
                }
            },
            'click input.removeInput': 'removeInput',
            'click button.addItem': 'addNewScholarshipItem',
            'click button.deleteItem': function (e) {
                this.scholarshipCounter--;
                $(e.currentTarget).parents('li').remove();
                if ($('div.specifyInputBoxDiv ol li button.btn-danger').length == 1) {
                    $('div.specifyInputBoxDiv ol li button.btn-danger').prop('disabled', true);
                }
            },
            'click button.undoBtn': function (e) {
                fileUpload.uploadData[$(e.currentTarget).parents('.form-group').find('input').attr('name')] = '';
                $(e.currentTarget).parents('.form-group').children('div.uploadBtn').toggle();
                $(e.currentTarget).prop('disabled', true)
            },
            'click #validate_button': async function () {
                var validationResults = await validation();
                if (validationResults.success) {
                    Router.navigate('preview', {
                        trigger: true,
                    })
                } else {
                    Backbone.Events.trigger('showError', validationResults.hasDeclared ? 'validation' : 'declaration')
                    validationResults.hasDeclared ? $(window).scrollTop($($('.sections').has('[class*=incomplete]')[0]).offset().top - (window.innerWidth <= 991 ? $('nav.navbar').outerHeight() : 0)) : null;
                }
            },
            'click a.nav-link': function (e) {
                e.preventDefault();
                $(window).scrollTop($($(e.currentTarget).attr('href')).offset().top);
            },
            'click div.calicon, div.calLabel': function (e) {
                $(e.currentTarget).siblings('input.datepicker').datepicker('show');
            },
            'click div.uploadProgress div.cancelUpload': function (e) {
                if (fileUpload.jqXHR[$(e.currentTarget).parents('.form-group').find('input').prop('name')] !== undefined) {
                    fileUpload.jqXHR[$(e.currentTarget).parents('.form-group').find('input').prop('name')].abort();
                    Backbone.Events.trigger('showError', 'cancelUpload');
                }
            }

        },

        addNewScholarshipItem: async function clickButtonAddItem(e) {
            var that = this,
                $listItem = $(this.listItem);
            limit = $listItem.find('label, input, select').length - 1;

            this.scholarshipCounter++;
            await new Promise((resolve, reject) => {
                $listItem.find('label, input, select').each(function (index, element) {
                    if ($(this).attr('for') == undefined) {
                        $(this).attr('name', $(this).attr('name').slice(0, -1) + that.scholarshipCounter);
                        $(this).attr('id', $(this).attr('id').slice(0, -1) + that.scholarshipCounter);
                        $(this).addClass('compulsory');
                    } else {
                        $(this).attr('for', $(this).attr('for').slice(0, -1) + that.scholarshipCounter)
                    }
                    if (index == limit) {
                        resolve();
                    }
                })
            })
            $($('div.specifyInputBoxDiv ol').append($listItem)[0].lastElementChild).find('select').select2({
                minimumResultsForSearch: 10,
                placeholder: ''
            });

            $('div.specifyInputBoxDiv ol li button.btn-danger').removeAttr('disabled');
        },

        addNewRecord: function () {
            this.counter += 1;
            var $new = $('#leadership_experience_1').clone();
            var that = this;
            $new.attr('id', `leadership_experience_${this.counter}`)
            $new.find('#record_num').text(`Record ${this.counter}:`)
            $new.find(`#club_name_1`).attr('id', `club_name_${this.counter}`).val('')
            $new.find(`#club_role_1`).attr('id', `club_role_${this.counter}`).val('')
            $new.find(`#club_from_1`).attr('id', `club_from_${this.counter}`)
                .val('')
                .datepicker({
                    format: "yyyy-mm",
                    startView: 2,
                    viewMode: "years",
                    minViewMode: "months",
                    autoclose: true,
                    todayHighlight: true
                })


            $new.find(`#club_to_1`).attr('id', `club_to_${this.counter}`)
                .val('')
                .datepicker({
                    format: "yyyy-mm",
                    startView: 2,
                    viewMode: "years",
                    minViewMode: "months",
                    autoclose: true,
                    todayHighlight: true
                })

            $new.find(`#delete_1`).attr('id', `delete_${this.counter}`).click(function (e) {
                $(event.target).parents('.leadership_experience').remove();
                that.counter--

                $('.leadership_experience').each(function (i, obj) {
                    $(obj).find('#record_num').text(`Record ${i + 1}:`)
                    $(obj).attr('id', `leadership_experience_${i + 1}`)
                    $(obj).find('.club_name').attr('id', `club_name_${i + 1}`)
                    $(obj).find(`.club_role`).attr('id', `club_role_${i + 1}`)
                    $(obj).find(`.club_to`).attr('id', `club_to_${i + 1}`)
                    $(obj).find(`.club_from`).attr('id', `club_from_${i + 1}`)
                    $(obj).find(`.delete`).attr('id', `delete_${i + 1}`)
                });
            })

            $new.append('<hr>')
            $new.appendTo('#add')

        },

        updateQualificationSection: function (e) {
            var qual = $(e.currentTarget).children("option:selected").val(),
                loopData = {
                    'GCE A-Level': {
                        grades: ['A*', 'A', 'B', 'C'],
                        name: 'gce-grades'
                    },
                    'Hong Kong Diploma of Secondary Education': {
                        grades: ['5**', '5*', '5', '4'],
                        name: 'dse-grades'
                    },
                    'Malaysia - Higher School Certificate of Education(STPM)': {
                        grades: ['A', 'B', 'C'],
                        name: 'stpm-grades'
                    },
                    'Singapore - Cambridge GCE Advanced Level': {
                        grades: ['Distinction', 'Merit', 'Pass'],
                        name: 'gceal-grades'
                    }
                },
                temp = '';
            if (qual == 'International Baccalaureate') {
                $('#grades').html(`
                        <div class = 'col'>
                            <p>Please input the total mark (0-45)</p>
                            <input type = 'number' class = 'form-control-sm col-7 grades' name= 'ib-grades' value=0 min=0 max=45>
                        </div>
                    `)
            } else if (qual.includes('Others')) {
                $('#grades').html(`
                    <div class = 'col'>
                        <p>Please input the total grades/marks:</p>
                        <input type = 'text' class = 'form-control-sm col-7 grades' name= 'others-grades'>
                    </div>
                    `);
            } else {
                for (let i = qual == 'Singapore - Cambridge GCE Advanced Level' ? 0 : 2; i < 3; i++) {
                    temp += qual == 'Singapore - Cambridge GCE Advanced Level' ? `<div class = 'col-md-3'>
                        <p class = 'text-center'><b>H${i + 1}</b></p>
                    </div>` : '';
                    for (let j = 0; j < loopData[qual].grades.length; j++) {
                        if (i < 2) {
                            temp += `<div class = 'col-md-3'>
                            <p class = 'text-center'>${String.fromCharCode(65 + j)}</p>
                            <input type = 'number' class = 'form-control-sm grades' name=${loopData[qual].name} value=0 min=0 max=20>
                            </div>`
                        } else {
                            temp += `<div class = 'col-md-3'>
                            <p class = 'text-center'>${loopData[qual].grades[j]}</p>
                            <input type = 'number' class = 'form-control-sm grades' name=${loopData[qual].name} value=0 min=0 max=20>
                            </div>`
                        }
                    }
                    temp += qual == 'Singapore - Cambridge GCE Advanced Level' ? '</div>' : '';
                }
                $('#grades').html(temp);
            }
        },

        populateDropdown: function (selector_id, array) {
            array.forEach(e => {
                $(selector_id).append('<option value="' + e + '">' + e + '</option>');
            })
        },

        setDatePicker: function (selector_id, minViewMode) {
            if (minViewMode == 'days')
                $(selector_id).datepicker({
                    format: "dd-mm-yyyy",
                    startView: 2,
                    viewMode: "years",
                    minViewMode: "days",
                    autoclose: true,
                    todayHighlight: true
                })
            else if (minViewMode == 'months')
                $(selector_id).datepicker({
                    format: "mm-yyyy",
                    startView: 2,
                    viewMode: "years",
                    minViewMode: "months",
                    autoclose: true,
                    todayHighlight: true
                })

        },

        checkValid: function (string, list) {

            arr = string.split('')
            var include = true;

            if (arr.length > 0)
                for (var i = 0; i < arr.length; i++) {
                    if (!list.includes(arr[i])) {
                        include = false;
                        break;
                    }
                }
            return include
        },

        bracket_value: function (e) {
            var regExp = /\(([^)]+)\)/;
            var brack = regExp.exec(e)[0]
            return brack.match(/\(([^)]+)\)/)[1]
        },

        removeInput: function (e) {
            $(e.currentTarget).parents('.form-group').children('.specifyInputBoxDiv').hide({
                duration: 100,
                easing: 'linear'
            });
            $(e.currentTarget).parents('.form-group').children('.specifyInputBoxDiv').find('input, select, span').removeClass('compulsory incomplete-input');
            $(e.currentTarget).parents('.form-group').children('.specifyInputBoxDiv').find('input, select').each(function (i, $tag) {
                $($tag).val('');
            })
        },

        render: function () {
            var that = this;
            this.$el.html(_.template(this.template));


            $(document).ready(function () {
                $('footer').show();
                $(window).scrollTop(0)
                $('body').scrollspy({ target: '.navbar' })

                if ($('#body').height() + 100 > window.innerHeight) {
                    $('body').css('position', 'relative')
                    $('footer').css('bottom', -$('footer').height() + 'px')
                } else {
                    $('body').css('position', 'static')
                    $('footer').css('bottom', 0)
                }

                var isIE = /*@cc_on!@*/ false || !!document.documentMode;
                if (isIE) {
                    $('input[type=file]').click(function (e) {
                        e.stopPropagation();
                    })
                    $('button.fileinput-button').click(function (e) {
                        $(e.currentTarget).find('input').trigger('click')
                    })
                }

                that.listItem = $('div.specifyInputBoxDiv ol').html();

                $('select').select2({
                    minimumResultsForSearch: 10,
                    placeholder: '',
                    tags: true
                });

                $('#country_of_origin').select2({
                    placeholder: 'Select Country',
                    tags: true

                })
                $('#current_residential_address_country').select2({
                    placeholder: 'Select Country',
                    tags: true
                })

                $('#present_location').select2({
                    placeholder: 'Select Country',
                    tags: true
                })

                $('#nationality').select2({
                    placeholder: 'Select Nationality',
                    tags: true
                })

                $('#second_nationality').select2({
                    placeholder: 'Second Nationality',
                    tags: true
                })

                $('#type').select2({
                    placeholder: 'Select Qualification',
                    tags: true
                })

                $('#home_area_code').select2({
                    placeholder: 'Area Code',
                    tags: true
                })

                $('#mobile_area_code').select2({
                    placeholder: 'Area Code',
                    tags: true
                })

                $('#referee_area_code').select2({
                    placeholder: 'Area Code',
                    tags: true
                })

                that.populateDropdown("#country_of_origin", data.country_list)
                that.populateDropdown("#current_residential_address_country", data.country_list)
                that.populateDropdown("#present_location", data.country_list)
                that.populateDropdown("#nationality", data.nationalities)
                that.populateDropdown("#second_nationality", data.nationalities)
                that.populateDropdown("#type", data.qualification_list)


                that.setDatePicker("#date_of_birth", 'days')
                that.setDatePicker('.to', 'months')
                that.setDatePicker('.from', 'months')


                $('.invalid_number').html('&nbsp;&nbsp;<i><span style="color:#CC0000"><i class="fas fa-exclamation"></i> Invalid Character</span></i>')

                $('.invalid_email').html('&nbsp;&nbsp;<i><span style="color:#CC0000"><i class="fas fa-exclamation"></i> Invalid Email</span></i>')
                $('.invalid_conf_email').html('&nbsp;&nbsp;<i><span style="color:#CC0000"><i class="fas fa-exclamation"></i> Should be same as the above email</span></i>')


                data.country_codes.forEach(function (e) {
                    $('#home_area_code').append('<option value="' + that.bracket_value(e) + '">' + e + '</option>');
                    $('#mobile_area_code').append('<option value="' + that.bracket_value(e) + '">' + e + '</option>');
                    $('#referee_area_code').append('<option value="' + that.bracket_value(e) + '">' + e + '</option>');
                });

                $('.invalid_number').html('&nbsp;&nbsp;<i><span style="color:#CC0000"><i class="fas fa-exclamation"></i> Invalid Character</span></i>');

                $('.invalid_email').html('&nbsp;&nbsp;<i><span style="color:#CC0000"><i class="fas fa-exclamation"></i> Invalid Email</span></i>');
                $('.invalid_conf_email').html('&nbsp;&nbsp;<i><span style="color:#CC0000"><i class="fas fa-exclamation"></i> Should be same as the above email</span></i>');

                $(".section_heading").hover(function () {
                    $(this).css('color', '#115798')
                }, function () {
                    $(this).css('color', 'black')
                });

                fileUpload.init();
            })

        },

    })
})
