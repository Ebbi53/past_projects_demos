{
    "apiVersion":"1.0.0",
    "swaggerVersion":"1.2",
    "basePath":"/boilerplate/index.cfm/",
    "resourcePath":"/credential",
    "produces":["application/json"],
    "apis":[
        {
            "path":"api/credential",
            "operations":[
                {
                    "method":"POST",
                    "summary":"Verify credential",
                    "notes":"",
                    "type":"Credential",
                    "item":"Credential",
                    "nickname":"Credential",
                    "parameters":[
                        {"name":"credential",
                         "description":"credential",
                         "required":true,
                         "paramType":"body",
                         "dataType":"Credential"
                        }
                    ],
                    "responseMessages":[
                        {
                            "code":202,
                            "message":"Verified"
                        },
                        {
                            "code":404,
                            "message":"Not verified"
                        },
                        {
                            "code":403,
                            "message":"Not authorized"
                        }
                    ]
                }
            ]
        }
    ],
    "models":{
        "Credential":{
            "id":"Credential",
            "properties":{
                "username":{
                    "type":"string",
                    "description":"username"
                },
                "password":{
                    "type":"string",
                    "description":"password"
                }
            }
        }
    }
}