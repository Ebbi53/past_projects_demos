
// Leave application
define(['jquery', 'underscore', 'backbone', 'datepicker', 'text!template/leave_application.html', 'view/leave_application_dialog', 'collection/public_holidays', 'collection/leave_request', 'model/leave_history', 'model/team_leave_history', 'model/leave_request', 'model/leave_balance', 'model/user_status', 'jqconfirm', 'moduleConfig'], function ($, _, Backbone, datepicker, tmpl, LeaveApplicationDialogView, PublicHolidays, LeaveRequests, LeaveHistory, TeamLeaveSchedule, LeaveRequest, LeaveBalance, statusModel, jqconfirm, moduleConfig) {
  var LeaveApplicatoinView = Backbone.View.extend({
    tagName: 'div',
    className: 'leaveApplicationView container fadeIn',
    currentTmpl: tmpl,
    isShowDateDetail: false,
    isSendingLeaveRequest: false,
    isShowingSelected: false,
    startedLongLeave: false,
    applicationActionType: {
      SELECT: 'Select',
      DESELECT: 'Deselect',
      CANCEL: 'cancel',
      START: 'start',
      END: 'end',
      APPLIED: 'applied'
    },
    initialize: function initialize(options) {
      var that = this;
      this.vent = options.vent || _.extend({}, Backbone.Events);
      this.leaveApplicationVent = _.extend({}, Backbone.Events);
      this.leaveRequestCollection = options.leaveRequestCollection || new LeaveRequests(options.leaveRequestCollectionJSON || null);
      this.leaveRequestCollectionSender = options.leaveRequestCollection || new LeaveRequests(options.leaveRequestCollectionJSON || null);
      this.leaveHistoryCollection = options.leaveHistoryCollection || new LeaveRequests(options.leaveHistoryCollectionJSON || null);
      this.leaveHistory = options.leaveHistory || new LeaveHistory(options.leaveHistoryJSON || null);
      this.teamLeaveSchedule = options.teamLeaveSchedule || new TeamLeaveSchedule(options.teamLeaveHistoryJSON || null);
      this.leaveBalance = options.leaveBalance || new LeaveBalance(options.leaveBalanceJSON || null);
      this.mStatus = this.mStatus || new statusModel(options.modelJSON || {});
      this.publicHolidayCollection = options.publicHolidayCollection || new PublicHolidays(options.publicHolidayCollectionJSON || null);
      this.collection = this.collection || new LeaveRequests(options.collectionJSON || null);

      if (typeof moduleConfig.runtime['takeBankHoliday'] !== 'undefined') {
        this.takeBankHoliday = moduleConfig.runtime['takeBankHoliday'];
      } else {
        that.mStatus.fetch({
          success: function success() {
            var lastLogin = that.mStatus.toJSON().userStatus.split('Last success logon time')[1].split(/\r\n|\r|\n/g)[1];
            moduleConfig.runtime['lastLogin'] = lastLogin;

            moduleConfig.runtime['sess_cnt'] = sess_cnt;
            var pending_approval_cnt = that.mStatus.toJSON().userStatus.split('pending leave application approval count')[1].split(/\r\n|\r|\n/g)[1];
            moduleConfig.runtime['pending_approval_cnt'] = pending_approval_cnt;
            var sub = that.mStatus.toJSON().userStatus.split(/\r\n|\r|\n/g)[1];
            var takeBankHoliday = that.mStatus.toJSON().userStatus.split('can take leave on bank holiday')[1].split(/\r\n|\r|\n/g)[1] === 'yes' ? true : false;
            moduleConfig.runtime['takeBankHoliday'] = takeBankHoliday;
            that.takeBankHoliday = moduleConfig.runtime['takeBankHoliday'];
            var isMan = false;

            if (typeof sub !== 'undefined' && sub !== '') {
              isMan = true;
            }

            moduleConfig.runtime['isManager'] = isMan;
          },
          error: function error() {
          }
        });
      }

      this.isSendingLeaveRequest = false;
      this.setupEventListeners();
      this.prepareDataAndRender();
      this.listenTo(this.leaveRequestCollectionSender, 'request', this.reqProgress);
      this.render(50);
    },
    events: {
      'swipe [datepicker]': 'onSwipe',
      'draw [datepicker]': 'drawAdditionalDetail',
      'mousedown [datepicker] td.day': 'toggleShowDateDetail',
      'click [rbtn_type]': 'changeLeaveType',
      'click #detail [btn_tab]': 'showTab',
      'click [btn_apply_leave]': 'preSendLeaveRepuest',
      'click [btn_deselect_all_leave]': 'clearLeaveRepuest',
      // 'request': 'reqProgress'
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
    setupEventListeners: function setupEventListeners() {
      var that = this;
      this.leaveApplicationVent.on('select_am', function (event) {
        var model = event.model;
        model.set('_applicationActionAM', that.applicationActionType.DESELECT);
        model.set('type', that.$('[name=type]:checked').val());
        that.leaveRequestCollection.add(model);
        that.$('[datepicker] .extraRow').remove();
        that.isShowDateDetail = false;
        that.renderSelectedList();
        that.drawLeaveRequest();
      });
      this.leaveApplicationVent.on('deselect_am', function (event) {
        var model = event.model;

        var tmpLeaveRequest = that.leaveRequestCollection.findWhere({
          'dateValue': model.get('dateValue')
        });
        tmpLeaveRequest.set({
          "_applicationActionAM": that.applicationActionType.SELECT
        });
        if (tmpLeaveRequest.get("_applicationActionAM") === that.applicationActionType.SELECT && (tmpLeaveRequest.get("_applicationActionPM") === that.applicationActionType.SELECT || tmpLeaveRequest.get("_applicationActionPM") === that.applicationActionType.APPLIED)) that.leaveRequestCollection.remove(tmpLeaveRequest);
        that.$('[datepicker] .extraRow').remove();
        that.isShowDateDetail = false;
        that.renderSelectedList();
        that.drawLeaveRequest();
      });
      this.leaveApplicationVent.on('select_pm', function (event) {
        var model = event.model;
        model.set('_applicationActionPM', that.applicationActionType.DESELECT);
        model.set('type', that.$('[name=type]:checked').val());
        that.leaveRequestCollection.add(model);
        that.$('[datepicker] .extraRow').remove();
        that.isShowDateDetail = false;
        that.renderSelectedList();
        that.drawLeaveRequest();
      });
      this.leaveApplicationVent.on('deselect_pm', function (event) {
        var model = event.model;
        var tmpLeaveRequest = that.leaveRequestCollection.findWhere({
          'dateValue': model.get('dateValue')
        });

        tmpLeaveRequest.set({
          "_applicationActionPM": that.applicationActionType.SELECT
        });
        if ((tmpLeaveRequest.get("_applicationActionAM") === that.applicationActionType.SELECT || tmpLeaveRequest.get("_applicationActionAM") === that.applicationActionType.APPLIED) && tmpLeaveRequest.get("_applicationActionPM") === that.applicationActionType.SELECT) that.leaveRequestCollection.remove(tmpLeaveRequest); //try to find am is empty as well

        that.$('[datepicker] .extraRow').remove();
        that.isShowDateDetail = false;
        that.renderSelectedList();
        that.drawLeaveRequest();
      });
      this.leaveApplicationVent.on('togglePeriod', function (event) {
        var model = event.model;
        var _startedLongLeaveObj = that.startedLongLeave;

        var dateObj = new Date(model.get('dateValue')); //get start day, recursively click all and reset start

        if (_startedLongLeaveObj && _startedLongLeaveObj !== dateObj) {
          //<
          if (_startedLongLeaveObj > dateObj) {
            var tmp = _startedLongLeaveObj;
            _startedLongLeaveObj = dateObj;
            dateObj = tmp;
          }

          var allDays = [];
          var tarDate = $("td[date=" + dateObj.getTime() + "]");

          for (var d = _startedLongLeaveObj; d <= dateObj; d.setDate(d.getDate() + 1)) {
            var foundHoliday = that.publicHolidayCollection.findWhere({
              'dateValue': d.getTime()
            });
            if (foundHoliday && !that.takeBankHoliday) continue;
            if ((d.getDay() === 0 || d.getDay() === 6) && !that.takeBankHoliday) continue;
            var foundHisAM = that.leaveHistoryCollection.findWhere({
              'dateValue': d.getTime(),
              'session': 'am'
            });
            var foundHisPM = that.leaveHistoryCollection.findWhere({
              'dateValue': d.getTime(),
              'session': 'pm'
            });
            var tmday = d.getDate(),
              tmmonth = d.getMonth() + 1,
              tmyear = d.getFullYear();
            var tmdateStr = (tmmonth < 10 ? '0' + tmmonth : tmmonth) + '/' + (tmday < 10 ? '0' + tmday : tmday) + '/' + tmyear;
            var bardateTmpStr = that.leaveRequestCollection.findWhere({
              'date': tmdateStr
            });

            if (!foundHisAM && !foundHisPM) {
              if (!bardateTmpStr) {
                //add
                var modelx = new LeaveRequest({
                  date: tmdateStr,
                  _applicationActionAM: that.applicationActionType.DESELECT,
                  _applicationActionPM: that.applicationActionType.DESELECT,
                  type: that.$('[name=type]:checked').val()
                });
                that.leaveRequestCollection.add(modelx);
              } else {
                bardateTmpStr.set('_applicationActionAM', that.applicationActionType.DESELECT);
                bardateTmpStr.set('_applicationActionPM', that.applicationActionType.DESELECT);
                that.leaveRequestCollection.set(bardateTmpStr, {
                  remove: false
                });
              }
            } else if (foundHisAM && !foundHisPM) {
              //AM in his
              if (!bardateTmpStr) {
                //add
                var modelx = new LeaveRequest({
                  date: tmdateStr,
                  _applicationTypeAM: foundHisAM.get('type'),
                  _applicationActionPM: that.applicationActionType.DESELECT,
                  _applicationActionAM: that.applicationActionType.APPLIED,
                  type: that.$('[name=type]:checked').val()
                });
                that.leaveRequestCollection.add(modelx);
              } else {
                bardateTmpStr.set('_applicationActionPM', that.applicationActionType.DESELECT);
                that.leaveRequestCollection.set(bardateTmpStr, {
                  remove: false
                });
              }
            } else if (!foundHisAM && foundHisPM) {
              //AM in his
              if (!bardateTmpStr) {
                //add
                var modelx = new LeaveRequest({
                  date: tmdateStr,
                  _applicationTypePM: foundHisPM.get('type'),
                  _applicationActionPM: that.applicationActionType.APPLIED,
                  _applicationActionAM: that.applicationActionType.DESELECT,
                  type: that.$('[name=type]:checked').val()
                });
                that.leaveRequestCollection.add(modelx);
              } else {
                bardateTmpStr.set('_applicationActionAM', that.applicationActionType.DESELECT);
                that.leaveRequestCollection.set(bardateTmpStr, {
                  remove: false
                });
              }
            } //allDays.push(new Date(d));

          }

          that.startedLongLeave = false;
        } else if (_startedLongLeaveObj === dateObj) {//same day
        } else {
          that.startedLongLeave = dateObj;
        }

        that.$('[datepicker] .extraRow').remove();
        that.isShowDateDetail = false;
        that.renderSelectedList();
        that.drawDayDetail(null, {
          date: that.$('[datepicker] td.day.btn-primary').attr('date')
        });
        that.drawLeaveRequest();
      });
    },
    render: function render(progress) {
      this.$el.html(_.template(this.currentTmpl)({
        collection: this.publicHolidayCollection.toJSON(),
        progress: progress
      })); // new Hammer(this.$el);

      if (progress == null || progress == 100) {
        this.$('[datepicker]').datepicker();
        this.$('[datepicker]').hammer();

        this.renderSelectedList();

        this.$('#alb').append(this.leaveBalance.get('annualLeaveBalance'));
        this.$('#ale').append(this.leaveBalance.get('annualLeaveEntitlementCurrentYear'));
        this.$('#days_count').text("0");
      }
    },
    renderSelectedList: function renderSelectedList() {
      var that = this;
      this.$('[selected_list]').html('');
      this.leaveRequestCollection.each(function (leaveRequestModel) {
        var tmpDialogView = new LeaveApplicationDialogView({
          model: leaveRequestModel,
          vent: that.leaveApplicationVent,
          isSelectedList: true
        }).$el;
        $(tmpDialogView[0]).find(".remove_on_selected").remove();
        that.$('[selected_list]').append(tmpDialogView);
      });

      that.$('#days_count').text(that.countSelectedDay());
    },
    prepareDataAndRender: function prepareDataAndRender() {
      var that = this;
      this.isShowDateDetail = false;
      this.publicHolidayCollection.fetch({
        reset: true,
        success: function success() {
        },
        error: function error() {
          that.collection.reset();
          that.render(100);
        }
      });
      this.leaveHistory.fetch({
        success: function success() {
          that.leaveHistoryCollection.setByLeaveHistory(that.leaveHistory, ['rejected']);
          that.drawLeaveHistory();
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

          that.leaveHistoryCollection.reset();
          that.drawLeaveHistory();
        }
      });
      that.teamLeaveSchedule.fetch({
        success: function success() {
          that.teamLeaveSchedule.aftermath();
          that.drawTeamLeaveHistory();
        },
        error: function error() {
          that.teamLeaveSchedule.reset();
          that.drawTeamLeaveHistory();
        }
      });
      this.leaveBalance.fetch({
        success: function success() {
          that.render(100);
          that.$('.type_r .btn').first().click();
        },
        error: function error() {
        }
      });
    },
    toggleShowDateDetail: function toggleShowDateDetail(event) {
      var $element = $(event.srcElement || event.target).closest('.day');
      if (!$element.hasClass('btn-primary')) this.isShowDateDetail = true; else this.isShowDateDetail = !this.isShowDateDetail;
    },
    changeLeaveType: function changeLeaveType(event) {
      var that = this;
      this.$('#detail').show();

      _.defer(function () {
        var leaveType = that.$('[name=type]:checked').val();
        that.leaveRequestCollection.each(function (leaveRequest) {
          leaveRequest.set('type', leaveType);
        });
        that.renderSelectedList();
        that.drawDayDetail(null, {
          date: that.$('[datepicker] td.day.btn-primary').attr('date')
        });

        if (leaveType == 'other') {
          that.$('#remarkContainer').show();
        } else {
          that.$('#remarkContainer').hide();
        }
      });
    },
    countSelectedDay: function countSelectedDay() {
      var that = this;
      var cnt = 0;
      that.leaveRequestCollection.each(function (leaveRequest) {
        if (leaveRequest.get('_applicationActionAM') === that.applicationActionType.DESELECT) cnt += 0.5;
        if (leaveRequest.get('_applicationActionPM') === that.applicationActionType.DESELECT) cnt += 0.5;
      });
      return cnt;
    },
    showTab: function showTab(event) {
      var $element = $(event.srcElement || event.target).closest('[btn_tab]'),
        $tabContainer = $element.closest('.nav'),
        tabSelector = $element.attr('btn_tab');

      if (tabSelector == '[selected_list]') {
        this.$('[btn_apply_leave]').html("Apply");
      } else {
        this.$('[btn_apply_leave]').html("Proceed");
      }

      $tabContainer.find('[btn_tab]').not($element).removeClass('active');
      $element.addClass('active');
      this.$('[tab_content]').children().hide();
      this.$('[tab_content] ' + tabSelector).fadeIn(300);
    },
    preSendLeaveRepuest: function preSendLeaveRepuest(event) {
      var that = this;

      if (this.$('#detail .active').attr('btn_tab') !== '[selected_list]') {
        this.$("#detail li[btn_tab='[selected_list]']").click();
        return;
      }

      var hasBefore = false;
      this.leaveRequestCollection.each(function (leaveRequestModel) {
        if (new Date(leaveRequestModel.get('dateValue')) < new Date()) {
          hasBefore = true;
        }
      });

      if (hasBefore) {
        $.confirm({
          title: 'Apply backdate leave',
          content: 'You are attempting to apply backdate leave, do you want to continue?',
          type: 'red',
          animation: 'none',
          buttons: {
            Yes: {
              btnClass: 'btn-red',
              action: function action() {
                that.sendLeaveRepuest(event);
              }
            },
            No: function No() {// $.alert('Canceled!');
            }
          }
        });
      } else {
        that.sendLeaveRepuest(event);
      }
    },
    reqProgress: function (e) {
      var that = this;
      that.$('#detail').fadeOut(300, function () {
        that.$('.loader').fadeIn(300);
      })
    },
    sendLeaveRepuest: function sendLeaveRepuest(event) {
      var that = this;

      if (this.$('#detail .active').attr('btn_tab') !== '[selected_list]') {
        this.$("#detail li[btn_tab='[selected_list]']").click();
        return;
      }

      if (this.isSendingLeaveRequest) return;

      if (this.leaveRequestCollection.length == 0) {
        Backbone.trigger('global:info', {
          msg: 'There is no chosen date.'
        });
        return;
      }

      var leaveType = this.$('[name=type]:checked').val(),
        leaveRemark = '';

      if (leaveType == 'other') {
        leaveRemark = this.$('#remark').val();

        if (leaveRemark == '') {
          Backbone.trigger('global:warning', {
            msg: 'A remark must be filled in if "other" has been chosen.'
          });
          return;
        }
      }

      this.leaveRequestCollectionSender.reset(); //  dispatch to single

      this.leaveRequestCollection.each(function (leaveRequestModel) {
        if (leaveRequestModel.get('_applicationActionAM') === that.applicationActionType.DESELECT) {
          leaveRequestModel.set('session', 'am');
          that.leaveRequestCollectionSender.add(leaveRequestModel.clone());
        }

        if (leaveRequestModel.get('_applicationActionPM') === that.applicationActionType.DESELECT) {
          leaveRequestModel.set('session', 'pm');
          that.leaveRequestCollectionSender.add(leaveRequestModel.clone());
        }
      });
      this.isSendingLeaveRequest = true;
      this.leaveRequestCollectionSender.save({
        extraData: {
          zgleaveRemark: this.$('#remark').val()
        },
        success: function success() {
          that.isSendingLeaveRequest = false;
          that.$('.loader').addClass('fadeOut');
          that.$('#detail').removeClass('fadeOut');

          that.$('.loader').fadeOut(300, function () {
            that.prepareDataAndRender();
            $.alert({
              animation: 'none',
              title: 'Success!',
              content: 'Your application is successfully submitted.'
            });
            Backbone.trigger('global:success', {
              msg: 'Your application is successfully submitted.'
            });
            that.leaveRequestCollection.reset();
          })

        },
        error: function error(response) {
          that.isSendingLeaveRequest = false;
          Backbone.trigger('global:danger', {
            msg: 'Your application is not submitted. Please try again later.'
          });
        }
      });
    },
    clearLeaveRepuest: function clearLeaveRepuest(event) {
      if ($('.selected').length == 0) {
        window.location = window.location.pathname + '#';
      }
      this.leaveRequestCollection.reset();
      this.renderSelectedList();
      this.isShowDateDetail = false;
      this.$('[datepicker] .extraRow').remove();
      this.drawLeaveRequest();
      this.$('#days_count').text("0");
    },

    /*  draw extra information to the calendar  */
    drawAdditionalDetail: function drawAdditionalDetail(event, data) {
      this.drawHoliday(event, data);
      this.drawLeaveRequest(event, data);
      this.drawLeaveHistory(event, data);
      this.drawTeamLeaveHistory(event, data);
      this.drawDayDetail(event, data);
    },
    drawHoliday: function drawHoliday(event, data) {
      var that = this;
      var dateValue = data.date;
      that.publicHolidayCollection.each(function (holidayModel) {
        var holidayDateValue = holidayModel.get('dateValue');
        that.$('[datepicker] [date=' + holidayDateValue + '].day').attr('public_holiday', holidayModel.get('id'));
      }); //add sat and sun

      that.$('[datepicker] tbody tr').each(function () {
        var $td = $(this).children('td.day');
        $td.first().addClass('holiday');
        $td.last().addClass('holiday');
      });
    },
    drawLeaveRequest: function drawLeaveRequest() {
      var that = this;
      that.$('[datepicker] .day.selected').removeClass('selected');
      that.leaveRequestCollection.each(function (leaveRequestModel) {
        var leaveRequestDateValue = leaveRequestModel.get('dateValue');
        that.$('[datepicker] [date=' + leaveRequestDateValue + '].day').addClass('selected');
      });
    },
    drawTeamLeaveHistory: function drawTeamLeaveHistory() {
      //
      var that = this;
      var mymillis = that.teamLeaveSchedule.get('dateValue');
      var myNames = that.teamLeaveSchedule.get('teamMemberName');
      var myColor = that.teamLeaveSchedule.get('colorVal');
      var uniqColors = that.teamLeaveSchedule.get('uniqColorVal');

      var arrx = $.map(uniqColors, function (value, key) {
        return {
          username: key,
          color: value
        };
      }); // arrx.sort(function(a,b) {return a.username>b.username});

      arrx.sort(function (a, b) {
        return a.username.localeCompare(b.username);
      });

      that.$('.color_ind_filler').empty();

      _.each(arrx, function (value, key) {
        var colval = value.color;
        var user = value.username;
        var ccontainer = that.$('.color_ind_filler');

        ccontainer.append($('<div>').addClass('col-sm-6').append($('<a>').css("background-color", "rgba(" + colval + ",1)").css('margin-top', '5px').addClass('pull-left event asd')).append(user));
      });

      _.each(mymillis, function (val, key) {

        if (dateEventList.find('a[myName="' + myNames[key] + '"]').length === 0) {
          dateEventList.append( // classic square
            $('<a>').css("background-color", "rgba(" + myColor[key] + ",1)").addClass('pull-left event ').attr('myName', myNames[key])
          );
        }
      });
    },
    drawLeaveHistory: function drawLeaveHistory() {
      var that = this;
      that.$('[datepicker] .day.applied').removeClass('applied');
      that.leaveHistoryCollection.each(function (leaveRequestModel) {
        var leaveRequestDateValue = leaveRequestModel.get('dateValue');
        that.$('[datepicker] [date=' + leaveRequestDateValue + '].day').addClass('applied');
      });
    },
    drawDayDetail: function drawDayDetail(event, data) {
      if (!this.isShowDateDetail) return;
      $(".extraRow").remove();
      var dateObj = new Date(parseInt(data.date, 10)),
        day = dateObj.getDate(),
        month = dateObj.getMonth() + 1,
        year = dateObj.getFullYear();
      dateObj = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 0, 0, 0, 0);
      var $optionRow = $('<tr>');
      var $batchSelectionRow = $('<tr>'); //$pmRow = $('<tr>');

      var dateStr = (month < 10 ? '0' + month : month) + '/' + (day < 10 ? '0' + day : day) + '/' + year;
      var dateStr2 = (day < 10 ? '0' + day : day) + '/' + (month < 10 ? '0' + month : month) + '/' + year;
      var $element = this.$('[datepicker] [date=' + dateObj.valueOf() + '].day'),
        $tr = $element.closest('tr'),
        that = this;
      $tr.after($optionRow);
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
          nameSpaceArr[that.teamLeaveSchedule.get('teamMemberName')[val]].am = '';
          nameSpaceArr[that.teamLeaveSchedule.get('teamMemberName')[val]].pm = '';
          nameSpaceArr[that.teamLeaveSchedule.get('teamMemberName')[val]].key = '';
        }

        var ns = nameSpaceArr[that.teamLeaveSchedule.get('teamMemberName')[val]];
        ns.key = val;
        var session = that.teamLeaveSchedule.get('session')[val];
        ns[session] = that.teamLeaveSchedule.get('leaveType')[val];
      });

      var tmpStr = [];

      _.each(nameSpaceArr, function (val, usrname) {
        var sessionTypeStr = '';

        if (val.am == val.pm && val.am != '') {
          sessionTypeStr += 'Full day';

          if (val.am != 'annual') {
            sessionTypeStr += ' (' + val.am + ')';
          }
        } else {
          if (val.am != '') {
            sessionTypeStr += 'am';

            if (val.am != 'annual') {
              sessionTypeStr += ' (' + val.am + ')';
            }
          }

          if (val.am != '' && val.pm != '') {
            sessionTypeStr += ', ';
          }

          if (val.pm != '') {
            sessionTypeStr += 'pm';

            if (val.pm != 'annual') {
              sessionTypeStr += ' (' + val.pm + ')';
            }
          }
        }

        tmpStr.push('<div style="display:inline-block;"><a class="event" style="display:inline-block;background-color:rgba(' + that.teamLeaveSchedule.get("colorVal")[val.key] + ',1)"></a>&nbsp;' + usrname + ': ' + sessionTypeStr + '</div>');
      });

      var holyStr = '';
      holyStr = tmpStr.join(', ');

      if (holyStr !== '') {
        var $funnyrow = $('<tr>');
        $funnyrow.html('').addClass('extraRow').css('background-color', 'azure').append($('<td>').attr('colspan', $tr.find('td').length).append($('<div>').addClass('leaveApplicationDialogView fadeIn').append($('<div>').addClass('col-xs-12').append($('<div>').html(holyStr)))));
        $optionRow.before($funnyrow);
      }

      if (!$element.hasClass('holiday') && $element.attr('public_holiday') == null || that.takeBankHoliday) {
        _.defer(function () {
          var leaveRequest = that.leaveRequestCollection.findWhere({
            'date': dateStr
          });

          if (!leaveRequest) {
            var tmpLeaveHisAM = that.leaveHistoryCollection.findWhere({
              'date': dateStr,
              'session': 'am'
            });
            var tmpLeaveHisPM = that.leaveHistoryCollection.findWhere({
              'date': dateStr,
              'session': 'pm'
            });

            if (tmpLeaveHisAM || tmpLeaveHisPM) {
              leaveRequest = tmpLeaveHisAM || tmpLeaveHisPM;

              if (tmpLeaveHisAM) {
                var tmp = tmpLeaveHisAM.toJSON();
                leaveRequest.set("_applicationActionAM", that.applicationActionType.APPLIED);
                leaveRequest.set("approvalActionAM", tmp.approvalAction);
                leaveRequest.set("_applicationTypeAM", tmp.type);
              } else {
                leaveRequest.set("_applicationActionAM", that.applicationActionType.SELECT);
              }

              if (tmpLeaveHisPM) {
                var tmp = tmpLeaveHisPM.toJSON();
                leaveRequest.set("_applicationActionPM", that.applicationActionType.APPLIED);
                leaveRequest.set("approvalActionPM", tmp.approvalAction);
                leaveRequest.set("_applicationTypePM", tmp.type);
              } else {
                leaveRequest.set("_applicationActionPM", that.applicationActionType.SELECT);
              }
            }
          }


          $optionRow.addClass('extraRow').append($('<td>').attr('colspan', $tr.find('td').length).append(new LeaveApplicationDialogView({
            model: leaveRequest,
            modelJSON: {
              date: dateStr,
              type: that.$('[name=type]:checked').val()
            },
            startedLongLeave: that.startedLongLeave,
            vent: that.leaveApplicationVent
          }).$el));
        });
      }

      if ($element.attr('public_holiday') != null) {

        _.defer(function () {
          var $newRow = $('<tr>'),
            holidayModel = that.publicHolidayCollection.get($element.attr('public_holiday'));
          $newRow.addClass('extraRow').append($('<td>').attr('colspan', $tr.find('td').length).text(holidayModel.get('holiday')));

          $tr.after($newRow);
          $(document).scrollTop(that.$('.extraRow').first().offset().top);
        });
      }
    }
    /*  /draw extra information to the calendar  */

  });
  return LeaveApplicatoinView;
});