define(['jquery', 'underscore', 'backbone', 'text!template/form.html', 'file_upload', 'select2', 'datepicker', 'data', 'form_validation', 'router', 'model/session', 'api_config', "core-js/modules/es6.regexp.split", "core-js/modules/es6.array.for-each", "core-js/modules/es6.function.name", "core-js/modules/es6.promise", "core-js/modules/es6.object.to-string", "regenerator-runtime/runtime", "core-js/modules/es7.array.includes", "core-js/modules/es6.string.includes", "core-js/modules/es6.regexp.match", "core-js/modules/es6.array.find", '_asyncToGenerator'], function ($, _, Backbone, template, fileUpload, select2, datepicker, data, validation, Router, Session, api_config, _es6Regexp, _es6Array, _es6Function, _es, _es6Object, _runtime, _es7Array, _es6String, _es6Regexp2, _es6Array2, _asyncToGenerator) {
    return Backbone.View.extend({
        tagname: 'div',
        className: 'fadeIn container-fluid form_page',
        template: template,
        listItem: '',
        scholarshipCounter: 1,
        counter: 1,
        initialize: function initialize() {
            this.render();
        },
        events: {
            'change .from': function changeFrom(e) {
                $from = $(e.currentTarget);
                $to = $from.parent().parent().next().find('.to');
                $to.datepicker('setStartDate', $from.datepicker('getDate'));
                $to.datepicker('clearDates');
                $to.datepicker('show');
            },
            'change #home_area_code': function changeHome_area_code(e) {
                $('#select2-home_area_code-container').text($(e.currentTarget).val());
            },
            'change #mobile_area_code': function changeMobile_area_code(e) {
                $('#select2-mobile_area_code-container').text($(e.currentTarget).val());
            },
            'change #referee_area_code': function changeReferee_area_code(e) {
                $('#select2-referee_area_code-container').text($(e.currentTarget).val());
            },
            'click .section_heading': function clickSection_heading(e) {
                $(e.currentTarget.nextElementSibling).slideToggle(300);
                $(e.currentTarget.children[0].children).toggleClass('hidden');
            },
            'click #dual': function clickDual(e) {
                if ($(e.currentTarget).is(':checked')) {
                    $('#nationality2').css('display', 'block');
                    $('#second_nationality').addClass('compulsory');
                } else {
                    $('#nationality2').css('display', 'none');
                    $('#second_nationality').removeClass('compulsory');
                }
            },
            'change #preferred_university': function changePreferred_university(e) {
                $("select[id$=preferred_college] > option").remove();
                var selectedUni = $(e.currentTarget).children("option:selected").val();
                if (selectedUni == 'Cambridge') this.populateDropdown("#preferred_college", data.cambridge_college); else if (selectedUni == 'Oxford') this.populateDropdown("#preferred_college", data.oxford_college);
            },
            'change #type': 'updateQualificationSection',
            'click #add_button': 'addNewRecord',
            'click .topnav': function clickTopnav(e) {
                $("#myLinks").toggle(200);
            },
            'input #statement_content': function inputStatement_content(e) {
                if ($(e.currentTarget).val() == '') {
                    $('#count').hide(200);
                } else {
                    var num_words = $(e.currentTarget).val().match(/.[^\s]+/gm) ? $(e.currentTarget).val().match(/.[^\s]+/gm).length : 0;
                    $('#count').show(200);
                    $('#count').html(num_words + " / 700");

                    if (num_words > 700) {
                        $('#count').css('background-color', '#CC0000');
                        $(e.currentTarget).addClass('incomplete-input invalid');
                    } else if (num_words == 700) {
                        $('#count').css('background-color', 'orange');
                        $(e.currentTarget).removeClass('incomplete-input invalid');
                    } else {
                        $('#count').css('background-color', 'green');
                        $(e.currentTarget).removeClass('incomplete-input invalid');
                    }
                }
            },
            'input .num': function inputNum(e) {
                if (!this.checkValid($(e.currentTarget).val(), ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '', '-', ' ', '(', ')'])) {
                    $(e.currentTarget).addClass('incomplete-input invalid');
                    $(e.currentTarget).next('.invalid_number').show();
                } else {
                    $(e.currentTarget).removeClass('incomplete-input invalid');
                    $(e.currentTarget).next('.invalid_number').hide(); //
                }
            },
            'change .email_address': function changeEmail_address(e) {
                valid_email = false;
                if ($(e.currentTarget).val().length != 0 && (!$(e.currentTarget).val().includes('@') || !$(e.currentTarget).val().includes('.'))) $(e.currentTarget).next('.invalid_email').show(); else $(e.currentTarget).next('.invalid_email').hide();

                if ($(e.currentTarget).parent().next().find('.conf_email_address').val() != '') {
                    if ($(e.currentTarget).val() != $(e.currentTarget).parent().next().find('.conf_email_address').val()) {
                        $(e.currentTarget).parent().next().find('.conf_email_address').nextAll('.invalid_conf_email').show();
                    } else {
                        $(e.currentTarget).parent().next().find('.conf_email_address').nextAll('.invalid_conf_email').hide();
                    }
                }

                if ($(e.currentTarget).hasClass('conf_email_address')) {
                    if ($(e.currentTarget).val() != $(e.currentTarget).parent().prev().find('.email_address').val()) $(e.currentTarget).nextAll('.invalid_conf_email').show(); else $(e.currentTarget).nextAll('.invalid_conf_email').hide();
                }

                $('.invalid_email').each(function () {
                    if ($(this).css('display') == 'block' || $(this).next('.invalid_conf_email').css('display') == 'block') $(this).prevAll('.email_address').addClass('incomplete-input invalid'); else $(this).prevAll('.email_address').removeClass('incomplete-input invalid');
                });
                if (!$(e.currentTarget).hasClass('incomplete-input') && $(e.currentTarget).val().length != 0) valid_email = true;

                if (valid_email && !$(e.currentTarget).hasClass('secondary_email')) {
                    $.ajax({
                        type: 'PUT',
                        data: JSON.stringify({
                            "token": Session.get('applicationtoken'),
                            "email": $(e.currentTarget).val()
                        }),
                        contentType: 'application/json',
                        url: api_config.protocol + api_config.domain + api_config.path + 'application'
                    }).done(function (data) {
                        if (data.result_code == -6) {
                            Backbone.Events.trigger('showError', 'emailReUse');
                        } else if (data.result_code == -9 || data.result_code == -10) {
                            Session.update();
                        }
                    });
                }
            },
            'click input.specifyInput': function clickInputSpecifyInput(e) {
                if ($(e.currentTarget).prop('checked')) {
                    $(e.currentTarget).parents('.form-group').children('.specifyInputBoxDiv').show({
                        duration: 100,
                        easing: 'linear'
                    });
                    $(e.currentTarget).parents('.form-group').children('.specifyInputBoxDiv').find('input, select').addClass('compulsory');
                } else {
                    this.removeInput(e);
                }
            },
            'click input.removeInput': 'removeInput',
            'click button.addItem': 'addNewScholarshipItem',
            'click button.deleteItem': function clickButtonDeleteItem(e) {
                this.scholarshipCounter--;
                $(e.currentTarget).parents('li').remove();

                if ($('div.specifyInputBoxDiv ol li button.btn-danger').length == 1) {
                    $('div.specifyInputBoxDiv ol li button.btn-danger').prop('disabled', true);
                }
            },
            'click button.undoBtn': function clickButtonUndoBtn(e) {
                fileUpload.uploadData[$(e.currentTarget).parents('.form-group').find('input').attr('name')] = '';
                $(e.currentTarget).parents('.form-group').children('div.uploadBtn').toggle();
                $(e.currentTarget).prop('disabled', true);
            },
            'click #validate_button': function () {
                var _clickValidate_button = _asyncToGenerator(
                    /*#__PURE__*/
                    regeneratorRuntime.mark(function _callee() {
                        var validationResults;
                        return regeneratorRuntime.wrap(function _callee$(_context) {
                            while (1) {
                                switch (_context.prev = _context.next) {
                                    case 0:
                                        _context.next = 2;
                                        return validation();

                                    case 2:
                                        validationResults = _context.sent;

                                        if (validationResults.success) {
                                            Router.navigate('preview', {
                                                trigger: true
                                            });
                                        } else {
                                            Backbone.Events.trigger('showError', validationResults.hasDeclared ? 'validation' : 'declaration');
                                            validationResults.hasDeclared ? $(window).scrollTop($($('.sections').has('[class*=incomplete]')[0]).offset().top - (window.innerWidth <= 991 ? $('nav.navbar').outerHeight() : 0)) : null; // $('div.alert div#errorMsg').html('<strong>FORM VALIDATION FAILED</strong><br><hr>Few compulsory fields are incomplete. Please review your form')
                                            // $('div.alert').fadeIn(300);
                                            // setTimeout(() => {
                                            //     $('div.alert').fadeOut(300);
                                            // }, 4000);
                                        }

                                    case 4:
                                    case "end":
                                        return _context.stop();
                                }
                            }
                        }, _callee);
                    }));

                function clickValidate_button() {
                    return _clickValidate_button.apply(this, arguments);
                }

                return clickValidate_button;
            }(),
            'click a.nav-link': function clickANavLink(e) {
                e.preventDefault();
                $(window).scrollTop($($(e.currentTarget).attr('href')).offset().top);
            },
            // 'click div.alert span.closebtn': function (e) {
            //     $(e.currentTarget).parents('div.alert').fadeOut(300);
            //     $('div[class*=container] div.row').css('opacity', 1);
            //     // $(window).scrollTop($('#uploaded_files').offset().top - $('div.alert').height() - 20);
            //     if ($('div.alert div#errorMsg').html().includes('TIMEOUT')) {
            //         if ($('#body').find('#preview').length) {
            //             Router.navigate('applicationForm', {
            //                 trigger: false
            //             })
            //         }
            //         $(window).scrollTop($('#uploaded_files').offset().top - (window.innerWidth <= 991 ? $('nav.navbar').outerHeight() : 0));
            //         $('.undoBtn').not(':disabled').trigger('click');
            //     }
            //     // $(window).scrollTop($($(e.currentTarget).attr('href')).offset().top);
            // },
            'click div.calicon, div.calLabel': function clickDivCaliconDivCalLabel(e) {
                // console.log($(e.currentTarget).siblings('input.datepicker'))
                $(e.currentTarget).siblings('input.datepicker').datepicker('show');
            },
            'click div.uploadProgress div.cancelUpload': function clickDivUploadProgressDivCancelUpload(e) {
                if (fileUpload.jqXHR[$(e.currentTarget).parents('.form-group').find('input').prop('name')] !== undefined) {
                    fileUpload.jqXHR[$(e.currentTarget).parents('.form-group').find('input').prop('name')].abort();
                    Backbone.Events.trigger('showError', 'cancelUpload');
                }
            }
        },
        addNewScholarshipItem: function () {
            var _clickButtonAddItem = _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee2(e) {
                    var that, $listItem;
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    that = this, $listItem = $(this.listItem);
                                    limit = $listItem.find('label, input, select').length - 1;
                                    this.scholarshipCounter++;
                                    _context2.next = 5;
                                    return new Promise(function (resolve, reject) {
                                        $listItem.find('label, input, select').each(function (index, element) {
                                            if ($(this).attr('for') == undefined) {
                                                $(this).attr('name', $(this).attr('name').slice(0, -1) + that.scholarshipCounter);
                                                $(this).attr('id', $(this).attr('id').slice(0, -1) + that.scholarshipCounter);
                                                $(this).addClass('compulsory');
                                            } else {
                                                $(this).attr('for', $(this).attr('for').slice(0, -1) + that.scholarshipCounter);
                                            }

                                            if (index == limit) {
                                                resolve();
                                            }
                                        });
                                    });

                                case 5:
                                    $($('div.specifyInputBoxDiv ol').append($listItem)[0].lastElementChild).find('select').select2({
                                        minimumResultsForSearch: 10,
                                        placeholder: ''
                                    });
                                    $('div.specifyInputBoxDiv ol li button.btn-danger').removeAttr('disabled');

                                case 7:
                                case "end":
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, this);
                }));

            function clickButtonAddItem(_x) {
                return _clickButtonAddItem.apply(this, arguments);
            }

            return clickButtonAddItem;
        }(),
        addNewRecord: function addNewRecord() {
            this.counter += 1;
            var $new = $('#leadership_experience_1').clone();
            var that = this;
            $new.attr('id', "leadership_experience_".concat(this.counter));
            $new.find('#record_num').text("Record ".concat(this.counter, ":"));
            $new.find("#club_name_1").attr('id', "club_name_".concat(this.counter)).val('');
            $new.find("#club_role_1").attr('id', "club_role_".concat(this.counter)).val('');
            $new.find("#club_from_1").attr('id', "club_from_".concat(this.counter)).val('').datepicker({
                format: "yyyy-mm",
                startView: 2,
                viewMode: "years",
                minViewMode: "months",
                autoclose: true,
                todayHighlight: true
            });
            $new.find("#club_to_1").attr('id', "club_to_".concat(this.counter)).val('').datepicker({
                format: "yyyy-mm",
                startView: 2,
                viewMode: "years",
                minViewMode: "months",
                autoclose: true,
                todayHighlight: true
            });
            $new.find("#delete_1").attr('id', "delete_".concat(this.counter)).click(function (e) {
                $(event.target).parents('.leadership_experience').remove();
                that.counter--;
                $('.leadership_experience').each(function (i, obj) {
                    $(obj).find('#record_num').text("Record ".concat(i + 1, ":"));
                    $(obj).attr('id', "leadership_experience_".concat(i + 1));
                    $(obj).find('.club_name').attr('id', "club_name_".concat(i + 1));
                    $(obj).find(".club_role").attr('id', "club_role_".concat(i + 1));
                    $(obj).find(".club_to").attr('id', "club_to_".concat(i + 1));
                    $(obj).find(".club_from").attr('id', "club_from_".concat(i + 1));
                    $(obj).find(".delete").attr('id', "delete_".concat(i + 1));
                });
            });
            $new.append('<hr>');
            $new.appendTo('#add');
        },
        updateQualificationSection: function updateQualificationSection(e) {
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
                $('#grades').html("\n                        <div class = 'col'>\n                            <p>Please input the total mark (0-45)</p>\n                            <input type = 'number' class = 'form-control-sm col-7 grades' name= 'ib-grades' value=0 min=0 max=45>\n                        </div>\n                    ");
            } else if (qual.includes('Others')) {
                $('#grades').html("\n                    <div class = 'col'>\n                        <p>Please input the total grades/marks:</p>\n                        <input type = 'text' class = 'form-control-sm col-7 grades' name= 'others-grades'>\n                    </div>\n                    ");
            } else {
                for (var i = qual == 'Singapore - Cambridge GCE Advanced Level' ? 0 : 2; i < 3; i++) {
                    temp += qual == 'Singapore - Cambridge GCE Advanced Level' ? "<div class = 'col-md-3'>\n                        <p class = 'text-center'><b>H".concat(i + 1, "</b></p>\n                    </div>") : '';

                    for (var j = 0; j < loopData[qual].grades.length; j++) {
                        if(i < 2){
                            temp += "<div class = 'col-md-3'>\n                        <p class = 'text-center'>".concat(String.fromCharCode(65 + j), "</p>\n                        <input type = 'number' class = 'form-control-sm grades' name=").concat(loopData[qual].name, " value=0 min=0 max=20>\n                        </div>");
                        }else{
                            temp += "<div class = 'col-md-3'>\n                        <p class = 'text-center'>".concat(loopData[qual].grades[j], "</p>\n                        <input type = 'number' class = 'form-control-sm grades' name=").concat(loopData[qual].name, " value=0 min=0 max=20>\n                        </div>");
                        }
                    }

                    temp += qual == 'Singapore - Cambridge GCE Advanced Level' ? '</div>' : '';
                }

                $('#grades').html(temp);
            }
        },
        populateDropdown: function populateDropdown(selector_id, array) {
            array.forEach(function (e) {
                $(selector_id).append('<option value="' + e + '">' + e + '</option>');
            });
        },
        setDatePicker: function setDatePicker(selector_id, minViewMode) {
            if (minViewMode == 'days') $(selector_id).datepicker({
                format: "dd-mm-yyyy",
                startView: 2,
                viewMode: "years",
                minViewMode: "days",
                autoclose: true,
                todayHighlight: true
            }); else if (minViewMode == 'months') $(selector_id).datepicker({
                format: "mm-yyyy",
                startView: 2,
                viewMode: "years",
                minViewMode: "months",
                autoclose: true,
                todayHighlight: true
            });
        },
        checkValid: function checkValid(string, list) {
            arr = string.split('');
            var include = true;
            if (arr.length > 0) for (var i = 0; i < arr.length; i++) {
                if (!list.includes(arr[i])) {
                    include = false;
                    break;
                }
            }
            return include;
        },
        bracket_value: function bracket_value(e) {
            var regExp = /\(([^)]+)\)/;
            var brack = regExp.exec(e)[0];
            return brack.match(/\(([^)]+)\)/)[1];
        },
        removeInput: function removeInput(e) {
            $(e.currentTarget).parents('.form-group').children('.specifyInputBoxDiv').hide({
                duration: 100,
                easing: 'linear'
            });
            $(e.currentTarget).parents('.form-group').children('.specifyInputBoxDiv').find('input, select, span').removeClass('compulsory incomplete-input');
            $(e.currentTarget).parents('.form-group').children('.specifyInputBoxDiv').find('input, select').each(function (i, $tag) {
                $($tag).val('');
            });
        },
        render: function render() {
            var that = this;
            this.$el.html(_.template(this.template));
            $(document).ready(function () {
                $('footer').show();
                $(window).scrollTop(0);
                $('body').scrollspy({
                    target: '.navbar'
                });

                if ($('#body').height() + 100 > window.innerHeight) {
                    $('body').css('position', 'relative');
                    $('footer').css('bottom', -$('footer').height() + 'px');
                } else {
                    $('body').css('position', 'static');
                    $('footer').css('bottom', 0);
                }

                var isIE =
                    /*@cc_on!@*/
                    false || !!document.documentMode;

                if (isIE) {
                    // $('select').css('background', 'transparent');
                    $('input[type=file]').click(function (e) {
                        e.stopPropagation();
                    });
                    $('button.fileinput-button').click(function (e) {
                        $(e.currentTarget).find('input').trigger('click');
                    });
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
                });
                $('#current_residential_address_country').select2({
                    placeholder: 'Select Country',
                    tags: true
                });
                $('#present_location').select2({
                    placeholder: 'Select Country',
                    tags: true
                });
                $('#nationality').select2({
                    placeholder: 'Select Nationality',
                    tags: true
                });
                $('#second_nationality').select2({
                    placeholder: 'Second Nationality',
                    tags: true
                });
                $('#type').select2({
                    placeholder: 'Select Qualification',
                    tags: true
                });
                $('#home_area_code').select2({
                    placeholder: 'Area Code',
                    tags: true
                });
                $('#mobile_area_code').select2({
                    placeholder: 'Area Code',
                    tags: true
                });
                $('#referee_area_code').select2({
                    placeholder: 'Area Code',
                    tags: true
                });
                that.populateDropdown("#country_of_origin", data.country_list);
                that.populateDropdown("#current_residential_address_country", data.country_list);
                that.populateDropdown("#present_location", data.country_list);
                that.populateDropdown("#nationality", data.nationalities);
                that.populateDropdown("#second_nationality", data.nationalities);
                that.populateDropdown("#type", data.qualification_list);
                that.setDatePicker("#date_of_birth", 'days');
                that.setDatePicker('.to', 'months');
                that.setDatePicker('.from', 'months');
                $('.invalid_number').html('&nbsp;&nbsp;<i><span style="color:#CC0000"><i class="fas fa-exclamation"></i> Invalid Character</span></i>');
                $('.invalid_email').html('&nbsp;&nbsp;<i><span style="color:#CC0000"><i class="fas fa-exclamation"></i> Invalid Email</span></i>');
                $('.invalid_conf_email').html('&nbsp;&nbsp;<i><span style="color:#CC0000"><i class="fas fa-exclamation"></i> Should be same as the above email</span></i>');
                data.country_codes.forEach(function (e) {
                    $('#home_area_code').append('<option value="' + that.bracket_value(e) + '">' + e + '</option>');
                    $('#mobile_area_code').append('<option value="' + that.bracket_value(e) + '">' + e + '</option>');
                    $('#referee_area_code').append('<option value="' + that.bracket_value(e) + '">' + e + '</option>');
                });
                $('.invalid_number').html('&nbsp;&nbsp;<i><span style="color:#CC0000"><i class="fas fa-exclamation"></i> Invalid Character</span></i>');
                $('.invalid_email').html('&nbsp;&nbsp;<i><span style="color:#CC0000"><i class="fas fa-exclamation"></i> Invalid Email</span></i>');
                $('.invalid_conf_email').html('&nbsp;&nbsp;<i><span style="color:#CC0000"><i class="fas fa-exclamation"></i> Should be same as the above email</span></i>');
                $(".section_heading").hover(function () {
                    $(this).css('color', '#115798');
                }, function () {
                    $(this).css('color', 'black');
                });
                fileUpload.init();
            });
        }
    });
});
