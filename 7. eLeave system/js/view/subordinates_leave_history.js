
// Leave balance
define(['jquery', 'underscore', 'backbone', 'text!template/subordinates_leave_history.html', 'collection/subordinates_leave_history', 'model/leave_cancel'], function ($, _, Backbone, tmpl, SubordinatesLeaveHistoryCollection, LeaveCancel) {
  var SubordinatesLeaveHistoryView = Backbone.View.extend({
    tagName: 'div',
    className: 'subordinatesLeaveHistory container',
    currentTmpl: tmpl,
    chosenId: '',
    initialize: function initialize(options) {
      this.vent = options.vent || _.extend({}, Backbone.Events);
      this.collection = this.collection || new SubordinatesLeaveHistoryCollection(options.collectionJSON || {});
      this.setupEventListeners();
      var that = this;
      this.collection.fetch({
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
      'change [sle_user_id]': 'chooseUserId'
    },
    setupView: function setupView() {},
    setupEventListeners: function setupEventListeners() {
      var that = this;
    },
    render: function render(progress) {
      var displayCollection = this.collection;

      if (this.chosenId != '') {
        displayCollection = new SubordinatesLeaveHistoryCollection(displayCollection.where({
          'id_user': this.chosenId
        }));
      }

      this.$el.html(_.template(this.currentTmpl)({
        progress: progress,
        collection: displayCollection,
        userIdArr: this.collection.getDistinctUserId(),
        chosenId: this.chosenId
      }));
    },
    chooseUserId: function chooseUserId() {
      var $element = this.$('[sle_user_id]').first();
      this.chosenId = $element.val();
      this.render();
    }
  });
  return SubordinatesLeaveHistoryView;
});