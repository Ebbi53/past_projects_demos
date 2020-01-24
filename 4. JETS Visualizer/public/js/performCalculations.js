//call by drawFunnel.js
let performCalculations = (data) => { // pass extracted data
    return new Promise((resolve, reject) => {
        let selected = data.selected; // get the frequency of filteration

        
        let application = 0,
            Pymetrics_invited = 0,
            TalentQ_invited = 0,
            Video_invited = 0,
            AC_invited = 0,
            offer_invited = 0,
            Pymetrics_participated = 0,
            TalentQ_participated = 0,
            Video_participated = 0,
            AC_participated = 0,
            Pymetrics_pass = 0,
            TalentQ_pass = 0,
            Video_pass = 0,
            AC_pass = 0,
            offer_pass = 0;
         

        if (selected == null || selected == '') {
            // application = totalApplicants;
            var limit = 1;
        } else {
            limit = selected.length;
        }

        console.log(limit)

        
        temp = 0;
        temp1 =0
        temp2=0


        let arr = data.mycrossfilter.allFiltered();
        application = arr.length;
  
        //accumulate the the total number of 1s in each column of the csv structure
        for (let i = 0; i < limit; i++) {
            for (let j = 0; j < application; j++) {
                Pymetrics_invited += Number(arr[j].PymetricsPass) + Number(arr[j].PymetricsFail) + Number(arr[j].PymetricsAbsence);
                Pymetrics_participated += Number(arr[j].PymetricsPass) + Number(arr[j].PymetricsFail);
                Pymetrics_pass += Number(arr[j].PymetricsPass);

                TalentQ_invited += Number(arr[j].TalentQPass) + Number(arr[j].TalentQFail) + Number(arr[j].TalentQAbsence);
                TalentQ_participated += Number(arr[j].TalentQPass) + Number(arr[j].TalentQFail);
                TalentQ_pass += Number(arr[j].TalentQPass);

                Video_invited += Number(arr[j].VideoPass) + Number(arr[j].VideoFail) + Number(arr[j].VideoAbsence);
                Video_participated += Number(arr[j].VideoPass) + Number(arr[j].VideoFail);
                Video_pass += Number(arr[j].VideoPass);

                AC_invited += Number(arr[j].ACPass) + Number(arr[j].ACFail) + Number(arr[j].ACAbsence);
                AC_participated += Number(arr[j].ACPass) + Number(arr[j].ACFail);
                AC_pass += Number(arr[j].ACPass);

                offer_invited += Number(arr[j].OfferAcceptYes) + Number(arr[j].OfferAcceptNo);
                offer_pass += Number(arr[j].OfferAcceptYes);

                
                temp += Number(arr[j].VideoPass) 
                temp1 += Number(arr[j].VideoFail) 
                temp2 += Number(arr[j].VideoAbsence) 
            }
        }


    
        //calculate percentage
        let CV_pass_rate = Pymetrics_invited / application;
        let pymetrics_participantion_rate = Pymetrics_participated / Pymetrics_invited;
        let pymetrics_pass_rate = Pymetrics_pass / Pymetrics_participated;

        let talentQ_invitation_rate = TalentQ_invited / Pymetrics_pass;
        let talentQ_participation_rate = TalentQ_participated / TalentQ_invited;
        let talentQ_pass_rate = TalentQ_pass / TalentQ_participated;

        let video_invitation_rate = Video_invited / TalentQ_pass;
        let video_participation_rate = Video_participated / Video_invited;
        let video_pass_rate = Video_pass / Video_participated;

        let AC_invitation_rate = AC_invited / Video_pass;
        let AC_participation_rate = AC_participated / AC_invited;//not in excel
        let AC_pass_rate = AC_pass / AC_participated;

        let offer_sent_rate = offer_invited / AC_pass;
        let offer_acceptance_rate = offer_pass / offer_invited;
        

        let legendData = [
            {
                label: 'Application',
                y: application,
                rate: '100%',
                exploded: true
            }, //st here should be the same
            {
                label: 'Invite to Pymetrics',
                y: Pymetrics_invited,
                rate: isNaN(CV_pass_rate) ? 0 + '%' : Math.round(CV_pass_rate * 100) + '%',
                exploded: true
            },
            {
                label: 'Pymetrics Participated',
                y: Pymetrics_participated,
                rate: isNaN(pymetrics_participantion_rate) ? 0 + '%' : Math.round(pymetrics_participantion_rate * 100) + '%',
                exploded: true
            },
            {
                label: 'Pymetrics Passed',
                y: Pymetrics_pass,
                rate: isNaN(pymetrics_pass_rate) ? 0 + '%' : Math.round(pymetrics_pass_rate * 100) + '%',
                exploded: true
            },
            {
                label: 'Invite to TalentQ',
                y: TalentQ_invited,
                rate: isNaN(talentQ_invitation_rate) ? 0 + '%' : Math.round(talentQ_invitation_rate * 100) + '%',
                exploded: true
            },
            {
                label: 'TalentQ Participated',
                y: TalentQ_participated,
                rate: isNaN(talentQ_participation_rate) ? 0 + '%' : Math.round(talentQ_participation_rate * 100) + '%',
                exploded: true
            },
            {
                label: 'TalentQ Passed',
                y: TalentQ_pass,
                rate: isNaN(talentQ_pass_rate) ? 0 + '%' : Math.round(talentQ_pass_rate * 100) + '%',
                exploded: true
            },
            {
                label: 'Invite to VI',
                y: Video_invited,
                rate: isNaN(video_invitation_rate) ? 0 + '%' : Math.round(video_invitation_rate * 100) + '%',
                exploded: true
            },
            {
                label: 'VI Participated',
                y: Video_participated,
                rate: isNaN(video_participation_rate) ? 0 + '%' : Math.round(video_participation_rate * 100) + '%',
                exploded: true
            },
            {
                label: 'VI Passed',
                y: Video_pass,
                rate: isNaN(video_pass_rate) ? 0 + '%' : Math.round(video_pass_rate * 100) + '%',
                exploded: true
            },
            {
                label: 'Invite to AC',
                y: AC_invited,
                rate: isNaN(AC_invitation_rate) ? 0 + '%' : Math.round(AC_invitation_rate * 100) + '%',
                exploded: true
            },
            {
                label: 'AC Participated',
                y: AC_participated,
                rate: isNaN(AC_participation_rate) ? 0 + '%' : Math.round(AC_participation_rate * 100) + '%',
                exploded: true
            },
            {
                label: 'AC Passed',
                y: AC_pass,
                rate: isNaN(AC_pass_rate) ? 0 + '%' : Math.round(AC_pass_rate * 100) + '%',
                exploded: true
            },
            {
                label: 'Offers Sent',
                y: offer_invited,
                rate: isNaN(offer_sent_rate) ? 0 + '%' : Math.round(offer_sent_rate * 100) + '%',
                exploded: true
            },
            {
                label: 'On board',
                y: offer_pass,
                rate: isNaN(offer_acceptance_rate) ? 0 + '%' : Math.round(offer_acceptance_rate * 100) + '%',
                exploded: true
            }
        ];

        //formate data
        // change to one object
        let rateData = {
            'Application': '100%',
            'Invite to Pymetrics': isNaN(CV_pass_rate) ? 0 + '%' : Math.round(CV_pass_rate * 100) + '%',
            'Pymetrics Participated': isNaN(pymetrics_participantion_rate) ? 0 + '%' : Math.round(pymetrics_participantion_rate * 100) + '%',
            'Pymetrics Passed': isNaN(pymetrics_pass_rate) ? 0 + '%' : Math.round(pymetrics_pass_rate * 100) + '%',
            'Invite to Talent Q': isNaN(talentQ_invitation_rate) ? 0 + '%' : Math.round(talentQ_invitation_rate * 100) + '%',
            'TalentQ Participated': isNaN(talentQ_participation_rate) ? 0 + '%' : Math.round(talentQ_participation_rate * 100) + '%',
            'TalentQ Passed': isNaN(talentQ_pass_rate) ? 0 + '%' : Math.round(talentQ_pass_rate * 100) + '%',
            'Invite to Video Interview': isNaN(video_invitation_rate) ? 0 + '%' : Math.round(video_invitation_rate * 100) + '%',
            'Video Interview Participated': isNaN(video_participation_rate) ? 0 + '%' : Math.round(video_participation_rate * 100) + '%',
            'Video Interview Passed': isNaN(video_pass_rate) ? 0 + '%' : Math.round(video_pass_rate * 100) + '%',
            'Invite to AC': isNaN(AC_invitation_rate) ? 0 + '%' : Math.round(AC_invitation_rate * 100) + '%',
            'AC Participated': isNaN(AC_participation_rate) ? 0 + '%' : Math.round(AC_participation_rate * 100) + '%',
            'AC Passed': isNaN(AC_pass_rate) ? 0 + '%' : Math.round(AC_pass_rate * 100) + '%',
            'Offer': isNaN(offer_sent_rate) ? 0 + '%' : Math.round(offer_sent_rate * 100) + '%',
            'On board': isNaN(offer_acceptance_rate) ? 0 + '%' : Math.round(offer_acceptance_rate * 100) + '%',
           
        };

        let amFunnelData = [], canvasFunnelData = [];
        legendData.forEach(element => {
            // if (element.y != 0) {
            canvasFunnelData.push(element);
            amFunnelData.push({
                name: element.label,
                value: element.y,
                rate: element.rate
            })
            // }
        })
        resolve({
            amFunnelData: amFunnelData,
            canvasFunnelData: canvasFunnelData, //not used now 
            legendData: legendData,
            rateData // for debugging purpose
        })
    })
}







