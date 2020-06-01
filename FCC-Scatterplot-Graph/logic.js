//Fetch Data from Online Source
let dataset;
async function getData(){
  const response = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json');
  const data = await response.json();
  dataset = [...data];
  drawChart();
};
getData();

//Draw Chart Once Data is Available
function drawChart(){
  const w = 940;
  const h = 600;
  //padding HERe

  //Chart Setup
  const chart = d3.select("svg")
  .classed("design", true)
  .attr("width", w)
  .attr("height", h);

  console.log(dataset);
};