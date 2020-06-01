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
  console.log(dataset);
};