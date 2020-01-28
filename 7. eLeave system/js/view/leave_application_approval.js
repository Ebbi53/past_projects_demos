
// Leave balance
define(['jquery', 'underscore', 'backbone', 'moduleConfig', 'text!template/leave_application_approval.html', 'collection/leave_application_approval', 'model/leave_approve', 'model/leave_reject', 'model/team_leave_history', 'model/user_status', 'collection/public_holidays', 'datepicker', 'moment'], function ($, _, Backbone, moduleConfig, tmpl, LeaveApplicatoinApprovalCollection, LeaveApprove, LeaveReject, TeamLeaveSchedule, statusModel, PublicHolidays, datepicker, moment) {
  var LeaveApplicatoinApprovalView = Backbone.View.extend({
    tagName: 'div',
    className: 'leaveApplicatonApprovalView container fadeIn',
    isShowDateDetail: false,
    currentTmpl: tmpl,

    /*	options	*/
    isOneTime: false,
    zgOneTimeApprovalToken: '',
    initialize: function initialize(options) {
      window.moment = moment;
      this.vent = options.vent || _.extend({}, Backbone.Events);
      this.collection = this.collection || new LeaveApplicatoinApprovalCollection(options.collectionJSON || {});
      this.isOneTime = options.isOneTime || false;
      this.zgOneTimeApprovalToken = options.zgOneTimeApprovalToken || '';
      this.teamLeaveSchedule = options.teamLeaveSchedule || new TeamLeaveSchedule(options.teamLeaveHistoryJSON || null);
      this.publicHolidayCollection = options.publicHolidayCollection || new PublicHolidays(options.publicHolidayCollectionJSON || null);
      this.mStatus = this.mStatus || new statusModel(options.modelJSON || {});
      this.setupEventListeners();
      this.render(50);
      this.prepareDataAndRender();
    },
    events: {
      'swipe [datepicker]': 'onSwipe',
      'draw [datepicker]': 'drawAdditionalDetailApp',
      'mousedown [datepicker] td.day': 'toggleShowDateDetailApp',
      'click [btn_approve]': 'approveLeaveApplication',
      'click [pre_reject]': 'preRejectLeave',
      'click [btn_reject]': 'rejectLeaveApplication'
    },
    onSwipe: function onSwipe(e) {
      if (e.gesture.direction == 2) {
        $('[datepicker]').fadeOut(50, function () {
          $('th.next')[0].click();
          $('[datepicker]').fadeIn();
        });
      } else if (e.gesture.direction == 4) {
        $('[datepicker]').fadeOut(50, function () {
          $('th.prev')[0].click();
          $('[datepicker]').fadeIn();
        });
      }
    },
    setupView: function setupView() {},
    toggleShowDateDetailApp: function toggleShowDateDetailApp(event) {
      var $element = $(event.srcElement || event.target).closest('.day'); 

      if (!$element.hasClass('btn-primary')) this.isShowDateDetail = true;else this.isShowDateDetail = !this.isShowDateDetail;
    },
    drawDayDetail: function drawDayDetail(event, data) {
      if (!this.isShowDateDetail) return; 

      var dateObj = new Date(parseInt(data.date, 10)),
          day = dateObj.getDate(),
          month = dateObj.getMonth() + 1,
          year = dateObj.getFullYear();
      dateObj = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 0, 0, 0, 0);
      var $element = this.$('[datepicker] [date=' + dateObj.valueOf() + '].day'),
          $tr = $element.closest('tr'),
          that = this;
      var $optionRow = $('<tr>');
      $tr.after($optionRow);

      _.defer(function () {
        var $batchSelectionRow = $('<tr>'); //$pmRow = $('<tr>');

        var dateStr = (month < 10 ? '0' + month : month) + '/' + (day < 10 ? '0' + day : day) + '/' + year;
        var dateStr2 = (day < 10 ? '0' + day : day) + '/' + (month < 10 ? '0' + month : month) + '/' + year; 

        var haveDayarr = [];

        _.each(that.teamLeaveSchedule.get('displayDate'), function (val, k) {
          //trim to only tat dat
          if (dateStr2 == val) {
            haveDayarr.push(k);
          }
        });

        var nameSpaceArr = {};

        _.each(haveDayarr, function (val, k) {
          if (!nameSpaceArr[that.teamLeaveSchedule.get('teamMemberName')[val]]) {
            nameSpaceArr[that.teamLeaveSchedule.get('teamMemberName')[val]] = {};
            nameSpaceArr[that.teamLeaveSchedule.get('teamMemberName')[val]].session = '';
            nameSpaceArr[that.teamLeaveSchedule.get('teamMemberName')[val]].key = '';
          }

          if (nameSpaceArr[that.teamLeaveSchedule.get('teamMemberName')[val]].session == 'am' || nameSpaceArr[that.teamLeaveSchedule.get('teamMemberName')[val]].session == 'pm') {
            nameSpaceArr[that.teamLeaveSchedule.get('teamMemberName')[val]].session = 'full day';
          } else {
            nameSpaceArr[that.teamLeaveSchedule.get('teamMemberName')[val]].key = val;
            nameSpaceArr[that.teamLeaveSchedule.get('teamMemberName')[val]].session += that.teamLeaveSchedule.get('session')[val];
          }
        }); 

        var tmpStr = [];

        _.each(nameSpaceArr, function (val, usrname) {
          tmpStr.push('<div style="display:inline-block;"><a class="event" style="display:inline-block;background-color:rgba(' + that.teamLeaveSchedule.get("colorVal")[val.key] + ',1)"></a>&nbsp;' + usrname + ': ' + val.session + '</div>');
        }); 

        var holyStr = '';
        holyStr = tmpStr.join(', ');

        if (holyStr !== '') {
          var $funnyrow = $('<tr>');
          $funnyrow.html('').addClass('extraRow').css('background-color', 'azure').append($('<td>').attr('colspan', $tr.find('td').length).append($('<div>').addClass('leaveApplicationDialogView fadeIn').append($('<div>').addClass('col-xs-12').append($('<div>').html(holyStr)))));
          $optionRow.before($funnyrow);
        }
      });

      if ($element.attr('public_holiday') != null) {
        _.defer(function () {
          var $newRow = $('<tr>'),
              holidayModel = that.publicHolidayCollection.get($element.attr('public_holiday'));
          $newRow.addClass('extraRow').append($('<td>').attr('colspan', $tr.find('td').length).text(holidayModel.get('holiday'))); 

          $tr.after($newRow);
          $(document).scrollTop(that.$('.extraRow').first().offset().top);
        });
      }
    },
    setupEventListeners: function setupEventListeners() {
      var that = this;
    },
    render: function render(progress) {
      this.$el.html(_.template(this.currentTmpl)({
        collection: this.collection.toJSON(),
        progress: progress
      }));
      this.$('[datepicker]').datepicker();
      this.$('[datepicker]').hammer(); //{ domEvents: true }
    },
    prepareDataAndRender: function prepareDataAndRender() {
      if (!this.isOneTime) {
        var that = this;
        this.publicHolidayCollection.fetch({
          reset: true,
          success: function success() {},
          error: function error() {
            that.collection.reset();
            that.render(100);
          }
        });
        that.teamLeaveSchedule.fetch({
          success: function success() {
            that.teamLeaveSchedule.aftermath(); 

            that.drawTeamLeaveHistory();
          },
          error: function error(collection, response, options) {
            switch (response.error) {
              case "password expired":
                $.alert({
                  animation: 'none',
                  title: 'Password expired!',
                  content: "Please reset your password."
                });
                window.location = window.location.pathname + '#user';
                break;
            }

            that.teamLeaveSchedule.reset();
            that.drawTeamLeaveHistory();
          }
        });
        that.collection.fetch({
          reset: true,
          success: function success() {
            that.render(100);
            this.$('#calendarFAB').removeClass('hidden');
          },
          error: function error() {
            that.collection.reset();
            that.render(100);
          }
        });
      } else {
        this.render(100);
      }
    },
    drawTeamLeaveHistory: function drawTeamLeaveHistory() {
      var that = this;
      var mymillis = that.teamLeaveSchedule.get('dateValue');
      var myNames = that.teamLeaveSchedule.get('teamMemberName');
      var myColor = that.teamLeaveSchedule.get('colorVal'); 

      _.each(mymillis, function (val, key) {
        var dateEventList = that.$('[datepicker] [date=' + val + '].day').find('.events-list'); 

        if (dateEventList.find('a[myName="' + myNames[key] + '"]').length == 0) {
          dateEventList.append($('<a>').css("background-color", "rgba(" + myColor[key] + ",1)").addClass('pull-left event ').attr('myName', myNames[key]));
        }
      });
    },
    updateUserStatus: function updateUserStatus() {
      var that = this;
      that.mStatus.fetch({
        success: function success() {
          var lastLogin = that.mStatus.toJSON().userStatus.split('Last success logon time')[1].split(/\r\n|\r|\n/g)[1];
          moduleConfig.runtime['lastLogin'] = lastLogin;
          var sess_cnt = that.mStatus.toJSON().userStatus.split('openSessionToken in service count')[1].split(/\r\n|\r|\n/g)[1]; 

          moduleConfig.runtime['sess_cnt'] = sess_cnt;
          var pending_approval_cnt = that.mStatus.toJSON().userStatus.split('pending leave application approval count')[1].split(/\r\n|\r|\n/g)[1];
          moduleConfig.runtime['pending_approval_cnt'] = pending_approval_cnt;
          var sub = that.mStatus.toJSON().userStatus.split(/\r\n|\r|\n/g)[1];
          var takeBankHoliday = that.mStatus.toJSON().userStatus.split('can take leave on bank holiday')[1].split(/\r\n|\r|\n/g)[1] === 'yes' ? true : false;
          moduleConfig.runtime['takeBankHoliday'] = takeBankHoliday;
          var isMan = false;

          if (typeof sub !== 'undefined' && sub !== '') {
            isMan = true;
          }

          moduleConfig.runtime['isManager'] = isMan;
          that.render();
        },
        error: function error() {
          that.render();
        }
      });
    },
    drawHoliday: function drawHoliday(event, data) {
      var that = this;
      var dateValue = data.date;
      that.publicHolidayCollection.each(function (holidayModel) {
        var holidayDateValue = holidayModel.get('dateValue');
        that.$('[datepicker] [date=' + holidayDateValue + '].day').attr('public_holiday', holidayModel.get('id'));
      }); //add sat and sun

      $('[datepicker] tbody tr').each(function (k, v) {
        var $td = $(this).children('td.day');
        $td.first().addClass('holiday');
        $td.last().addClass('holiday');
      });
    },
    drawAdditionalDetailApp: function drawAdditionalDetailApp(event, data) {
      this.drawHoliday(event, data);
      this.drawTeamLeaveHistory(event, data);
      this.drawDayDetail(event, data);
    },
    approveLeaveApplication: function approveLeaveApplication(event) {
      var $element = $(event.srcElement || event.target).closest('[btn_approve]'),
          trxToken = $element.attr('btn_approve');
      var leaveApproveObj = new LeaveApprove();
      var that = this;
      $.confirm({
        title: 'Confirm',
        content: 'Approve this leave?',
        type: 'green',
        animation: 'none',
        buttons: {
          only: {
            btnClass: 'btn-green',
            text: 'Approve',
            action: function action() {
              var data = {};

              if (!that.isOneTime) {
                data = {
                  zgTrxToken: trxToken
                };
              } else {
                data = {
                  zgOneTimeApprovalToken: that.zgOneTimeApprovalToken,
                  zgTrxToken: trxToken
                };
                that.collection.reset();
              }

              leaveApproveObj.fetch({
                data: data,
                success: function success() {
                  that.prepareDataAndRender();
                  Backbone.trigger("global:success", {
                    msg: 'Leave application has been approved.'
                  });
                  that.updateUserStatus();
                },
                error: function error() {
                  console.log('error', arguments);
                  Backbone.trigger("global:danger", {
                    msg: 'Something went wrong, please try again.'
                  });
                }
              });
            }
          },
          close: function close() {
            // $.alert('Canceled!');
          }
        }
      });
    },
    preRejectLeave: function preRejectLeave(event) {
      var $element = $(event.srcElement || event.target).closest('[pre_reject]'),
          trxToken = $element.attr('pre_reject');
      $('[btn_reject]').attr('btn_reject', trxToken);
    },
    rejectLeaveApplication: function rejectLeaveApplication(event) {
      //     $('#rejectModal').modal().hide();
      $("body").removeClass("modal-open");
      $('.modal-backdrop').remove();
      var $element = $(event.srcElement || event.target).closest('[btn_reject]'),
          trxToken = $element.attr('btn_reject');
      var leaveRejectObj = new LeaveReject();
      var that = this;
      var comment = $('#comment_box').val();
      $('#comment_box').val("");
      var data = {};

      if (!this.isOneTime) {
        data = {
          zgTrxToken: trxToken,
          zgRejectReason: comment
        };
      } else {
        data = {
          zgOneTimeApprovalToken: this.zgOneTimeApprovalToken,
          zgTrxToken: trxToken,
          zgRejectReason: comment
        };
        this.collection.reset();
      }

      leaveRejectObj.fetch({
        data: data,
        success: function success() {
          that.prepareDataAndRender();
          Backbone.trigger("global:success", {
            msg: 'Leave application has been rejected.'
          });
          that.updateUserStatus();
        },
        error: function error(collection, response, options) {
          if (response.error) Backbone.trigger("global:danger", {
            msg: response.error
          });else Backbone.trigger("global:danger", {
            msg: 'Something went wrong, please try again.'
          });
        }
      });
    }
  });
  return LeaveApplicatoinApprovalView;
});