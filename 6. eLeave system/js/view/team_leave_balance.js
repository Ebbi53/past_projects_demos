"use strict"; // Leave balance

define(['jquery', 'underscore', 'backbone', 'text!template/team_leave_balance.html', 'model/user_status', 'moduleConfig', 'dataTables', 'dataTables_fixedHeader', 'dataTables_responsive'], function ($, _, Backbone, tmpl, TeamLeaveBalance, moduleConfig, dataTable, dataTables_fixedHeader, dataTables_responsive) {
  var TeamLeaveBalanceView = Backbone.View.extend({
    tagName: 'div',
    className: 'leaveHistoryView fadeIn',
    currentTmpl: tmpl,
    table: {},
    initialize: function initialize(options) {
      this.vent = options.vent || _.extend({}, Backbone.Events);
      this.model = this.model || new TeamLeaveBalance(options.modelJSON || {});
      this.setupEventListeners();
      var that = this;
      this.model.fetch({
        success: function success() {
          that.model.apiParser(that.model.toJSON().userStatus);
          that.render(100);
        },
        error: function error() {
          console.log(arguments);
          that.render();
        }
      });
      this.render(50);
    },
    events: {
      'click [btn_cancel_leave]': 'cancelLeave',
      'click .control:not([class*= sorting])': 'showChildRow',
      'click .reorderCol': 'redrawTable'
    },
    redrawTable: function redrawTable(e) {
      $('#teamBalance').DataTable().destroy();
      this.drawDataTable(true); // this.table.draw()
    },
    showChildRow: function showChildRow(e) {
      if ($(e.target.parentElement).hasClass('activated')) {
        $(e.target.parentElement).removeClass('activated');
        $(e.target.parentElement).children().not('.tooltip').css('opacity', 0.3);

        if (!$('tr').hasClass('activated')) {
          $('tr').children().css('opacity', 1);
          $('#teamBalance').addClass('display');
        }

        $(e.target).attr('data-original-title', 'Show more');

        if ($(window).width() > 1024) {
          $(e.target).tooltip('hide');
          $(e.target).tooltip('toggle');
        }
      } else {
        $(e.target.parentElement).addClass('activated');
        $('tr').not('.activated, .child table tr, .child, .dtrg-group, thead tr').children().css('opacity', 0.3);
        $('#teamBalance').hasClass('display') ? $('#teamBalance').removeClass('display') : '';

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
      var temp = $('#teamBalance').DataTable({
        "order": [],
        "columnDefs": [{
          className: 'control',
          orderable: false,
          targets: -1
        }, {
          className: 'none',
          targets: [5, 6, 7]
        }],
        'paging': false,
        'info': false,
        fixedHeader: {
          header: true,
          headerOffset: $('.navbar').height()
        },
        // responsive: true,
        responsive: {
          details: {
            type: 'column',
            target: -1,
            renderer: function renderer(api, rowIdx, columns) {
              var name = columns[0].data;
              columns = columns.filter(function (col) {
                return col.hidden;
              });

              var data = $.map(columns, function (col, index) {
                var temp2 = "<tr data-dt-row=\"".concat(col.rowIndex, "\"><th colspan=4>").concat(col.title, "</th><td data-dt-column=\"").concat(col.columnIndex, "\">").concat(col.data, "</td></tr>");
                return temp2;
              }).join('');

              return data ? "<table><tr><th colspan=4 rowspan=".concat(columns.length + 1, " style=\"border-right: 1px solid #ddd; padding-right: 20px; color: darkred;\">").concat(name, "</th>").concat(data, "</tr></table>") : false;
            }
          }
        }
      });
      $('#teamBalance_wrapper').prepend("<button class=\"btn btn-default btn-sm reorderCol\">Reset ordering</button>");

      var isIE = /*@cc_on!@*/false || !!document.documentMode;
      if (isIE) {
        console.log(isIE)
        $('table.dtr-column.dataTable > tbody > tr > td.control, table.dtr-column.dataTable > tbody > tr > th.control').addClass('isIE');
      };

      if (!redraw) {
        $('.control').not('[class*= sorting]').attr({
          'data-toggle': "tooltip",
          'data-original-title': "Show more"
        });
        $('[data-toggle="tooltip"]').tooltip({
          container: '#teamBalance'
        });
      }

      if ($(window).width() < 1024) {
        $('[data-toggle="tooltip"]').tooltip('disable');
      }

      return temp;
    },
    render: function render(progress) {
      this.$el.html(_.template(this.currentTmpl)(_.extend(this.model.toJSON().teamLeaveBalance, {
        progress: progress
      }, {
        runtime: moduleConfig.runtime
      })));

      if (progress == 100) {
        this.table = this.drawDataTable();
      }
    }

  });
  return TeamLeaveBalanceView;
});