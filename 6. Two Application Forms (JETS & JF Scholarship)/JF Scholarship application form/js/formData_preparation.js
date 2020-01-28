define(['jquery', 'model/session', 'file_upload', 'api_config'], function($, Session, fileUpload, api_config) {
    return async function() {
        var form_data = {}
        var source = []
        var other_scholarships = []
        var uploaded_files = []
        var success = true


        var gce_grades = ['0', '0', '0', '0']
        var dse_grades = ['0', '0', '0', '0']
        var stpm_grades = ['0', '0', '0']
        var gceal_grades = ['0', '0', '0', '0', '0', '0', '0', '0', '0']
        var ib_grades = '0'
        var other_grades = '0'

        function grade_array(obj) {
            obj['dse-grades'] = dse_grades
            obj['stpm-grades'] = stpm_grades
            obj['gceal-grades'] = gceal_grades
            obj['gce-grades'] = gce_grades
            obj['ib-grades'] = ib_grades
            obj['others-grades'] = other_grades
        }

        $('.sections').each(function() {
            var section = $(this)
            var main_key = section.attr('id');
            var sub_data = {}
            var key, value
            var counter = 0

            if (main_key == 'activities') {
                var temp = []
                section.find('.leadership_experience').each(function() {
                    var temp_data = {}
                    $(this).find('input').each(function() {
                        temp_data[$(this).attr('name')] = $(this).val()
                    })
                    temp.push(temp_data)
                })
                form_data['activities'] = temp

            } else if (main_key == 'uploaded_files') {
                form_data['cv_upload'] = fileUpload.uploadData;
                form_data[main_key] = [];
                for (let key in fileUpload.uploadData) {
                    form_data[main_key].push({
                        'file': key,
                        'display_file_name': fileUpload.uploadData[key]
                    })
                }
            } else {

                section.find('input, select, textarea').each(function() {
                    key = $(this).attr('name')
                    switch (key) {
                        case 'gender':
                            if ($(this).is(':checked')) {
                                value = $(this).val()
                                break;
                            } else
                                break;

                        case 'phone_home':
                            value = $('#home_area_code').val() + ' ' + $('#home_number').val()
                            break;

                        case 'phone_mobile':
                            value = $('#mobile_area_code').val() + ' ' + $('#mobile_number').val()
                            break;

                        case 'referee_telephone':
                            value = $('#referee_area_code').val() + ' ' + $('#referee_telephone').val()
                            break;


                        case 'gce-grades':
                            gce_grades[counter] = $(this).val()
                            counter++
                            if (counter == 4) {
                                sub_data['acad_type'] = 'gce'
                                value = gce_grades
                                grade_array(sub_data)
                                counter = 0
                                break;
                            }
                            break;

                        case 'ib-grades':
                            ib_grades = $(this).val()
                            sub_data['acad_type'] = 'ib'
                            value = ib_grades
                            grade_array(sub_data)
                            break;

                        case 'dse-grades':
                            dse_grades[counter] = $(this).val()
                            counter++
                            if (counter == 4) {
                                sub_data['acad_type'] = 'dse'
                                value = dse_grades
                                grade_array(sub_data)
                                counter = 0
                                break;
                            }
                            break;

                        case 'stpm-grades':
                            stpm_grades[counter] = $(this).val()
                            counter++
                            if (counter == 3) {
                                sub_data['acad_type'] = 'stpm'
                                value = stpm_grades
                                grade_array(sub_data)
                                counter = 0
                                break;
                            }
                            break;

                        case 'gceal-grades':
                            gceal_grades[counter] = $(this).val()
                            counter++
                            if (counter == 9) {
                                sub_data['acad_type'] = 'gceal'
                                value = gceal_grades
                                grade_array(sub_data)
                                counter = 0
                                break;
                            }
                            break;

                        case 'others-grades':
                            other_grades = $(this).val()
                            sub_data['acad_type'] = 'others'
                            value = other_grades
                            grade_array(sub_data)
                            break;

                        case 'university_invitation':
                            if ($(this).is(':checked')) {
                                value = $(this).val()
                                break;
                            } else
                                break;

                        case 'source':
                            if ($(this).is(':checked')) {
                                if ($(this).val() == 'Others') {
                                    var src = $('input:text[name="specific_of_other_source"]').val()
                                    sub_data['specific_of_other_source'] = src
                                } else {
                                    sub_data['specific_of_other_source'] = ""
                                }
                                source.push($(this).val())
                            }
                            value = source
                            break;

                        case 'sent_email_to_school_principal':
                            if ($(this).is(':checked')) {
                                value = $(this).val()
                                break;
                            } else
                                break;


                        case 'other_scholarship_application':
                            if ($(this).is(':checked')) {
                                if ($(this).val() == 'yes') {
                                    value = 'yes'
                                    $('.scholarship').each(function() {
                                        var scholarship = {}
                                        scholarship['scholarship_name'] = $(this).find('.scholarship_name').val()
                                        scholarship['scholarship_type'] = $(this).find('.scholarship_type').val()
                                        other_scholarships.push(scholarship)
                                    })
                                    sub_data['name_of_scholarship'] = other_scholarships
                                    break;

                                } else {
                                    value = 'no'
                                    sub_data['name_of_scholarship'] = []
                                    break;
                                }
                            } else {
                                break;
                            }
                        case '*=name_of_scholarship':
                            break;
                        case '*=type_of_scholarship':
                            break;
                        default:
                            value = $(this).val()
                    }


                    sub_data[key] = value


                    delete sub_data[""]
                    delete sub_data[undefined]
                    var keys = Object.keys(sub_data)
                    for (key of keys) {
                        if (key.includes('name_of_scholarship_') || key.includes('type_of_scholarship_'))
                            delete sub_data[key]
                    }



                })
                form_data[main_key] = sub_data
            }
            form_data['token'] = Session.get('applicationtoken')
        })

        console.log(form_data)


        // for (let i = 0; i < 2 && !success; i++) {
        //     await new Promise((resolve, reject) => {
        //         $.ajax({
        //                 type: 'POST',
        //                 data: JSON.stringify(form_data),
        //                 contentType: 'application/json',
        //                 url: api_config.protocol + api_config.domain + api_config.path + 'application',
        //             })
        //             .done(async function(data, textStatus) {
        //                 // console.log(textStatus)
        //                 if (data.result_code != 2) {
        //                     if (data.result_code == -9 || data.result_code == -10) {
        //                         if (await Session.update()) {
        //                             success = 'Session updated'
        //                         } else {
        //                             success = false;
        //                         }
        //                         i++;
        //                     } else {
        //                         success = false
        //                     }
        //                 } else {
        //                     success = true
        //                 }
        //             })
        //             .fail(function(data, textStatus) {
        //                 // console.log(textStatus)s
        //                 // console.log(data)
        //                 success = false
        //             })
        //             .always(function(textStatus) {
        //                 resolve()
        //                     // console.log(textStatus)
        //             })
        //     })
        // }

        // if (!success) {
        //     window.alert('There was a server error while processing your request. Please submit again. Aplogies for the inconvenience caused.')
        // }
        return success;

        // return form_data;

    }
})