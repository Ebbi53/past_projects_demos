"use strict"; // Leave balance

define(['jquery', 'underscore', 'backbone', 'text!template/team_leave_history.html', 'model/team_leave_history', 'dataTables', 'dataTables_fixedHeader', 'dataTables_rowGroup', 'dataTables_responsive'], function ($, _, Backbone, tmpl, LeaveHistory, dataTable, dataTables_fixedHeader, dataTables_rowGroup, dataTables_responsive) {
  var LeaveHistoryView = Backbone.View.extend({
    tagName: 'div',
    className: 'leaveHistoryView fadeIn',
    table: {},
    currentTmpl: tmpl,
    initialize: function initialize(options) {
      this.vent = options.vent || _.extend({}, Backbone.Events);
      this.model = this.model || new LeaveHistory(options.modelJSON || {});
      this.setupEventListeners();
      var that = this;
      this.model.fetch({
        success: function success() {
          that.model.aftermath();
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
      'click [btn_cancel_leave]': 'cancelLeave',
      'click .collapseTable': 'collapseTable',
      'mouseover .collapseTable': 'convertToButton',
      'mouseout .collapseTable': 'revertFromButton',
      'click .control:not([class*= sorting])': 'showChildRow',
      'click .reorderCol': 'redrawTable'
    },
    redrawTable: function redrawTable(e) {
      var id = '#' + e.target.classList[0];
      $(id).DataTable().destroy();
      this.drawDataTable(id, true); // this.table.draw()
    },
    showChildRow: function showChildRow(e) {
      if ($(e.target.parentElement).hasClass('activated')) {
        $(e.target.parentElement).removeClass('activated');
        $(e.target.parentElement).children().not('.tooltip').css('opacity', 0.3);

        if (!$('tr').hasClass('activated')) {
          $('tr').children().css('opacity', 1);
          $('#previousLeaves').addClass('display');
        }

        $(e.target).attr('data-original-title', 'Show more');

        if ($(window).width() > 1024) {
          $(e.target).tooltip('hide');
          $(e.target).tooltip('toggle');
        }
      } else {
        $(e.target.parentElement).addClass('activated');
        $('tr').not('.activated, .child, .dtrg-group, thead tr').children().css('opacity', 0.3);
        $('#previousLeaves').hasClass('display') ? $('#previousLeaves').removeClass('display') : '';
        $(e.target.parentElement).children().css('opacity', 1);
        $(e.target).attr('data-original-title', 'Hide extra info');

        if ($(window).width() > 1024) {
          $(e.target).tooltip('hide');
          $(e.target).tooltip('toggle');
        }
      }
    },
    revertFromButton: function revertFromButton(e) {
      $(".".concat(e.currentTarget.classList[0], " span")).css('display', 'none');
      $(".".concat(e.currentTarget.classList[0])).css('color', 'rgb(81, 81, 130)');
    },
    convertToButton: function convertToButton(e) {
      $(".".concat(e.currentTarget.classList[0], " span")).css('display', 'inline-block');
      $(".".concat(e.currentTarget.classList[0])).css('color', 'rgb(107, 107, 136)');
    },
    collapseTable: function collapseTable(e) {
      e.preventDefault();
      var table = document.getElementById("".concat(e.currentTarget.classList[0], "_wrapper")); // console.log(e.target)

      if (table.style.display === "block" || table.style.display === '') {
        $("#".concat(e.currentTarget.classList[0], "_wrapper")).fadeOut(300, function () {
          $(".".concat(e.currentTarget.classList[0], " h2")).css('margin-bottom', '30px');
        })
        $(".".concat(e.currentTarget.classList[0], " span")).removeClass('glyphicon-chevron-up');
        $(".".concat(e.currentTarget.classList[0], " span")).addClass('glyphicon-chevron-down');
        $(e.currentTarget).attr('data-original-title', 'Show this table');

        if ($(window).width() > 1024) {
          $(e.currentTarget).tooltip('hide');
          $(e.currentTarget).tooltip('toggle');
        }
      } else {
        this.table.responsive.recalc();
        $("#".concat(e.currentTarget.classList[0], "_wrapper")).fadeIn(300);
        $(".".concat(e.currentTarget.classList[0], " span")).removeClass('glyphicon-chevron-down');
        $(".".concat(e.currentTarget.classList[0], " span")).addClass('glyphicon-chevron-up');
        $(".".concat(e.currentTarget.classList[0], " h2")).css('margin-bottom', 0);
        $(e.currentTarget).attr('data-original-title', 'Hide this table');

        if ($(window).width() > 1024) {
          $(e.currentTarget).tooltip('hide');
          $(e.currentTarget).tooltip('toggle');
        }
      }
    },
    setupView: function setupView() { },
    setupEventListeners: function setupEventListeners() {
      var that = this;
    },
    drawDataTable: function drawDataTable(id, redraw) {
      var temp = $(id).DataTable({
        "order": [],
        colReorder: true,
        "columnDefs": [// { "orderable": false, "targets": 0 },
          {
            "orderSequence": ["asc", 'desc', []],
            "targets": [1]
          }, {
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
        },
        destroy: true
      });
      id.split(', ').forEach(function (element) {
        $("".concat(element, "_wrapper")).prepend("<button class=\"".concat(element.substring(1), " btn btn-default btn-sm reorderCol\">Reset ordering</button>"));
      }); 

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
          container: '.leaveHistoryView'
        });
      }

      if ($(window).width() < 1024) {
        $('[data-toggle="tooltip"]').tooltip('disable');
      }

      return temp;
    },
    render: function render(progress) {
      this.$el.html(_.template(this.currentTmpl)(_.extend(this.model.toJSON(), {
        progress: progress
      })));

      if (progress == 100) {
        this.table = this.drawDataTable('#upcomingLeaves, #previousLeaves');
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
    }
  });
  return LeaveHistoryView;
});