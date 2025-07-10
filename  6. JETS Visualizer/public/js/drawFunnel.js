let prepareFunnel = () => { //generate funnel chart
    performCalculations(extractedData)
        .then(calculations => {
            //amcharts v3
            let openArmChart = () => {
                $("#rright").empty();
                let data = calculations.amFunnelData;
                let chart = new AmCharts.AmFunnelChart();
                chart.titleField = "name";
                chart.valueField = "value";
                chart.dataProvider = data;
                chart.balloon = {
                    "enabled": true,
                };
                chart.pullDistance = 0;
                chart.balloon.animationTime = 0;
                chart.startDuration = 0;//                                     
                chart.fontSize = 14;
                chart.valueRepresents = 'area';
                chart.gradientRatio = [0,0,0];
                chart.balloon.cornerRadius=0;
                chart.marginRight = 220;//
                chart.marginLeft = 0;//
                chart.labelPosition = "right";//
                chart.funnelAlpha = 0.9;//
                chart.startX = 0;//
                chart.accessibleTitle = "JETS 2018/19 applications"
                chart.neckWidth = "40%";//
                chart.startAlpha = 0;//
                chart.neckHeight = "30%";//
                chart.outlineThickness = 1;
                chart.labelText = "[[title]]:[[rate]]";//d
                chart.balloonText = "[[title]]:<b>[[value]]</b>";//
                chart.creditsPosition = "top-right";
                chart.export = {
                    "enabled": true
                };

                chart.write("armChart");


                draw_legend(calculations.legendData);
   

            }
            openArmChart();

        })


}

//legend for funnel chart
let draw_legend = (lD) => {
    $("#rright").empty();

    // create table for legend.
    let legend = d3.select("#rright").append("table").attr('class', 'legend');

    // create one row per segment.
    let tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");

    tr.append("span").attr("class", "badge badge-secondary").attr("id", (d) => { return d.label; }).text(" ")
    // create the first column for each segment.
    tr.append("td").attr("class", 'legendLabel').text((d) => {
        if (d.label.includes("Invite to VI")) { return "Invite to Video Interview (VI)" }
        else if (d.label.includes("VI Participated")) { return "Video Interview (VI) Participated" }
        else if (d.label.includes("VI Passed")) { return "Video Interview (VI) Passed" }
        else { return d.label; }
    });

    // create the second column for each segment.
    tr.append("td").attr("class", 'legendPerc')
        .text((d) => { return d.y });  // need to change to y
}