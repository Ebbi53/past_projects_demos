/*****
 * This is the main JS file for the visualization part
 * ****//***********global let***********/
const socket = io();

window.extractedData = {}
window.scoreData = {}
totalApplicants = '';
//dc
let uniChart = dc.rowChart("#uniChart");
let channelChart = dc.rowChart("#channelChart");
let acChart = dc.rowChart("#acChart");
let table = dc.dataTable('#uniTable');
let channelTable = dc.dataTable('#channelTable');
let acTable = dc.dataTable('#acTable');
//for pagination
let ofs = 0, pag = 5;

/***********jquery***********/
// make the filters and funnel chart draggable and movable
$(".sortable").sortable();

// click event for close button of bar chart
$(".close_bar").click(() => {
    $('#compare_bar').hide();
    removeActiveButtons();
})

// click event for close button of table
$(".close_table").click(() => {
    $('#tab').hide();
    removeActiveButtons();
})

// click event for table export button
//export_uni
$(".export").click(function () {
    let id = $(this).attr('id');
    exportCSV(id);
});


$('#resetAll').click(() => {
    $('#tab').hide();
    $('#compare_bar').hide();
    removeActiveButtons()
})

$('#ac_pie_title').html(`<h6><b>Most popular assessment centre choice</b></h6><p><ul><li>The pie slice represents the percentage of applicants choosing a particular AC</li><li>The legend shows the number of applicant's choice.</li></ul></p>`)
$('#channel_pie_title').html(`<h6><b>Top promotional channels for JETS</b></h6><p><ul><li>The pie slice represents the percentage of applicants applying via a particular source.</li><li>The legend shows the number of applicants.</li></ul></p>`)
$('#uni_pie_title').html(`<h6><b>Top university applications for JETS</b></h6><p><ul><li>The pie slice represents the percentage of applicants applying from a particular univeristy.</li><li>The legend shows the number of applicants.</li></ul></p>`)
$('#success_pie_title').html(`<h6><b>Successful applicants</b></h6><p><ul><li>A total of 10 applicants were hired after the final round.</li></ul></p>`)

let makeRowChart = (name, height, width, dimension, group) => {
    name
        .width(width)
        .height(height)
        .dimension(dimension)
        .group(group)
        .elasticX(true)
        .transitionDuration(400)
}

/***********dc***********/
//drawing the charts (include filters) by dc.js

$(document).ready(() => {
    return new Promise((resolve, reject) => {
        $.get('/getData', (data) => {
            if (data.data == null) {
                reject(data.err)
            }
            else {
                totalApplicants = data.data.length; //needs to be edited in the future according to the actual number recieved
                extractData(data.data)
                    .then(info => {
                        extractedData = info;
                        prepareFunnel();

                        let filterActions = () => {
                            prepareFunnel();
                            getScores(extractedData, scoreData)
                            makePieChart(extractedData, ac_pie_chart)
                            makePieChart(extractedData, channel_pie_chart)
                            makePieChart(extractedData, uni_pie_chart)
                            makeSuccessPieChart(extractedData)
                            //draw which bar
                            generateBarChart();
                        }

                       

                        //uni row chart
                        makeRowChart(uniChart, 33000, 650, info.uniDimension, info.uniGroup)
                        uniChart.on('filtered', (chart) => { //change on barchart will change funnel chart
                            //get the text for filter value(s) associated with the chart instance, return in string
                            sel = uniChart.filterPrinter()(chart.filters());

                            //tokenize sel
                            selected = sel.split(", ");// return in array

                            //change funnel title
                            if (selected != "") {
                                $("#funnel_title").text("Selected University: ");
                                $("#funnel_title_content").text(sel);
                            } else {
                                $("#funnel_title").text("University: ");
                                $("#funnel_title_content").text("All");
                            }
                            filterActions()

                        })
                            .on('preRedraw', () => {
                                check_wont_visualize()
                            });

                        //channel row chart
                        makeRowChart(channelChart, 700, 680, info.channelDimension, info.channelGroup)
                        channelChart.on('filtered', (chart) => { //change on barchart will change funnel chart
                            //get the filtered dimension, return in string
                            sel = channelChart.filterPrinter()(chart.filters());

                            //tokenize sel
                            selected = sel.split(", "); // return in array

                            //change funnel title
                            if (selected != "") {
                                $("#funnel_channel_title").text("Selected Promotional Channel: ");
                                $("#funnel_channel_title_content").text(sel);
                            } else {
                                $("#funnel_channel_title").text("Promotional Channel: ");
                                $("#funnel_channel_title_content").text("All");
                            }
                            filterActions()
                        })
                        //remove ticks from the x-axis
                        channelChart.xAxis().tickFormat((v) => { return ""; });


                        makeRowChart(acChart, 350, 300, info.acDimension, info.acGroup)
                        acChart.on('filtered', (chart) => { //change on barchart will change funnel chart
                            //get the filtered dimension, return in string
                            sel = channelChart.filterPrinter()(chart.filters());

                            //tokenize sel
                            selected = sel.split(", ");// return in array
                            //console.log(selected);

                            //change funnel title
                            if (selected != "") {
                                $("#funnel_ac_title").text("Selected AC: ");
                                $("#funnel_ac_title_content").text(sel);
                            } else {
                                $("#funnel_ac_title").text("AC: ");
                                $("#funnel_ac_title_content").text("All");
                            }

                            //redraw funnel chart
                            filterActions()
                        })


                        table
                            .dimension(remove_empty_bins(info.uniGroup_table))
                            .group((d) => { return " " })
                            .columns([
                                { label: 'University', format: (d) => { return d.key } },
                                { label: 'CV Pass', format: (d) => { return d.value.PymetricsInvited; } },
                                { label: 'Pymetrics Participation', format: (d) => { return d.value.PymetricsParticipated; } },
                                { label: 'Pymetrics Pass', format: (d) => { return d.value.PymetricsPass; } },

                                { label: 'TalentQ Invitation', format: (d) => { return d.value.TalentQInvited; } },
                                { label: 'TalentQ Participation', format: (d) => { return d.value.TalentQParticipated; } },
                                { label: 'TalentQ Pass', format: (d) => { return d.value.TalentQPass; } },

                                { label: 'Video Interview Invitation', format: (d) => { return d.value.VideoInvited; } },
                                { label: 'Video Interview Participation', format: (d) => { return d.value.VideoParticipated; } },
                                { label: 'Video Interview Pass', format: (d) => { return d.value.VideoPass; } },

                                { label: 'AC Invitation', format: (d) => { return d.value.ACInvited; } },
                                { label: 'AC Participation', format: (d) => { return d.value.ACParticipated; } },
                                { label: 'AC Pass', format: (d) => { return d.value.ACPass; } },

                                { label: 'Offer Sent', format: (d) => { return d.value.OfferGiven; } },
                                { label: 'Offer Accepted', format: (d) => { return d.value.OfferAcceptYes; } }



                            ])
                            .sortBy((d) => { return d.value.PymetricsInvited })
                            .order(d3.descending)
                            .size(Infinity)
                            .on('preRender', table_pagination)
                            .on('preRedraw', table_pagination)
                            .on('pretransition', table_pagination);

                        channelTable
                            .dimension(remove_irrelevent_channel(info.channelGroup_table, channelChart.filters()))
                            .group((d) => { return " " })
                            .columns([
                                { label: 'Recruitment Source', format: (d) => { return d.key } },
                                { label: 'CV Pass', format: (d) => { return d.value.PymetricsInvited; } },
                                { label: 'Pymetrics Participation', format: (d) => { return d.value.PymetricsParticipated; } },
                                { label: 'Pymetrics Pass', format: (d) => { return d.value.PymetricsPass; } },

                                { label: 'TalentQ Invitation', format: (d) => { return d.value.TalentQInvited; } },
                                { label: 'TalentQ Participation', format: (d) => { return d.value.TalentQParticipated; } },
                                { label: 'TalentQ Pass', format: (d) => { return d.value.TalentQPass; } },

                                { label: 'Video Interview Invitation', format: (d) => { return d.value.VideoInvited; } },
                                { label: 'Video Interview Participation', format: (d) => { return d.value.VideoParticipated; } },
                                { label: 'Video Interview Pass', format: (d) => { return d.value.VideoPass; } },

                                { label: 'AC Invitation', format: (d) => { return d.value.ACInvited; } },
                                { label: 'AC Participation', format: (d) => { return d.value.ACParticipated; } },
                                { label: 'AC Pass', format: (d) => { return d.value.ACPass; } },

                                { label: 'Offer Sent', format: (d) => { return d.value.OfferGiven; } },
                                { label: 'Offer Accepted', format: (d) => { return d.value.OfferAcceptYes; } },

                            ])
                            .sortBy((d) => { return d.value.PymetricsInvited })
                            .order(d3.descending)
                            .size(Infinity)
                            .on('preRender', table_pagination)
                            .on('preRedraw', table_pagination)
                            .on('pretransition', table_pagination);


                        acTable
                            .dimension(remove_empty_bins(info.acGroup_table))
                            .group((d) => { return " " })
                            .columns([
                                { label: 'AC', format: (d) => { return d.key } },
                                { label: 'CV Pass', format: (d) => { return d.value.PymetricsInvited; } },
                                { label: 'Pymetrics Participation', format: (d) => { return d.value.PymetricsParticipated; } },
                                { label: 'Pymetrics Pass', format: (d) => { return d.value.PymetricsPass; } },

                                { label: 'TalentQ Invitation', format: (d) => { return d.value.TalentQInvited; } },
                                { label: 'TalentQ Participation', format: (d) => { return d.value.TalentQParticipated; } },
                                { label: 'TalentQ Pass', format: (d) => { return d.value.TalentQPass; } },

                                { label: 'Video Interview Invitation', format: (d) => { return d.value.VideoInvited; } },
                                { label: 'Video Interview Participation', format: (d) => { return d.value.VideoParticipated; } },
                                { label: 'Video Interview Pass', format: (d) => { return d.value.VideoPass; } },

                                { label: 'AC Invitation', format: (d) => { return d.value.ACInvited; } },
                                { label: 'AC Participation', format: (d) => { return d.value.ACParticipated; } },
                                { label: 'AC Pass', format: (d) => { return d.value.ACPass; } },

                                { label: 'Offer Sent', format: (d) => { return d.value.OfferGiven; } },
                                { label: 'Offer Accepted', format: (d) => { return d.value.OfferAcceptYes; } },
                            ])
                            .sortBy((d) => { return d.value.PymetricsInvited })
                            .order(d3.descending)
                            .size(Infinity)
                            .on('preRender', table_pagination)
                            .on('preRedraw', table_pagination)
                            .on('pretransition', table_pagination);

                        dc.renderAll();

                        //click diff visualize btn  ie. visualise btn in uni table
                        $(".visualize").click(() => {
                            generateBarChart();
                            $('#compare_bar').show();
                        })

                        $('#uni_bar').click(() => {
                            removeActiveButtons()
                            $('#compare_btn_uni').addClass("active")
                            $('#tab ').hide();
                            generateBarChart();
                            $('#compare_bar').show();
                        })

                        $('#channel_bar').click(() => {
                            removeActiveButtons()
                            $('#compare_btn_channel').addClass("active")
                            $('#tab ').hide();
                            generateBarChart();
                            $('#compare_bar').show();
                        })

                        $('#ac_bar').click(() => {
                            removeActiveButtons()
                            $('#compare_btn_ac').addClass("active")
                            $('#tab ').hide();
                            generateBarChart();
                            $('#compare_bar').show();
                        })

                        $("#dropdown").change(() => {
                            makeSuccessPieChart(extractedData)
                        })


                        //when row charts are clicked 
                        let generateBarChart = () => {
                            //first check which type of table is currently showing
                            if ($('#compare_btn_uni').hasClass('active')) {
                                visualizeTable(converting(remove_empty_bins(info.uniGroup_table).all()));
                            } else if ($('#compare_btn_channel').hasClass('active')) {
                                visualizeTable(converting(remove_irrelevent_channel(info.channelGroup_table, channelChart.filters()).all()));
                            } else if ($('#compare_btn_ac').hasClass('active')) {
                                visualizeTable(converting(remove_empty_bins(info.acGroup_table).all()));
                            }

                        }
                        // let openBarChart = (evt) => {
                        //     if(evt.currentTarget.id == 'uni_bar') 
                        // }
                    })// end of info
                resolve(1)
            }
        })
    }).then(() => {
        socket.emit('success')
    }).catch((err) => {
        alert(JSON.stringify(err))
    })
})

socket.on('second_data_fetch', (data) => {
    scoreData = data.description
    getScores(extractedData, scoreData)
    makePieChart(extractedData, ac_pie_chart)
    makePieChart(extractedData, channel_pie_chart)
    makePieChart(extractedData, uni_pie_chart)
    makeSuccessPieChart(extractedData)

})



/***********functions***********/

//funnel title, note function to see which university has 0 applicants
let check_wont_visualize = () => {
    $("#funnel_title_noted").remove();
    $("#funnel_content_noted").remove();

    let sel = uniChart.filters(); // get the clicked uni filter
    if (sel.length > 0) {// when there is clicked uni filter, there might hv uni that has 0 applicant

        // all_uni from  allFiltered data
        let all_uni = (converting(remove_empty_bins(info.uniGroup_table).all())).map(p => p.key)

        //initialize
        let result_0 = []; //shd not show, uni that has 0 applicant
        let result_not0 = []; //shd show uni thst has >0 applicants

        //for each selected uni, compare to each all_uni
        for (let l = 0; l < sel.length; l++) {
            for (let ll = 0; ll < all_uni.length; ll++) {
                if (!all_uni.includes(sel[l])) { //when there is no match, means this selected uni has 0 applicant
                    result_0.push(sel[l])
                } else { // when there is match, means this selected uni has >0 applicants
                    result_not0.push(sel[l]);
                }
            }
        }

        let result_00 = [...new Set(result_0)]; // remove duplication
        let result_not00 = [...new Set(result_not0)]; // remove duplication


        $("#funnel_title").text("Selected University: ");
        $("#funnel_title_content").text(result_not00.join(', ')); //arr to string
        if (result_00.length > 0) {
            $("#table_funnel_titles").find('tbody').append("<tr><td id='funnel_title_noted'><span id='noted_sign'>&#9888;</span>Note: </td> <td id='funnel_content_noted'></td> </tr>");
            $("#funnel_content_noted").text(result_00.join(', ') + " has/ have  0 applicants");
            $("#noted_sign").prop('title', "There are 0 applicants in these universities");
            //
        }

    } else {
        $("#funnel_title").text("University: ");
        $("#funnel_title_content").text("All");
    }


}


//function to check which table to render
let which_table_type = () => {
    let dataSet = ""
    let key = ""

    if ($('#compare_btn_uni').hasClass('active')) {
        dataSet = remove_empty_bins(info.uniGroup_table).all();
        key = "University"
    } else if ($('#compare_btn_channel').hasClass('active')) {
        dataSet = remove_irrelevent_channel(info.channelGroup_table, channelChart.filters()).all();
        key = "Promotional Channel"
    } else if ($('#compare_btn_ac').hasClass('active')) {
        dataSet = remove_empty_bins(info.acGroup_table).all();
        key = "AC"
    } else {
    }
    return { key, dataSet }
}

let update_offset = () => {
    let totFilteredRecs = info.mycrossfilter.groupAll().value()
    switch (which_table_type().key) {
        case "University": totFilteredRecs = remove_empty_bins(info.uniGroup_table).all().length; break;
        case "Promotional Channel": totFilteredRecs = remove_irrelevent_channel(info.channelGroup_table, channelChart.filters()).all().length; break;
        case "AC": totFilteredRecs = remove_empty_bins(info.acGroup_table).all().length; break;
    }

    ofs = ofs >= totFilteredRecs ? Math.floor((totFilteredRecs - 1) / pag) * pag : ofs;
    ofs = ofs < 0 ? 0 : ofs;



    table.beginSlice(ofs);
    table.endSlice(ofs + pag);

    channelTable.beginSlice(ofs);
    channelTable.endSlice(ofs + pag);

    acTable.beginSlice(ofs);
    acTable.endSlice(ofs + pag);
}

let openCompareTable = (evt, compareBy) => {
    $('#tab').show();

    //hide currently open bar chart
    $('#compare_bar').hide();

    // Hide the currently showing table
    $('.tableContent').hide();

    // Get all elements with class="tableLinks" and remove the class "active"
    removeActiveButtons()
    // Show the current tab, and add an "active" class to the button that opened the tab
    $('#' + compareBy).show();

    if (evt.currentTarget.id == 'uni_tab') $('#compare_btn_uni').addClass("active")
    if (evt.currentTarget.id == 'channel_tab') $('#compare_btn_channel').addClass("active")
    if (evt.currentTarget.id == 'ac_tab') $('#compare_btn_ac').addClass("active")

    switch (compareBy) {
        case "compare_uniTable": com_table = remove_empty_bins(info.uniGroup_table); break;
        case "compare_channelTable": com_table = remove_irrelevent_channel(info.channelGroup_table, channelChart.filters()); break;
        case "compare_acTable": com_table = remove_empty_bins(info.acGroup_table); break;
        default: com_table = null;
    }


    //when change to other table, reset ofs
    ofs = 0;
    display()

    update_offset();
    table.redraw();
    channelTable.redraw();
    acTable.redraw();
}


//table pagination 
//size is size of that dimesions in filtered record 
//total size is number of dimension in original record , always the same
ofs = 0, pag = 5;

let display = () => {
    let totFilteredRecs = info.mycrossfilter.groupAll().value()
    switch (which_table_type().key) {
        case "University":
            totFilteredRecs = remove_empty_bins(info.uniGroup_table).all().length;
            $('.totalsize').text("(Total: " + info.uniGroup.all().length + " )");
            break;
        case "Promotional Channel":
            totFilteredRecs = remove_irrelevent_channel(info.channelGroup_table, channelChart.filters()).all().length;
            $('.totalsize').text("(Total: " + info.channelGroup.all().length + " )");
            break;
        case "AC":
            totFilteredRecs = remove_empty_bins(info.acGroup_table).all().length;
            $('.totalsize').text("(Total: " + info.acGroup.all().length + " )");
            break;

    }

    let end = ofs + pag > totFilteredRecs ? totFilteredRecs : ofs + pag;
    $('.begin')
        .text(end === 0 ? ofs : ofs + 1);
    $('.end')
        .text(end);
    $('#last')
        .attr('disabled', ofs - pag < 0 ? 'true' : null);
    $('#next')
        .attr('disabled', ofs + pag >= totFilteredRecs ? 'true' : null);
    $('.size').text(totFilteredRecs);

}

let table_pagination = (chart, direction = null) => {

    info = extractedData;
    update_offset();
    display();


    let next = () => {
        ofs += pag;

        update_offset();
        table.redraw();
        channelTable.redraw();
        acTable.redraw();
    }
    let last = () => {
        ofs -= pag;

        update_offset();
        table.redraw();
        channelTable.redraw();
        acTable.redraw();
    }
    if (direction != null || direction != undefined) {
        if (direction) {
            next();
        } else {
            last();
        }
    }
}

let change = (evt, stageName) => {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    $(`#${stageName}`).show()
    evt.target.className = evt.target.className + " active"

}
$("#defaultOpen").click();


let load = () => {
    setTimeout(showPage, 7500);

};


let showPage = () => {
    disableMove()
    $('.loading-bar').css('display', 'none');
    $('#loaderText').css('display', 'none');

    $('#page-content-wrapper').css('display', 'block');
    $('#bottom').css('display', 'block');
    $('body').css('background-color', 'whitesmoke')

    window.unichart_position = $('#uni_rowchart').offset()
    window.channelchart_position = $('#channel_rowchart').offset()
    window.acchart_position = $('#ac_rowchart').offset()
    window.funnelchart_position = $('#funnelchart').offset()

    window.funnelchartHeight = $('#funnelchart').height();
    window.funnelchartWidth = $('#funnelchart').width();
    window.armchartWidth = $('#armChart').width();
    window.armchartHeight = $('#armChart').height();

    window.unichart_height = $('#uni_rowchart').height()
    window.unichart_width = $('#uni_rowchart').width()
    window.channelchart_height = $('#channel_rowchart').height()
    window.channelchart_width = $('#channel_rowchart').width()
    window.acchart_height = $('#ac_rowchart').height()
    window.acchart_width = $('#ac_rowchart').width()

}

let removeActiveButtons = () => {
    let tableLinks = document.getElementsByClassName("tableLinks");
    for (let i = 0; i < tableLinks.length; i++) {
        tableLinks[i].className = tableLinks[i].className.replace(" active", "");
    }
}

let snapBack = () => {
    $('#snapButton').css("visibility", "hidden")

    $('#uni_rowchart').offset({ top: unichart_position.top, left: unichart_position.left })
    $('#channel_rowchart').offset({ top: channelchart_position.top, left: channelchart_position.left })
    $('#ac_rowchart').offset({ top: acchart_position.top, left: acchart_position.left })
    $('#funnelchart').offset({ top: funnelchart_position.top, left: funnelchart_position.left })

    $('#funnelchart').css("height", funnelchartHeight);
    $('#funnelchart').css("width", funnelchartWidth);
    $('#armChart').css("width", armchartWidth);
    $('#armChart').css("height", armchartHeight);

    $('#uni_rowchart').css('height', unichart_height)
    $('#uni_rowchart').css('width', unichart_width)
    $('#channel_rowchart').css('height', channelchart_height)
    $('#channel_rowchart').css('width', channelchart_width)
    $('#ac_rowchart').css('height', acchart_height)
    $('#ac_rowchart').css('width', acchart_width)
}

let showSnapButton = () => {
    $('#snapButton').css("visibility", "visible")
    $('#snapButton').css("transition", "0.5s")
}

$("#myInput").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $(".tableContent tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});

$("#funnelchart").resizable({ alsoResize: "#armChart", autoHide: true });
$("#armChart").resizable()

$('#uni_rowchart').resizable({ autoHide: true })

$('#channel_rowchart').resizable({ autoHide: true })
$('#ac_rowchart').resizable({ autoHide: true })

$(".card").draggable({ snap: true, scroll: true, containment: ".contain" })




let enableMove = () => {
    $('.card').draggable('enable')
    $('#funnelchart').resizable('enable')
    $('#uni_rowchart').resizable('enable')
    $('#armChart').resizable('enable')
    $('#ac_rowchart').resizable('enable')
    $('#uni_rowchart').resizable('enable')
    $('#channel_rowchart').resizable('enable')
    $('#layout_button').css('display', 'none')
    $('#confirm_button').css('display', 'block')
}

let disableMove = () => {
    $('.card').draggable('disable')
    $('#funnelchart').resizable('disable')
    $('#uni_rowchart').resizable('disable')
    $('#armChart').resizable('disable')
    $('#ac_rowchart').resizable('disable')
    $('#uni_rowchart').resizable('disable')
    $('#channel_rowchart').resizable('disable')
    $('#layout_button').css('display', 'block')
    $('#confirm_button').css('display', 'none')
    $('#snapButton').css('visibility', 'hidden')
}




