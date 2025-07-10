
// config backbone to work with file maker
define(['jquery', 'underscore', 'backbone', 'moduleConfig'], function ($, _, Backbone, moduleConfig) {
  var urlConfig = {
    'getNewSession': {
      dataType: 'model'
    },
    'onetimetoken': {
      dataType: 'model'
    },
    'newSystemGenPassword': {
      dataType: 'model'
    },
    'getLeaveHistory': {
      dataType: 'model',
      arrayAttr: ['date', 'type', 'session', 'id', 'approvalAction', 'trxToken']
    },
    'getLeaveBalance': {
      dataType: 'model'
    },
    'invalidateOpenToken': {
      dataType: 'model'
    },
    'invalidateAllOpenToken': {
      dataType: 'model'
    },
    'getUserStatus': {
      dataType: 'model'
    },
    'getTeamLeaveSchedule': {
      dataType: 'model'
    },
    'getPublicHolidayList': {
      dataType: 'collection'
    },
    'getPendingApprovalList': {
      dataType: 'collection',
      arrayAttr: ['date', 'type', 'session']
    },
    'approveLeaveRequest': {
      dataType: 'model'
    },
    'getOneTimeApproval': {
      dataType: 'model',
      arrayAttr: ['date', 'type', 'session']
    },
    'getPendingEndorsementList': {
      dataType: 'collection',
      arrayAttr: ['date', 'type', 'session']
    },
    'endorseLeaveRequest': {
      dataType: 'model'
    },
    'getOneTimeEndorse': {
      dataType: 'model',
      arrayAttr: ['date', 'type', 'session']
    },
    'rejectLeaveRequest': {
      dataType: 'model'
    },
    'rejectLeaveEndorsement': {
      dataType: 'model'
    },
    'postLeaveRequest': {
      dataType: 'collection',
      getFileMakerObj: function getFileMakerObj(obj) {
        return {
          'zgDateList': obj.date,
          'zgDateSessionList': obj.session,
          'zgLeaveTypeList': obj.type
        };
      }
    },
    'cancelLeaveRequest': {
      dataType: 'model',
      getFileMakerObj: function getFileMakerObj(obj) {
        return {
          'zgLeaveDateId': obj.id
        };
      }
    },
    'setNewPassword': {
      dataType: 'model',
      getFileMakerObj: function getFileMakerObj(obj) {
        return {
          'zgNewPwd': obj.newPwd
        };
      }
    },
    'getSubordinatesLeaveHistory': {
      dataType: 'collection'
    }
  };

  var xmlInterpreter = function xmlInterpreter(xmlDoc, config) {
    var $xmlDoc = $(xmlDoc),
        $attributes = $xmlDoc.find('METADATA FIELD'),
        $rows = $xmlDoc.find('RESULTSET ROW');
    var parsedData = config.dataType == 'collection' ? [] : {};
    $rows.each(function (rowIndex) {
      var obj = {};
      var $row = $(this),
          $col = $row.children('COL');
      $attributes.each(function (attrIndex) {
        var $attr = $(this),
            attrName = $attr.attr('NAME').split('::'),
            $data = $($col.get(attrIndex)).children('DATA');
        if (attrName.length > 1) attrName = attrName[1];else attrName = attrName[0];
        if (config.arrayAttr == null || config.arrayAttr.indexOf(attrName) == -1) obj[attrName] = $data.first().text();else {
          obj[attrName] = [];
          $data.each(function (dataIndex) {
            obj[attrName].push($(this).text());
          });
        }
      });
      if (config.dataType == 'collection') parsedData.push(obj);else parsedData = obj;
    });
    return parsedData;
  };

  Backbone.ajax = function (request) {
    var actionStr = request.url.split('zgAction=')[1];
    actionStr = actionStr.split('&')[0];
    request.url = request.url.split('?zgAction=')[0];
    var actionObj = {
      'zgAction': actionStr
    };
    var paramObj = moduleConfig.modelDefaultActionParam,
        modelData = request.data || {},
        extraData = request.extraData || {},
        successCallback = request.success,
        errorCallback = request.error;
    if (paramObj.SessionTokenKey && request.dontPutSessionToken) delete paramObj.SessionTokenKey;
    if (typeof modelData == 'string') modelData = JSON.parse(modelData);
    /*  add default param   */

    if (Array.isArray(modelData)) {
      var _modelData = {};

      _.each(modelData, function (obj, objIndex) {
        var _obj = {};
        if (urlConfig[actionStr].getFileMakerObj) obj = urlConfig[actionStr].getFileMakerObj(obj);

        _.each(Object.keys(obj), function (key) {
          _obj[key + '(' + (objIndex + 1) + ')'] = obj[key];
        });

        _modelData = _.extend(_modelData, _obj);
      });

      paramObj = _.extend(_modelData, paramObj, extraData, actionObj);
    } else {
      if (urlConfig[actionStr].getFileMakerObj) modelData = urlConfig[actionStr].getFileMakerObj(modelData);
      paramObj = _.extend(modelData, paramObj, extraData, actionObj);
    }
    /*  success callback    */


    successCallback = _.wrap(successCallback, function (callback, arg) {
      var parsedObj = xmlInterpreter(arg, urlConfig[actionStr]);

      if (Array.isArray(parsedObj) && parsedObj.length > 0 && parsedObj[0].error || parsedObj.error || $(arg).find('ERRORCODE').length > 0 && $(arg).find('ERRORCODE').first().text() != '0') {
        errorCallback(parsedObj);
        return;
      }

      callback(parsedObj);
    });
    $.support.cors = true;
    /*  prepare request     */

    request.type = 'POST';
    request.data = $.param(paramObj).replace(/%2F/g, "/");
    request.success = successCallback;
    request.dataType = 'xml';
    request.crossDomain = true;
    delete request.contentType;
    Backbone.trigger("global:ajaxSent");
    return Backbone.$.ajax.apply(Backbone.$, [request]);
  };

  Backbone.on('global:sessionUpdated', function () {
    if (moduleConfig.runtime.session && moduleConfig.runtime.session.sessionToken) {
      moduleConfig.modelDefaultActionParam.SessionTokenKey = moduleConfig.runtime.session.sessionToken;
    } else {
      delete moduleConfig.modelDefaultActionParam.SessionTokenKey;
    }
  });
});