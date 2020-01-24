/*convert data format for bar charts by removing value: */
/*from {key:something  value:{stage1: 111, stage2:222 , ....} }
to {key:something stage1: 111, stage2:222 , .... }
*/
let converting = (arr) => {
    let result = [];
    //show at most 25 items
    for (let i = 0; i < (i > 24 ? 24 : arr.length); i++) {
        const { PymetricsInvited, PymetricsParticipated, PymetricsPass,
            TalentQInvited, TalentQParticipated, TalentQPass,
            VideoInvited, VideoParticipated, VideoPass,
            ACInvited, ACParticipated, ACPass,
            OfferGiven, OfferAcceptYes } = arr[i].value;

        const change = {
            "key": arr[i].key, PymetricsInvited, PymetricsParticipated, PymetricsPass,
            TalentQInvited, TalentQParticipated, TalentQPass,
            VideoInvited, VideoParticipated, VideoPass,
            ACInvited, ACParticipated, ACPass,
            OfferGiven, OfferAcceptYes
        };

        result.push(change);
    }

let compare = (a, b) => {
        let field = "PymetricsInvited";
        if (a[field] < b[field]) { return -1 }
        if (a[field] > b[field]) { return 1 }
        return 0
    }

    // sort bar chart by PymetricsInvited in decreasing order
    result = result.sort(compare).reverse();
    return result;

}

/*generate fake group to show data that shd be displayed */

//function for all bar charts
let remove_empty_bins = (source_group) => {
    //only show items that PymetricsInvited >0
    let non_zero_pred = (d) => {
        return (d.value.PymetricsInvited) != 0;
    }
    return {
        all:  () => {
            return source_group.all().filter(non_zero_pred);
        },
        top:  (n) => {
            return source_group.top(Infinity)
                .filter(non_zero_pred)
                .slice(0, n);
        },
        bottom: (n) => {
            return source_group.top(Infinity)
                .filter(non_zero_pred)
                .slice(-n).reverse();
        }
    };
}

//for table and bar chart when its dimensions are array ie. channel 
let remove_irrelevent_channel = (source_group, filters) => {
    let irrelevent = (d) => {
        //console.log(filters)
        //only show item that is PymetricsInvited >0
        if (filters == "") {
            //console.log("empty filter")
            return (d.value.PymetricsInvited) != 0;
        }

        //only show item that is clicked and PymetricsInvited >0
        return filters.indexOf(d.key) >= 0 && (d.value.PymetricsInvited) != 0;
    }
    //console.log(info.channelGp_table.all().filter(d=>d.key=="BBS"))
    //info.channelGp_table.all().filter(d=>['BBS','University Careers Centre'].indexOf(d.key) >= 0))

    return {
        all:  () => {
            return source_group.all().filter(irrelevent);
        },
        top: (n) => {
            return source_group.top(Infinity)
                .filter(irrelevent)
                .slice(0, n);
        },
        bottom:  (n) => {
            return source_group.top(Infinity)
                .filter(irrelevent)
                .slice(-n).reverse();
        }
    };
}



