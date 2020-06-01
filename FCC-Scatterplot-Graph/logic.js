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
  const xPadding = 60;
  const yPadding = 90;

  //Scale Setup
  const xMaxValue = d3.max(dataset, (data) => data.Year );
  const xMinValue = d3.min(dataset, (data) => data.Year );

  const yMaxValue = d3.max(dataset, (data) => (data.Seconds / 60) );
  console.log(Number(yMaxValue.toFixed(2)));

  const xScale = d3.scaleLinear()
                   .domain([xMinValue, xMaxValue])
                   .range([xPadding, w - xPadding]);

  const yScale = d3.scaleLinear()
                   .domain([0, Number(yMaxValue.toFixed(2))])
                   .range([h - yPadding, yPadding]);

  //Chart Setup
  const chart = d3.select("svg")
  .classed("design", true)
  .attr("width", w)
  .attr("height", h);

  const plots = chart.selectAll('.plot')
                     .data(dataset)
                     .enter()
                     .append("circle")
                     .classed("plot", true)
                     .attr("cx", (data) => xScale(data.Year) ) //C
                     .attr("cy", (data) => yScale(data.Seconds / 60) ) //C
                     .attr("r", 5); //C


  console.log(dataset);
};