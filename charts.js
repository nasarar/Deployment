function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;

    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    //creates an array of the metadata for the freq gauge chart
    var metaFrequency = data.metadata;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samples.filter(sampleObj => sampleObj.id == sample); 

    //grabs the id of the selected filter for the gauge freq chart
    var metadataArray = metaFrequency.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var samples = samplesArray[0];
    
    // creates another variable to hold first sample in the metadata for the array
    var sampleMetadata = metadataArray[0];


    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = samples.otu_ids;
    var otu_labels = samples.otu_labels;
    var sample_values = samples.sample_values;

    var washing = parseFloat(sampleMetadata.wfreq);
    console.log(washing);

    console.log(otu_ids);
    console.log(otu_labels);
    console.log(sample_values);
    // 7. Creates the yticks for the bar chart in reverse order

    var yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      text: otu_labels,
      type: 'bar',
      orientation: 'h'
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Bacterial Cultures: Top 10",
      xaxis: {title: "Sample Values"},
      yaxis: {title: "OTU ID"}
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);


    //CREATES BUBBLE CHART
    //Creates a trace for bubble chart
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker:{
        size: sample_values,
        color: otu_ids,
        colorscale: "Pinkyl"
      }
    }];

    //creates layout for bubble chart
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Sample Values"},
      hovermode: "closest"
    };

    //plots the bubble chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    //CREATES GAUGE CHART
    //creates a trace for the gauge chart
    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: washing,
      title: { text: "Belly Button Washing Frequency"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [null, 10], tickwidth: 1},
        steps: [           
        { range: [0, 2], color: "red" },
        { range: [2, 4], color: "orange" },
        { range: [4, 6], color: "yellow" },
        { range: [6, 8], color: "limegreen" },
        { range: [8, 10], color: "green" }]},
    }];

    var gaugeLayout = {width: 600, height: 500, margin: { t: 0, b: 0 }};

    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
