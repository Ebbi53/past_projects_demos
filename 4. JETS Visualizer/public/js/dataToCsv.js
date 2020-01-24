let clean_text = (str) => {
	return '"'+str.replace(/"/g, '""');+'"';
};

let exportCSV = (type) => {
	
	//determine the data type
	let firstLabel = "";
	let caption = "";
	let data = {};

	switch(type){ 
		case "export_uni" :
			firstLabel = "University";
			data = remove_empty_bins(info.uniGroup_table).all();
			caption = "Compare By University";
			break;
		case "export_channel" :
			firstLabel = "Recruitment Source";
			data = remove_irrelevent_channel(info.channelGroup_table,channelChart.filters()).all();
			caption = "Compare By Channel";
			break;
		case "export_ac" :
			firstLabel = "AC";
			data = remove_empty_bins(info.acGroup_table).all();
			caption = "Compare By AC";
			break;
	}
	
	let schema = [{label: firstLabel, key: "key "},
	{label: "CV Pass", key: "PymetricsInvited"},
	{label: "Pymetrics Participation", key: "PymetricsParticipated"},
	{label: "Pymetrics Pass", key: "PymetricsPass"},
	{label: "TalentQ Invitation", key: "TalentQInvited"},
	{label: "TalentQ Participation", key: "TalentQParticipated"},
	{label: "TalentQ Pass", key: "TalentQPass"},
	{label: "Video Interview Invitation", key: "VideoInvited"},
	{label: "Video Interview Participation", key: "VideoParticipated"},
	{label: "Video Interview Pass", key: "VideoPass"},
	{label: "AC Invitation", key: "ACInvited"},
	{label: "AC Participation", key: "ACParticipated"},
	{label: "AC Pass", key: "ACPass"},
	{label: "Offer Sent", key: "OfferGiven"},
	{label: "Offer Accepted", key: "OfferAcceptYes"},
	];
	
	let title = [];
	for(var i=0;i<schema.length;i++){
		title.push(schema[i]["label"]);
	}
	title = title.join(",")+"\n";


	console.log(data);

	let rows = [];
	//let rows_table = [];

	for(var i=0;i<data.length;i++){
		var obj = [];
		for(var j=0;j<schema.length;j++){
			if(j==0){
				obj.push(data[i]["key"]);
			}else{
				obj.push(data[i]["value"][schema[j]["key"]]);
			}
			
		}
		
		rows.push("\""+obj.join("\",\"")+"\""); //num to string
		console.log(" of", data.length, "records exporting...");
		//rows_table.push(obj)
	}
	
	//console.log(rows_table)
	rows = rows.join("\n");

	let csv = title + rows;
	//console.log(csv)
	let uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
	let download_link = document.createElement('a');
	download_link.href = uri;
	let ts = new Date().getTime();
	if((caption===undefined?false:caption=="")){
		download_link.download = ts+".csv";
	} else {
		download_link.download = caption+"-"+ts+".csv";
	}
	document.body.appendChild(download_link);
	download_link.click();
	document.body.removeChild(download_link);
	
	//return rows_table
}