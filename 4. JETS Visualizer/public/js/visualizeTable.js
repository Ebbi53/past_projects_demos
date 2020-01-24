let visualizeTable = (arr) => {
    let chart = AmCharts.makeChart("gpBar", {
    "type": "serial",
    "fontSize":14,
    "autoResize":true,
"theme": "light",
    "legend": {
        "horizontalGap": 10,
        "maxColumns": 1,
        "position": "right",
    "useGraphSettings": true,
    "markerSize": 14
    },
    "dataProvider": arr,
    "valueAxes": [{
        "stackType": "regular",
        "axisAlpha": 0.5,
        "gridAlpha": 0,
        
    }],
    "graphs": [{
        "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
        "fillAlphas": 0.8,
        "labelText": "[[value]]",
        "lineAlpha": 0.3,
        "title": "CV Pass",
        "type": "column",
    "color": "#000000",
        "valueField": "PymetricsInvited"
    }, {
        "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
        "fillAlphas": 0.8,
        "labelText": "[[value]]",
        "lineAlpha": 0.3,
        "title": "Pymetrics Participation",
        "type": "column",
    "color": "#000000",
        "valueField":  "PymetricsParticipated"
    }, {
        "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
        "fillAlphas": 0.8,
        "labelText": "[[value]]",
        "lineAlpha": 0.3,
        "title": "Pymetrics Pass",
        "type": "column",
    "color": "#000000",
        "valueField": "PymetricsPass"
    }, {
        "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
        "fillAlphas": 0.8,
        "labelText": "[[value]]",
        "lineAlpha": 0.3,
        "title": "TalentQ Invitation",
        "type": "column",
    "color": "#000000",
        "valueField": "TalentQInvited"
    }, {
        "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
        "fillAlphas": 0.8,
        "labelText": "[[value]]",
        "lineAlpha": 0.3,
        "title": "TalentQ Participation",
        "type": "column",
    "color": "#000000",
        "valueField": "TalentQParticipated"
    }, {
        "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
        "fillAlphas": 0.8,
        "labelText": "[[value]]",
        "lineAlpha": 0.3,
        "title": "TalentQ Pass",
        "type": "column",
    "color": "#000000",
        "valueField": "TalentQPass"
    }
, {
        "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
        "fillAlphas": 0.8,
        "labelText": "[[value]]",
        "lineAlpha": 0.3,
        "title": "Video Interview Invitation",
        "type": "column",
    "color": "#000000",
        "valueField": "VideoInvited"
    }
, {
        "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
        "fillAlphas": 0.8,
        "labelText": "[[value]]",
        "lineAlpha": 0.3,
        "title": "Video Interview Participation",
        "type": "column",
    "color": "#000000",
        "valueField": "VideoParticipated"
    }
, {
        "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
        "fillAlphas": 0.8,
        "labelText": "[[value]]",
        "lineAlpha": 0.3,
        "title": "Video Interview Pass",
        "type": "column",
    "color": "#000000",
        "valueField": "VideoPass"
    }
, {
        "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
        "fillAlphas": 0.8,
        "labelText": "[[value]]",
        "lineAlpha": 0.3,
        "title": "AC Invitation",
        "type": "column",
    "color": "#000000",
        "valueField": "ACInvited"
    }
, {
        "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
        "fillAlphas": 0.8,
        "labelText": "[[value]]",
        "lineAlpha": 0.3,
        "title": "AC Participation",
        "type": "column",
    "color": "#000000",
        "valueField": "ACParticipated"
    }
, {
        "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
        "fillAlphas": 0.8,
        "labelText": "[[value]]",
        "lineAlpha": 0.3,
        "title": "AC Pass",
        "type": "column",
    "color": "#000000",
        "valueField": "ACPass"
    }
, {
        "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
        "fillAlphas": 0.8,
        "labelText": "[[value]]",
        "lineAlpha": 0.3,
        "title": "Offer Sent",
        "type": "column",
    "color": "#000000",
        "valueField": "OfferGiven"
    }
, {
        "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
        "fillAlphas": 0.8,
        "labelText": "[[value]]",
        "lineAlpha": 0.3,
        "title": "Offer Accepted",
        "type": "column",
    "color": "#000000",
        "valueField": "value.OfferAcceptYes"
    }

],
    "rotate": true,
    "categoryField": "key",
    "categoryAxis": {
        "gridPosition": "start",
        "axisAlpha": 0,
        "gridAlpha": 0,
        "position": "left"
    },
    "export": {
        "enabled": true
    }
});
chart.handleResize();
}




