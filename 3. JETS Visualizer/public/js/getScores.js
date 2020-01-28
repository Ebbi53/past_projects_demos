let makeScoreChart = (scores, width, height, target) => {
    let ndx = crossfilter(scores),
        typeDimension = ndx.dimension(d => {
            return d;
        }),
        typeGroup = typeDimension.group().reduceCount();
    var barChart = dc.barChart(`#${target.id}`);

    barChart
        .width(width)
        .height(height)
        .x(d3.scaleLinear().domain([0, 100]))
        .brushOn(true)
        .dimension(typeDimension)
        .group(typeGroup)
        .xAxisLabel("Scores")
        .yAxisLabel('Number of participants')
        .barPadding(0.1)
        .outerPadding(0.2)

    barChart.render();
}


let calculateStats = (scores) => {
    let cnt = 0
    let sum = 0

    let obj = {
        max: new Number(),
        min: new Number(),
        avg: new Number(),
        freq: {num: new Number(), item: new Number()}
    }

    scores.forEach(e => {
        sum += e
        if (cnt == 0) {
            obj.max = e
            obj.min = e
        }
        else {
            if (e > obj.max)
                obj.max = e
            if (e <= obj.min)
                obj.min = e
        }

        cnt++
    })

    obj.avg = Math.round(sum / scores.length * 100) / 100

    let mf = 1
    let m = 0

    for (let i = 0; i < scores.length; i++) {
        for (let j = i; j < scores.length; j++) {
            if (scores[i] == scores[j])
                m++;
            if (mf < m) {
                mf = m;
                obj.freq.item = scores[i];
            }
        }
        obj.freq.num = mf
        m = 0;
    }

    return obj

}



let getScores = (mainData, scoreData) => {
            let arr = mainData.mycrossfilter.allFiltered()
            application = arr.length

            let pymetrics_scores = []
            let verbal_scores = []
            let numeric_scores = []
            let talentq_scores = []


            arr.forEach(e => {

                let num = scoreData.findIndex(score => {
                    return score.uuid == e.uuid
                })

                //Calculate pymetrics stats
                if (e.PymetricsPass == '1' || e.PymetricsFail == '1')
                    pymetrics_scores.push(Number(scoreData[num].pymetrics))


                //Calculate total verbal and numeric
                if (e.TalentQPass == '1' || e.TalentQFail == '1') {

                    if (isNaN(Number(scoreData[num].verbal)) || isNaN(Number(scoreData[num].numeric)) || scoreData[num].verbal == '' || scoreData[num].numeric == '') {
                        verbal_scores.push(0)
                        numeric_scores.push(0)
                    }

                    else {
                        verbal_scores.push(Number(scoreData[num].verbal))
                        numeric_scores.push(Number(scoreData[num].numeric))
                    }
                }
            })
            for (let i = 0; i < verbal_scores.length; i++)
            talentq_scores.push(Math.round((verbal_scores[i] + numeric_scores[i]) / 2))

            let pyStats = calculateStats(pymetrics_scores)
            let vStats = calculateStats(verbal_scores)
            let nStats = calculateStats(numeric_scores)
            let tqStats = calculateStats(talentq_scores)

            makeScoreChart(pymetrics_scores, 460, 300, py_score_chart)
            $('#pymetrics_title').html(`<h6><b>A peek at applicants' Pymetrics performance</b></h6>`)
            $('#py_avg').html(`Average: <strong> ${pyStats.avg} </strong>`)
            $('#py_max').html(`Maximum: <strong> ${pyStats.max} </strong>`)
            $('#py_min').html(`Minimum: <strong> ${pyStats.min} </strong>`)
            $('#py_freq').html(`Most frequent: <strong> ${pyStats.freq.item} (${pyStats.freq.num} applicants) </strong>`)

            makeScoreChart(verbal_scores, 360, 200, v_score_chart)
            $('#v_title').html(`<b><i>  VERBAL</i></b>`)
            $('#v_avg').html(`Average: <strong> ${vStats.avg} </strong>`)
            $('#v_max').html(`Maximum: <strong> ${vStats.max} </strong>`)
            $('#v_min').html(`Minimum: <strong> ${vStats.min} </strong>`)

            makeScoreChart(numeric_scores, 360, 200, n_score_chart)
            $('#n_title').html(`<b><i>  NUMERIC</i></b>`)
            $('#n_avg').html(`Average: <strong> ${nStats.avg} </strong>`)
            $('#n_max').html(`Maximum: <strong> ${nStats.max} </strong>`)
            $('#n_min').html(`Minimum: <strong> ${nStats.min} </strong>`)

            makeScoreChart(talentq_scores, 460, 300, tq_score_chart)
            $('#tq_avg').html(`Average: <strong> ${tqStats.avg} </strong>`)
            $('#tq_title').html(`<b><i> TALENTQ </i></b>`)
            $('#tq_max').html(`Maximum: <strong> ${tqStats.max} </strong>`)
            $('#tq_min').html(`Minimum: <strong> ${tqStats.min} </strong>`)
            $('#tq_freq').html(`Most frequent: <strong> ${tqStats.freq.item} (${tqStats.freq.num} applicants) </strong>`)

            $('#talentQ_title').html(`<h6><b>A peek at applicants' TalentQ performance</b></h6><p><ul><li>Two phases of TalentQ: Verbal & Numerical</li><li>Avergae of the two is the TalentQ score</li></ul></p>`)






        }








