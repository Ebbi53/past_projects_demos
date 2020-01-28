define(['jquery', 'model/session', 'file_upload', 'api_config'], function ($, Session, fileupload, api_config) {
    return async function () {

        var form_data = {};
        var success = true;

        await new Promise((resolve, reject) => {
            $('.sections').each(async function (index) {
                var section = $(this)
                var main_key = section.attr('id');
                form_data[main_key] = {};

                await new Promise((resolve, reject) => {
                    section.find('input, select').each(function (index) {
                        key = $(this).attr('name')
                        if ($(this).is('[type=checkbox]')) {
                            form_data[main_key][key] = form_data[main_key][key] || [];
                            $(this).prop('checked') ? form_data[main_key][key].push($(this).val()) : null
                        } else if ($(this).is('[type=radio]')) {
                            form_data[main_key][key] = form_data[main_key][key] || '';
                            $(this).prop('checked') ? form_data[main_key][key] = $(this).val() : null
                        } else if ($(this).is('[type=file]')) {
                            form_data[main_key][key] = fileupload.uploadData[key]
                        } else {
                            form_data[main_key][key] = $(this).val();
                        }

                        if (index == section.find('input, select').length - 1) {
                            resolve();
                        }
                    })
                })

                if (index == $('.sections').length - 1) {
                    resolve();
                }
            })
        })
        
        form_data["tertiary_education"] = [form_data["tertiary_education"]]
        form_data["working_exp"] = [form_data["working_exp"]]
        form_data['token'] = Session.get('applicationtoken')

        for (let i = 0; i < 2 && !success; i++) {
            await new Promise((resolve, reject) => {
                $.ajax({
                    type: 'POST',
                    data: JSON.stringify(form_data),
                    contentType: 'application/json',
                    url: api_config.protocol + api_config.domain + api_config.path + "application",
                    success: async function (data) {
                        if (data.result_code != 2) {
                            if (data.result_code == -9 || data.result_code == -10) {
                                success = await Session.update();
                            } else {
                                success = false
                            }
                        } else {
                            success = true
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