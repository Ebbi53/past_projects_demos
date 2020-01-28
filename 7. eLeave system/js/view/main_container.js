
// Main container
define(['jquery', 'underscore', 'backbone', 'text!template/main_container.html', 'highcharts', 'model/leave_balance', 'model/leave_history', 'model/user_status', 'cookie', 'bootstrap', 'text!template/session_modal.html', 'moduleConfig', 'jqconfirm'], function ($, _, Backbone, tmpl, highcharts, balanceModel, historyModel, statusModel, Cookie, bootstrap, sessModal, moduleConfig, jqconfirm) {
  var View = Backbone.View.extend({
    tagName: 'div',
    className: 'mainContainerView container',
    currentTmpl: tmpl,
    sessModal: sessModal,
    initialize: function initialize(options) {
      var that = this;
      $('.toggleBtnCharter').removeClass('hidden');
      $('.toggleBtnCharter').click(function () {
        that.$('.togglerChart').toggleClass('hidden');
        that.$('.togglerMenu').toggleClass('hidden');
      });
      $('nav').on('click', '.navbar-brand', function () {
        that.$('.togglerChart').addClass('hidden');
        that.$('.togglerMenu').removeClass('hidden');
      });
      var opv = options;
      this.mStatus = this.mStatus || new statusModel(options.modelJSON || {});
      this.balance = this.balance || new balanceModel(options.modelJSON || {});
      this.history = this.history || new historyModel(options.modelJSON || {});

      if (typeof moduleConfig.runtime['takeBankHoliday'] === 'undefined') {
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

      this.balance.fetch({
        success: function success() {
          moduleConfig.runtime['passwordExpired'] = false;

          if (typeof moduleConfig.runtime.session.OTTAuthed !== 'undefined') {
            delete moduleConfig.runtime.session.OTTAuthed;
            $.cookie('runtime/session', JSON.stringify(moduleConfig.runtime.session));
          } //  that.model.set('OTTAuthed',false);


          that.history.fetch({
            success: function success() {
              that.render();

              try {
                if (!JSON.parse($.cookie('welcome_msg'))) {
                  Backbone.trigger("global:success", {
                    msg: 'Logged in as: ' + moduleConfig.runtime.session.user
                  });
                  $.cookie('welcome_msg', true);
                }
              } catch (e) { }
            },
            error: function error() {
            }
          });
        },
        error: function error(collection, response, options) {
          switch (response.error) {
            case 'session timeout':
              if (typeof moduleConfig.runtime.session.OTTAuthed !== 'undefined') {
                that.renderSessionModal();
                $("#sessionModal").modal('show');
              } else {
                Backbone.trigger("global:sessionTimeout");
                window.location = window.location.href + (window.location.href.indexOf('#') == -1 ? '#' : '') + '/login';

                _.defer(function () {
                  Backbone.trigger("global:danger", {
                    msg: 'Session timeout'
                  });
                });
              }

              break;

            case "password expired":
              moduleConfig.runtime['passwordExpired'] = true;
              $.alert({
                animation: 'none',
                title: 'Password expired!',
                content: "Please reset your password."
              });
              window.location = window.location.pathname + '#user';
              break;
          }
        }
      });
      this.vent = options.vent || _.extend({}, Backbone.Events);
      this.setupEventListeners();
    },
    setupView: function setupView() { },
    setupEventListeners: function setupEventListeners() {
      var that = this;
      this.$el.on('mousemove touchstart touchmove', function (event) {
        var positionObj = _.first(event.originalEvent.touches) || event;
        window.mousePageX = positionObj.pageX;
        window.mousePageY = positionObj.pageY;
      });
    },
    clickChart: function clickChart() {
      $.cookie('watched', true, {
        expires: 90
      });
      this.$('.togglerChart').addClass('hidden');
      this.$('.togglerMenu').removeClass('hidden');
    },
    events: {
      'click .togglerChart': 'clickChart',
      'click .back_to_login': 'backToLogin'
    },
    backToLogin: function backToLogin(e) {
      window.location = window.location.pathname + '#login';
      location.reload();
    },
    renderSessionModal: function renderSessionModal() {
      this.$el.html(_.template(this.sessModal));
    },
    render: function render() {
      var tempArr = [];
      tempArr = [{
        name: 'Leave',
        colorByPoint: true,
        data: [{
          name: 'Annual leave balance: ' + this.balance.get('annualLeaveBalance'),
          y: +this.balance.get('annualLeaveBalance'),
          sliced: true,
          selected: true
        }, {
          name: 'Annual leave taken: ' + this.balance.get('annualLeaveTakenYTD'),
          y: +this.balance.get('annualLeaveTakenYTD')
        }, {
          name: 'No pay leave taken: ' + this.balance.get('noPayLeaveTakenYTD'),
          y: +this.balance.get('noPayLeaveTakenYTD')
        }, {
          name: 'Sick leave taken: ' + this.balance.get('sickLeaveTakenYTD'),
          y: +this.balance.get('sickLeaveTakenYTD')
        }, {
          name: 'Other leave taken: ' + this.balance.get('otherLeaveTakenYTD'),
          y: +this.balance.get('otherLeaveTakenYTD')
        }]
      }];
      var isMan = moduleConfig.runtime.isManager;
      this.$el.html(_.template(this.currentTmpl)(_.extend(this.history.toJSON(), {
        isManager: isMan
      }, {
        runtime: moduleConfig.runtime
      })));
      this.$el.find('#highcharter').highcharts({
        tooltip: {
          enabled: false
        },
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: 'Leave balance'
        },
        credits: {
          enabled: false
        },

        plotOptions: {
          pie: {
            allowPointSelect: false,
            dataLabels: {
              enabled: false
            },
            showInLegend: true,
            point: {
              events: {
                legendItemClick: function legendItemClick(e) {
                  e.preventDefault();
                  return false;
                }
              }
            }
          },
          allowPointSelect: false,
          series: {
            states: {
              hover: {
                enabled: false
              }
            }
          }
        },
        series: tempArr,
        colors: ['#7cb5ec', '#f7a35c', '#90ee7e', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
        legend: {
          itemStyle: {
            fontWeight: 'bold',
            fontSize: '13px'
          }
        },
        xAxis: {
          gridLineWidth: 1,
          labels: {
            style: {
              fontSize: '12px'
            }
          }
        },
        yAxis: {
          minorTickInterval: 'auto',
          title: {
            style: {
              textTransform: 'uppercase'
            }
          },
          labels: {
            style: {
              fontSize: '12px'
            }
          }
        }
      });

      if ($.cookie('watched')) {
        this.clickChart();
      }
    }
  });
  return View;
});