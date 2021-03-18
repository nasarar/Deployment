function init(){
    // selects the dropdown menu from index.html
    var selector = d3.select("#selDataset");

    // reads the samples.json file and assigns into 'data' object
    d3.json("samples.json").then((data) =>{
        console.log(data);

        //passes 'sample' as the argument for ID number
        var sampleNames = data.names;
        sampleNames.forEach((sample) =>{
            selector.append("option").text(sample).property("value", sample);
        });
    })};

// function not called on <select id="selDataset">
function optionChanged(newSample){
    buildMetadata(newSample);
    buildCharts(newSample);
}

function buildMetadata(sample){
    d3.json("samples.json").then((data)=> {
    //grabs the metadata from the samples file
    var metadata = data.metadata;

    //filters the metadata for only the matching ID and grabs the first result
    var resultsArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultsArray[0];

    //assigns PANEL variable for the div class with ID 'sample-metadata'
    var PANEL = d3.select("#sample-metadata");

    PANEL.html(""); //ensures that the content is cleared
    //adds the result into demographic info
    PANEL.append("h6").text("ID: "+ result.id);
    PANEL.append("h6").text("ETHINICTY: "+ result.ethnicity);
    PANEL.append("h6").text("GENDER: "+ result.gender);
    PANEL.append("h6").text("AGE: "+ result.age);
    PANEL.append("h6").text("LOCATION: "+ result.location);
    PANEL.append("h6").text("BBtype: "+ result.bbtype);
    PANEL.append("h6").text("WFREQ: "+result.wfreq);
    
    
    });

// function buildCharts(sample){
//     d3.json("samples.json").then((data)=> {
//     //grabs the metadata from the samples file
//     var metadata = data.metadata;

//     //filters the metadata for only the matching ID and grabs the first result
//     var resultsArray = metadata.filter(sampleObj => sampleObj.id == sample);
//     var result = resultsArray[0];

//     //assigns PANEL variable for the div class with ID 'sample-metadata'
//     var PANEL = d3.select("#sample-metadata");

//     PANEL.html(""); //ensures that the content is cleared
//     PANEL.append("h6").text(result.location);
//     });


}


init();