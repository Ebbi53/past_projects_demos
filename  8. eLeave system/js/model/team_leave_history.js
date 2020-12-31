
// leave balance model
define(['jquery', 'underscore', 'backbone', 'moduleConfig', 'moment'], function ($, _, Backbone, moduleConfig, moment) {
  var TeamLeaveHistoryModel = Backbone.Model.extend({
    url: moduleConfig.modelBaseUrlRoot + '?zgAction=getTeamLeaveSchedule',
    defaults: {
      'date': [],
      'type': [],
      'leaveType': [],
      'session': [],
      'id': [],
      'teamLeaveSchedule': '',
      'approvalAction': [],
      'trxToken': [],
      'teamMemberName': [],
      'displayDate': [],
      'dateValue': [],
      'month': [],
      'day': [],
      'uniqColorVal': {},
      'colorVal': []
    },
    aftermath: function aftermath(arg1) {
      var hsvToRgb = function hsvToRgb(h, s, v) {
        var r, g, b;
        var i;
        var f, p, q, t; // Make sure our arguments stay in-range

        h = Math.max(0, Math.min(360, h));
        s = Math.max(0, Math.min(100, s));
        v = Math.max(0, Math.min(100, v)); // We accept saturation and value arguments from 0 to 100 because that's
        // how Photoshop represents those values. Internally, however, the
        // saturation and value are calculated from a range of 0 to 1. We make
        // That conversion here.

        s /= 100;
        v /= 100;

        if (s == 0) {
          // Achromatic (grey)
          r = g = b = v;
          return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }

        h /= 60; // sector 0 to 5

        i = Math.floor(h);
        f = h - i; // factorial part of h

        p = v * (1 - s);
        q = v * (1 - s * f);
        t = v * (1 - s * (1 - f));

        switch (i) {
          case 0:
            r = v;
            g = t;
            b = p;
            break;

          case 1:
            r = q;
            g = v;
            b = p;
            break;

          case 2:
            r = p;
            g = v;
            b = t;
            break;

          case 3:
            r = p;
            g = q;
            b = v;
            break;

          case 4:
            r = t;
            g = p;
            b = v;
            break;

          default: // case 5: r = v; g = p; b = q;

        }

        return "" + Math.round(r * 255) + "," + Math.round(g * 255) + "," + Math.round(b * 255);
      };

      function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return parseInt(result[1], 16) + ',' + parseInt(result[2], 16) + ',' + parseInt(result[3], 16);
      }

      function randomColors(list) {
        var kelly_colors = ['E6194B', '3CB44B', 'FFE119', '0082C8', 'F58231', '911EB4', '46F0F0', 'F032E6', 'D2F53C', 'FABEBE', '008080', 'E6BEFF', 'AA6E28', '800000', 'AAFFC3', '808000', 'FFD8B1', '000080', '808080', 'fd79b0'];
        var i = 359 / (list.length - 1); // distribute the colors evenly on the hue range

        var r = {}; // hold the generated colors

        var c = {}; // hold the generated colors

        for (var x = 0; x < list.length; x++) {
          c[list[x]] = hexToRgb(kelly_colors[x % kelly_colors.length]);
          r[list[x]] = hsvToRgb(i * x, 70 + 30 / list.length * x * Math.random(), 90 + 10 / list.length * x * Math.random()); // you can also alternate the saturation and value for even more contrast between the colors
        } 
        return c;
      }

      var team = this.get('teamLeaveSchedule');
      var rows = team.trim() === "" ? [] : team.trim().split('\n');
      var tempTeamMemberName = [],
        tempDate = [],
        tempSession = [],
        tempColor = [],
        tempDisplayDate = [],
        tempDateValue = [],
        tempType = [],
        tempMonth = [],
        tempDay = [],
        tempApprovalAction = [],
        tempRow = [];

      for (var i = 0; i < rows.length; i++) {
        //row sort
        var cols = rows[i].split(',');
        tempRow.push({
          teamMemberName: cols[0],
          date: cols[1],
          session: cols[2],
          type: cols[3],
          approvalAction: cols[4],
          displayDate: moment(cols[1], "YYYY-MM-DD").format("DD/MM/YYYY"),
          dateValue: moment(cols[1], "YYYY-MM-DD").valueOf(),
          month: moment(cols[1], "YYYY-MM-DD").format("MMMM, YYYY"),
          day: moment(cols[1], "YYYY-MM-DD").format("Do (ddd)")
        });
      }

      tempRow.sort(function (a, b) {
        if (a.dateValue > b.dateValue) return -1; else if (a.dateValue < b.dateValue) return 1; else if (a.teamMemberName > b.teamMemberName) return 1; else if (a.teamMemberName < b.teamMemberName) return -1; else return a.session < b.session;
      });

      for (var i = 0; i < rows.length; i++) {
        tempTeamMemberName.push(tempRow[i].teamMemberName);
        tempDate.push(tempRow[i].date);
        tempMonth.push(tempRow[i].month);
        tempDay.push(tempRow[i].day);
        tempSession.push(tempRow[i].session);
        tempDisplayDate.push(tempRow[i].displayDate);
        tempDateValue.push(tempRow[i].dateValue);
        tempType.push(tempRow[i].type);
        tempApprovalAction.push(tempRow[i].approvalAction);
      }

      var sortedUniqteamMemberName = _.uniq(tempTeamMemberName).sort(function (a, b) {
        return a.localeCompare(b);
      });

      var uniqueColor = randomColors(sortedUniqteamMemberName);

      for (var j = 0; j < rows.length; j++) {
        tempColor.push(uniqueColor[tempTeamMemberName[j]]);
      } //dateValue,displayDateDate
      // this.set('row', tempRow);


      this.set('date', tempDate);
      this.set('month', tempMonth);
      this.set('day', tempDay);
      this.set('teamMemberName', tempTeamMemberName);
      this.set('session', tempSession);
      this.set('displayDate', tempDisplayDate);
      this.set('dateValue', tempDateValue);
      this.set('colorVal', tempColor);
      this.set('uniqColorVal', uniqueColor);
      this.set('leaveType', tempType);
      this.set('approvalAction', tempApprovalAction); // console.log(this.attributes)
    }
  });
  return TeamLeaveHistoryModel;
});