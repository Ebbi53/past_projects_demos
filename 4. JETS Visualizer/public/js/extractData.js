 let extractData =(data) => {
    return new Promise((resolve, reject) => {
        let mycrossfilter = crossfilter(data); //dataset

        //custom reduce function. p is return object, v is current object
        let reduceAdd = () => {
                return (p, v) => {
                //console.log(v.PymetricsPass);
                p["Applicants"]+=1;

                p["PymetricsPass"] += +v.PymetricsPass;
                p["PymetricsFail"] += + v.PymetricsFail;
                p["PymetricsAbsence"]  += + v.PymetricsAbsence;
                p["PymetricsInvited"] += +(v.PymetricsPass + v.PymetricsFail+ v.PymetricsAbsence)
                p["PymetricsParticipated"] += +(v.PymetricsPass+ v.PymetricsFail);

                p["TalentQPass"]  += + v.TalentQPass;
                p["TalentQFail"]  += + v.TalentQFail;
                p["TalentQAbsence"]  += + v.TalentQAbsence;
                p["TalentQInvited"] += + (v.TalentQPass+ v.TalentQFail + v.TalentQAbsence)
                p["TalentQParticipated"] += +( v.TalentQPass+ v.TalentQFail);
                //console.log(p["TalentQInvited"],p["TalentQParticipated"]);

                p["VideoPass"] += + v.VideoPass;
                p["VideoFail"] += + v.VideoFail;
                p["VideoAbsence"] += +v.VideoAbsence;
                p["VideoInvited"] += + (v.VideoPass+ v.VideoFail +v.VideoAbsence)
                p["VideoParticipated"] += + (v.VideoPass+ v.VideoFail);

                p["ACPass"] += + v.ACPass;
                p["ACFail"] += + v.ACFail;
                p["ACAbsence"] += + v.ACAbsence;
                p["ACInvited"] +=  + (v.ACPass+ v.ACFail+ v.ACAbsence)
                p["ACParticipated"] += + (v.ACPass+ v.ACFail);;

                p["OfferAcceptYes"] += +v.OfferAcceptYes;
                p["OfferAcceptNo"] += +v.OfferAcceptNo;
                p["OfferGiven"]+=+(v.OfferAcceptYes+v.OfferAcceptNo);
                

                return p;
            }
        }

         let reduceRemove = () => {
                return (p, v) => { 
                p["Applicants"]-=1;
                p["PymetricsPass"] -= v.PymetricsPass;
                p["PymetricsFail"] -= v.PymetricsFail;
                p["PymetricsAbsence"] -= v.PymetricsAbsence;
                p["PymetricsInvited"] -= (v.PymetricsPass + v.PymetricsFail+ v.PymetricsAbsence)
                p["PymetricsParticipated"] -= (v.PymetricsPass+ v.PymetricsFail);

                p["TalentQPass"] -= v.TalentQPass;
                p["TalentQFail"] -= v.TalentQFail;
                p["TalentQAbsence"] -= v.TalentQAbsence;
                p["TalentQInvited"] -=  (v.TalentQPass+ v.TalentQFail + v.TalentQAbsence)
                p["TalentQParticipated"] -= ( v.TalentQPass+ v.TalentQFail);

                p["VideoPass"]-= v.VideoPass;
                p["VideoFail"]-= v.VideoFail;
                p["VideoAbsence"]-= v.VideoAbsence;
                p["VideoInvited"] -=  (v.VideoPass+ v.VideoFail +v.VideoAbsence)
                p["VideoParticipated"] -=  (v.VideoPass+ v.VideoFail);

                p["ACPass"]-= v.ACPass;
                p["ACFail"]-= v.ACFail;
                p["ACAbsence"]-= v.ACAbsence;
                p["ACInvited"] -=   (v.ACPass+ v.ACFail+ v.ACAbsence)
                p["ACParticipated"] -=  (v.ACPass+ v.ACFail)

                p["OfferAcceptYes"]-= v.OfferAcceptYes;
                p["OfferAcceptNo"] -= v.OfferAcceptNo;
                p["OfferGiven"]-=(v.OfferAcceptYes+v.OfferAcceptNo);
                
                return p;
            }

         }

    
        let reduceInitial = () => {
            return {
                Applicants:0,
                PymetricsPass:0,
                PymetricsFail:0,
                PymetricsAbsence:0,
                PymetricsInvited:0,
                PymetricsParticipated:0,

                TalentQPass:0,
                TalentQFail:0,
                TalentQAbsence:0,
                TalentQInvited:0,
                TalentQParticipated:0,

                VideoPass:0,
                VideoFail:0,
                VideoAbsence:0,
                VideoInvited:0,
                VideoParticipated:0,

                ACPass:0,
                ACFail:0,
                ACAbsence:0,
                ACInvited:0,
                ACParticipated:0,

                OfferAcceptYes:0,
                OfferAcceptNo:0,
                OfferGiven:0,
               
            };
        }

        //get dimension
      let getAC = () => {
            return d=> d["Career_Info_Availability_For_Interview"];
        }

        let getChannel = () => {
            let src = [];
            return (d) => {
                if(d["Recruitment_Source"].includes(",")){//when the applicant has more than one dimension
                    src= d["Recruitment_Source"].split(',');
                    return src; 
                }else{//when the applicant has one dimension
                    src=d["Recruitment_Source"];
                    return [src]; //need to return as array
                }
            }
        }

       let getUni = () => {
                return  (d) => {
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

        let acDimension = mycrossfilter.dimension(getAC());
        let acDimension2 = mycrossfilter.dimension(getAC());
        
        //Group by AC. Group keys are ACs.
        let acGroup = acDimension.group().reduceCount();
        let acGroup_table = acDimension2.group().reduce(reduceAdd(),reduceRemove(), reduceInitial);

        let channelDimension = mycrossfilter.dimension(getChannel(),true);
        let channelDimension2 = mycrossfilter.dimension(getChannel(),true);
        //Group by Promotional Channel. Group keys are Promotional Channels.
        let channelGroup = channelDimension.group().reduceCount();
        let channelGroup_table = channelDimension2.group().reduce(reduceAdd(),reduceRemove(), reduceInitial);
        //let channel_elements = d3.set(data.map(function (item) { return item["Recruitment_Source"]; })).values();




        let uniDimension = mycrossfilter.dimension(getUni());
        let uniDimension2 = mycrossfilter.dimension(getUni());
        //Group by university. Group keys are univwesities.
        let uniGroup = uniDimension.group().reduceCount();
        let uniGroup_table = uniDimension2.group().reduce(reduceAdd(),reduceRemove(), reduceInitial);



        resolve({
            uniDimension: uniDimension,
            uniGroup: uniGroup,
            uniGroup_table:uniGroup_table,
            channelDimension: channelDimension,
            channelGroup: channelGroup,
            channelGroup_table:channelGroup_table,
            acDimension: acDimension,
            acGroup:acGroup,
            acGroup_table:acGroup_table,
            mycrossfilter:mycrossfilter,
            filteredData:  mycrossfilter.allFiltered()
        })
    })
}
