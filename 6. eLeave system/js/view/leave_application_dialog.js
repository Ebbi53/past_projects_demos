
// Leave balance
define(['jquery', 'underscore', 'backbone', 'text!template/whole_leave_application_dialog.html', 'text!template/whole_leave_application_dialog_for_selected.html', 'model/leave_request'], function ($, _, Backbone, tmpl, tmplSelected, LeaveRequest) {
  var LeaveApplicatoinDialogView = Backbone.View.extend({
    tagName: 'div',
    className: 'leaveApplicationDialogView fadeIn',
    currentTmpl: tmpl,

    applicationActionType: {
      SELECT: 'Select',
      DESELECT: 'Deselect',
      CANCEL: 'cancell',
      START: 'start',
      END: 'end',
      APPLIED: 'applied'
    },
    startedLongLeave: false,
    initialize: function initialize(options) {
      if (options.isSelectedList) {
        this.currentTmpl = tmplSelected;
      }

      this.modelJSON = options.modelJSON;
      this.vent = options.vent || _.extend({}, Backbone.Events);
      this.model = this.model || new LeaveRequest(options.modelJSON || {});
      if (!this.model.get('_applicationActionAM')) {
        this.model.set('_applicationActionAM', this.model.isNew() ? this.applicationActionType.SELECT : this.applicationActionType.CANCEL);
      }

      if (!this.model.get('_applicationActionPM')) {
        this.model.set('_applicationActionPM', this.model.isNew() ? this.applicationActionType.SELECT : this.applicationActionType.CANCEL);
      }

      this.startedLongLeave = options.startedLongLeave;
      this.setupEventListeners();
      this.render();
    },
    events: {
      'click [section="whole"]': 'changeStates',
      'click [section="AM"]': 'changeStateAM',
      'click [section="PM"]': 'changeStatePM',
      'click .applicationActionPeriod': 'togglePeriod'
    },
    setupEventListeners: function setupEventListeners() {
      var that = this;
      this.model.on('change:_applicationActionAM', function () {
        that.render.apply(that);
      });
      this.model.on('change:_applicationActionPM', function () {
        that.render.apply(that);
      });
    },
    render: function render() {
      this.$el.html(_.template(this.currentTmpl)(_.extend(this.model.toJSON(), {
        modelJSON: this.modelJSON
      }, {
        applicationActionType: this.applicationActionType,
        startedLongLeave: this.startedLongLeave
      })));
    },
    changeStates: function changeStates(event) {
      var $element = $(event.srcElement || event.target).closest('[btn_action]'),
        applicationAction = $element.attr('btn_action'); //since it will rerender on selected list, we cant simply mock click on consecutive btn

      switch (applicationAction) {
        case this.applicationActionType.CANCEL:
          break;

        case this.applicationActionType.DESELECT:
          this.model.set('_applicationActionAM', this.applicationActionType.SELECT);
          this.vent.trigger('deselect_am', {
            target: this,
            model: this.model
          });
          this.model.set('_applicationActionPM', this.applicationActionType.SELECT);
          this.vent.trigger('deselect_pm', {
            target: this,
            model: this.model
          });
          break;

        case this.applicationActionType.SELECT:
        default:
          this.model.set('_applicationActionAM', this.applicationActionType.DESELECT);
          this.vent.trigger('select_am', {
            target: this,
            model: this.model
          });
          this.model.set('_applicationActionPM', this.applicationActionType.DESELECT);
          this.vent.trigger('select_pm', {
            target: this,
            model: this.model
          });
      } 
    },
    changeStateAM: function changeStateAM(event) {
      var $element = $(event.srcElement || event.target).closest('[btn_action]'),
        applicationAction = $element.attr('btn_action');

      switch (applicationAction) {
        case this.applicationActionType.CANCEL:
          break;

        case this.applicationActionType.DESELECT:
          this.model.set('_applicationActionAM', this.applicationActionType.SELECT);
          this.vent.trigger('deselect_am', {
            target: this,
            model: this.model
          });
          break;

        case this.applicationActionType.SELECT:
        default:
          this.model.set('_applicationActionAM', this.applicationActionType.DESELECT);
          this.vent.trigger('select_am', {
            target: this,
            model: this.model
          });
      }
    },
    changeStatePM: function changeStatePM(event) {
      var $element = $(event.srcElement || event.target).closest('[btn_action]'),
        applicationAction = $element.attr('btn_action');

      switch (applicationAction) {
        case this.applicationActionType.CANCEL:
          break;

        case this.applicationActionType.DESELECT:
          this.model.set('_applicationActionPM', this.applicationActionType.SELECT);
          this.vent.trigger('deselect_pm', {
            target: this,
            model: this.model
          });
          break;

        case this.applicationActionType.SELECT:
        default:
          this.model.set('_applicationActionPM', this.applicationActionType.DESELECT);
          this.vent.trigger('select_pm', {
            target: this,
            model: this.model
          });
      }
    },
    togglePeriod: function togglePeriod(event) {
      this.vent.trigger('togglePeriod', {
        target: this,
        model: this.model
      });
    }
  });
  return LeaveApplicatoinDialogView;
});