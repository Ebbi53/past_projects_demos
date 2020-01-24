let getAC = () => {
    return d => d["Career_Info_Availability_For_Interview"];
}

let getChannel = () => {
    let src = [];
    return (d) => {
        if (d["Recruitment_Source"].includes(",")) {//when the applicant has more than one dimension
            src = d["Recruitment_Source"].split(',');
            return src;
        } else {//when the applicant has one dimension
            src = d["Recruitment_Source"];
            return [src]; //need to return as array
        }
    }
}

let getUni = () => {
    return (d) => {
        let substring = "Others ";
        if (d["University"].includes(substring)) {
            //console.log(d["University"].slice( d["University"].indexOf('(')+1, d["University"].length-1))
            return d["University"].slice(d["University"].indexOf('(') + 1, d["University"].length - 1)
        }
        else if (d["University"] == "") {
            return "Not written"
        }
        else {
            //let other={};
            //return substring;
            return d["University"];
        }
    }
}

let makePieChart = (data, id) => {
    let arr = data.mycrossfilter.allFiltered()
    application = arr.length

    let dimension, group;

    if (id == ac_pie_chart)
        dimension = data.mycrossfilter.dimension(getAC());


    else if (id == channel_pie_chart)
        dimension = data.mycrossfilter.dimension(getChannel());

    else if (id == uni_pie_chart)
        dimension = data.mycrossfilter.dimension(getUni())



    group = dimension.group().reduceCount();


    let chart = dc.pieChart(`#${id.id}`)
    chart
        .width(350)
        .height(300)
        .slicesCap(8)
        .innerRadius(0)
        .externalLabels(20)
        .externalRadiusPadding(20)
        .drawPaths(true)
        .dimension(dimension)
        .group(group)
        .legend(dc.legend().gap(20).x(360).y(20));

    chart.on('pretransition', function (chart) {
        chart.selectAll('text.pie-slice').text(function (d) {
            return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2 * Math.PI) * 100) + '%';
        })
    })

        .on('pretransition', (chart) => {
            chart.selectAll('text.pie-slice.pie-label')

                .text(d => {
                    return (`${((d.data.value / application) * 100).toFixed(2)}%`)
                })

            chart.selectAll('.dc-legend-item text')
                .text(d => {
                    return (`${d.name}: ${d.data}`)
                })
        })
        .othersGrouper(null)
        .filter = () => { }


    chart.render()
}

let makeSuccessPieChart = (data) => {
    let arr = data.mycrossfilter.allFiltered()
    let success = []

    arr.forEach(e => {
        if (e.OfferAcceptYes == '1') success.push(e)
    })

    if (success.length == 0)
        $('#success_pie_chart').html(`<br><br><br><br><p style = 'color:red'><i>There were no accepted applicants for this selection</i></p>`)

    else {

        $('#success_pie_chart').html(``)


        let temp = crossfilter(success)
        let dimension;
        if ($('#dropdown').val() == 'success_uni')
            dimension = temp.dimension(getUni());
        else if ($('#dropdown').val() == 'success_ac')
            dimension = temp.dimension(getAC());
        else if ($('#dropdown').val() == 'success_channel')
            dimension = temp.dimension(getChannel());

        group = dimension.group().reduceCount();

        let chart = dc.pieChart(`#success_pie_chart`)
        chart
            .width(350)
            .height(300)
            .innerRadius(0)
            .externalLabels(20)
            .externalRadiusPadding(20)
            .drawPaths(true)
            .dimension(dimension)
            .group(group)
            .legend(dc.legend().gap(20).x(360).y(20));

        chart.on('pretransition', function (chart) {
            chart.selectAll('text.pie-slice').text(function (d) {
                return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2 * Math.PI) * 100) + '%';
            })
        })

            .on('pretransition', (chart) => {
                chart.selectAll('text.pie-slice.pie-label')

                    .text(d => {
                        return (`${((d.data.value / 10) * 100).toFixed(2)}%`)
                    })

                chart.selectAll('.dc-legend-item text')
                    .text(d => {
                        return (`${d.name}: ${d.data}`)
                    })
            })
            .othersGrouper(null)
            .filter = () => { }


        chart.render()

    }








}









