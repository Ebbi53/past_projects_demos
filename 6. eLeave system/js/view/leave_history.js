"use strict"; // Leave balance

define(['jquery', 'underscore', 'backbone', 'jqconfirm', 'text!template/leave_history.html', 'model/leave_history', 'model/leave_cancel', 'dataTables', 'dataTables_fixedHeader', 'dataTables_rowGroup', 'dataTables_responsive'], function ($, _, Backbone, jqconfirm, tmpl, LeaveHistory, LeaveCancel, dataTable, dataTables_fixedHeader, dataTables_rowGroup, dataTables_responsive) {
  var LeaveHistoryView = Backbone.View.extend({
    tagName: 'div',
    className: 'leaveHistoryView container fadeIn',
    currentTmpl: tmpl,
    table: {},
    initialize: function initialize(options) {
      this.vent = options.vent || _.extend({}, Backbone.Events);
      this.model = this.model || new LeaveHistory(options.modelJSON || {});
      this.setupEventListeners();
      var that = this;
      this.model.fetch({
        success: function success() {
          that.render(100);
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
        }
      });
      this.render(50);
    },
    events: {
      'click .btn_cancel_leave': 'cancelLeaveClick',
      'click .control:not([class*= sorting])': 'showChildRow',
      'click .reorderCol': 'redrawTable'
    },
    redrawTable: function redrawTable(e) {
      $('#leaveHistory').DataTable().destroy();
      this.drawDataTable(true);
    },
    showChildRow: function showChildRow(e) {
      if ($(e.target.parentElement).hasClass('activated')) {
        $(e.target.parentElement).removeClass('activated');
        $(e.target.parentElement).children().not('.tooltip').css('opacity', 0.3);

        if (!$('tr').hasClass('activated')) {
          $('tr').children().css('opacity', 1);
          $('#leaveHistory').addClass('display');
        }

        $(e.target).attr('data-original-title', 'Show more');

        if ($(window).width() > 1024) {
          $(e.target).tooltip('hide');
          $(e.target).tooltip('toggle');
        }
      } else {
        $(e.target.parentElement).addClass('activated');
        $('tr').not('.activated, .child, .dtrg-group, thead tr').children().css('opacity', 0.3);
        $('#leaveHistory').hasClass('display') ? $('#leaveHistory').removeClass('display') : '';
        $(e.target.parentElement).children().css('opacity', 1);
        $(e.target).attr('data-original-title', 'Hide extra info');

        if ($(window).width() > 1024) {
          $(e.target).tooltip('hide');
          $(e.target).tooltip('toggle');
        }
      }
    },
    setupView: function setupView() { },
    setupEventListeners: function setupEventListeners() {
      var that = this;
    },
    drawDataTable: function drawDataTable(redraw) {
      var temp = $('#leaveHistory').DataTable({
        "order": [],
        "columnDefs": [// { "orderable": false, "targets": 0 },
          {
            "targets": [5],
            "visible": false
          }, {
            className: 'control',
            orderable: false,
            targets: 0
          }, {
            className: 'min-tablet-l',
            targets: 4
          }],
        'paging': false,
        'info': false,
        fixedHeader: {
          header: true,
          headerOffset: $('.navbar').height()
        },
        rowGroup: {
          dataSrc: 5
        },
        // responsive: true,
        responsive: {
          details: {
            type: 'column' // target: 'tr'

          }
        }
      });
      $('#leaveHistory_wrapper').prepend("<button class=\"btn btn-default btn-sm reorderCol\">Reset ordering</button>");

      var isIE = /*@cc_on!@*/false || !!document.documentMode;
      if (isIE) {
        $('table.dtr-column.dataTable > tbody > tr > td.control, table.dtr-column.dataTable > tbody > tr > th.control').addClass('isIE');
      };

      $('[class*= sorting]').on('click', function (event) {
        $(window).trigger('scroll');
      });

      if (!redraw) {
        $('.control').not('[class*= sorting]').attr({
          'data-toggle': "tooltip",
          'data-original-title': "Show more"
        });
        $('[data-toggle="tooltip"]').tooltip({
          container: '#leaveHistory'
        });
      }

      if ($(window).width() < 1024) {
        $('[data-toggle="tooltip"]').tooltip('disable');
      }

      ;
      return temp;
    },
    render: function render(progress, that) {
      this.$el.html(_.template(this.currentTmpl)(_.extend(this.model.toJSON(), {
        progress: progress
      })));

      if (progress == 100) {
        this.table = this.drawDataTable();
        var rowsEffected = 0;
        $(window).on('scroll', function () {
          var headerHeight = $('[class*= fixedHeader-] tr').height() ? $('[class*= fixedHeader-] tr').height() : $('tr').height(),
            wScroll = $(this).scrollTop() + $('.navbar').height() + headerHeight, rowOffset = [];
          var rows = $('.dtrg-group');
          for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if ($(row).offset().top < wScroll) {
              rowOffset.push(wScroll - $(row).offset().top);
            } else {
              break;
            }
          }
          if (rowOffset.length < rowsEffected) {
            for (var i = 0; i < rowsEffected - rowOffset.length; i++) {
              $($('.dtrg-group')[rowOffset.length + i].children).css('top', 0);
            }
          }
          if (rowOffset.length > rowsEffected) {
            for (var i = 0; i < rowsEffected; i++) {
              $($('.dtrg-group')[i].children).css('top', 0);
            }
          }
          if (rowOffset.length) {
            $($('.dtrg-group')[rowOffset.length - 1].children).css('top', rowOffset[rowOffset.length - 1]);
          }
          rowsEffected = rowOffset.length;
        });
      }
    },
    cancelLeaveClick: function cancelLeaveClick(event) {
      var $element = $(event.srcElement || event.target).closest('.btn_cancel_leave'),
        option = $element.attr('option'),
        that = this;

      if (option === 'whole') {
        $.confirm({
          title: 'Cancel leave',
          content: 'This action takes immediate effect and cannot be undone. Do you want to proceed?',
          type: 'red',
          animation: 'none',
          buttons: {
            whole: {
              btnClass: 'btn-red',
              text: 'Full day',
              action: function action() {
                var id_am = $element.attr('am_id');
                var id_pm = $element.attr('pm_id');
                var deferreds = [];
                deferreds.push(that.cancelLeave(id_am));
                deferreds.push(that.cancelLeave(id_pm));
                $.when.apply($, deferreds).done(function () {
                  // alert('Leave application has been canceled');
                  Backbone.trigger('global:success', {
                    msg: 'Leave application has been canceled'
                  });
                  $element.closest('tr').fadeOut(300).slideUp(300, function () {
                    $(that).remove();
                  });
                  that.model.removeRecordWithId(id_am);
                  that.model.removeRecordWithId(id_pm);
                  that.render.apply(that);
                });
              }
            },
            am: {
              btnClass: 'btn-red',
              text: 'AM only',
              action: function action() {
                $.when(that.cancelLeave($element.attr('am_id'))).done(function () {
                  Backbone.trigger('global:success', {
                    msg: 'Leave application has been canceled'
                  });
                });
                that.model.removeRecordWithId($element.attr('am_id'));
                that.render.apply(that);
              }
            },
            pm: {
              btnClass: 'btn-red',
              text: 'PM only',
              action: function action() {
                $.when(that.cancelLeave($element.attr('pm_id'))).done(function () {
                  Backbone.trigger('global:success', {
                    msg: 'Leave application has been canceled'
                  });
                });
                that.model.removeRecordWithId($element.attr('pm_id'));
                that.render.apply(that);
              }
            },
            close: {
              text: "Close"
            }
          }
        });
      } else {
        $.confirm({
          title: 'Cancel leave',
          content: 'This action takes immediate effect and cannot be undone. Do you want to proceed?',
          type: 'red',
          animation: 'none',
          buttons: {
            only: {
              btnClass: 'btn-red',
              text: 'Proceed',
              action: function action() {
                $.when(that.cancelLeave($element.attr('leave_id'))).done(function () {
                  Backbone.trigger('global:success', {
                    msg: 'Leave application has been canceled'
                  });
                  that.model.removeRecordWithId($element.attr('leave_id'));
                  that.render.apply(that);
                });
              }
            },
            close: function close() {// $.alert('Canceled!');
            }
          }
        });
      }
    },
    cancelLeave: function cancelLeave(id, that) {
      var leaveCancelModel = new LeaveCancel({
        id: id
      });
      var dfd = $.Deferred();
      leaveCancelModel.save(null, {
        success: function success() {
          dfd.resolve();
        },
        error: function error() {
          Backbone.trigger('global:error', {
            msg: 'Something went wrong. Please try again later.'
          });
        }
      });
    }
  });
  return LeaveHistoryView;
});