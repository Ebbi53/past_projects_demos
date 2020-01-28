define(['jquery', 'model/session', 'api_config'], function ($, Session, api_config) {
    return async function () {

        var form_data = {};
        var success = true;

        await new Promise((resolve, reject) => {
            form_data['questionnaire'] = {};
            $('#questionnaire').find('input, select').each(function (index) {
                key = $(this).attr('name')
                if ($(this).is('[type=checkbox]')) {
                    form_data['questionnaire'][key] = form_data['questionnaire'][key] || [];
                    $(this).prop('checked') ? form_data['questionnaire'][key].push($(this).val()) : null
                } else {
                    form_data['questionnaire'][key] = form_data['questionnaire'][key] || '';
                    if ($(this).is('[type=radio]')) {
                        $(this).prop('checked') ? form_data['questionnaire'][key] = $(this).val() : null
                    } else if ($(this).is('[type=file]')) {
                        form_data['questionnaire'][key] = fileupload.uploadData[key]
                    } else {
                        form_data['questionnaire'][key] = $(this).val();
                    }
                }
                if (index == $('#questionnaire').find('input, select').length - 1) {
                    resolve();
                }
            })
        })

        form_data['token'] = Session.get('applicationtoken')

        for (let i = 0; i < 2 && !success; i++) {
            await new Promise((resolve, reject) => {
                $.ajax({
                    type: 'POST',
                    data: JSON.stringify(form_data),
                    contentType: 'application/json',
                    url: api_config.protocol + api_config.domain + api_config.path + 'minisurvey',   //TODO
                    success: async function (data) {
                        //TODO
                        if (data.result_code == 4) {
                            success = true
                        } else {
                            success = false
                        }
                        resolve()
                    },
                    fail: function () {
                        success = false
                        resolve()
                    }
                })
            })
        }

        return success;
    }
})
