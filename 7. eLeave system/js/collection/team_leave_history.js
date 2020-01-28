
// leave application approval collection
define(['jquery', 'underscore', 'backbone', 'moduleConfig', 'model/team_leave_history'], function ($, _, Backbone, moduleConfig, TeamLeaveHistory) {
  var SubordinatesLeaveHistoryCollection = Backbone.Collection.extend({
    url: moduleConfig.modelBaseUrlRoot + '?zgAction=getTeamLeaveSchedule',
    //getTeamLeaveHistory//getSubordinatesLeaveHistory
    model: TeamLeaveHistory,
    getDistinctUserId: function getDistinctUserId() {
      return _.uniq(this.pluck('id_user'));
    },
    setByLeaveHistory: function setByLeaveHistory(exceptApprovalActionArr) {
      var that = this,
          idArr = this.models[0].get('id'),
          idurArr = this.models[0].get('id_user'),
          nameArr = this.models[0].get('teamMemberName'),
          dateArr = this.models[0].get('date'),
          sessionArr = this.models[0].get('session'),
          typeArr = this.models[0].get('type'),
          trxTokenArr = this.models[0].get('trxToken'),
          approvalActionArr = this.models[0].get('approvalAction');
      var tempArr = [];

      _.each(this.models[0].get('date'), function (date, index) {
        if (exceptApprovalActionArr && exceptApprovalActionArr.indexOf(approvalActionArr[index]) != -1) return;
        tempArr.push(new TeamLeaveHistory({
          id: idArr[index],
          id_user: idurArr[index],
          teamMemberName: nameArr[index],
          date: dateArr[index],
          session: sessionArr[index],
          type: typeArr[index],
          trxToken: trxTokenArr[index],
          approvalAction: approvalActionArr[index]
        }));
      });

      that.reset(tempArr);
    }
  });
  return SubordinatesLeaveHistoryCollection;
});