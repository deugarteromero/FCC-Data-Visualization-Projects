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
    //Offset +/- 1 Year for Readability
  const xMaxValue = d3.max(dataset, (data) => new Date(data.Year + 1, 0, 1) );
  const xMinValue = d3.min(dataset, (data) => new Date(data.Year - 1, 0, 1) );
  const xScale = d3.scaleTime()
                   .domain([xMinValue, xMaxValue])
                   .range([xPadding, w - xPadding]);

  const yMaxValue = d3.max(dataset, (data) => {
    const Minutes = Math.floor(data.Seconds / 60);
    const Seconds = data.Seconds - (Minutes * 60);
    return new Date(2020, 4, 31, 5, Minutes, Seconds);
  });
  const yMinValue = d3.min(dataset, (data) => {
    const Minutes = Math.floor(data.Seconds / 60);
    const Seconds = data.Seconds - (Minutes * 60);
    return new Date(2020, 4, 31, 5, Minutes, Seconds);
  });
  const yScale = d3.scaleTime()
                   .domain([yMaxValue, yMinValue])
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
                     .attr("cx", (data) => xScale(new Date(data.Year, 0, 1)) )
                     .attr("cy", (data) => {
                        const Minutes = Math.floor(data.Seconds / 60);
                        const Seconds = data.Seconds - (Minutes * 60);
                        return yScale(new Date(2020, 4, 31, 5, Minutes, Seconds));
                      })
                     .attr("r", 5);

  //Axis Setup
  const xAxis = d3.axisBottom(xScale);
  chart.append("g")
        .attr("id", "x-axis")
        .attr("transform", "translate(0, " + (h - yPadding) + ")")
        .call(xAxis);

  const yAxis = d3.axisLeft(yScale);
  chart.append("g")
        .attr("id", "y-axis")
        .attr("transform", "translate(" + xPadding + ", 0)")
        .call(yAxis.tickFormat(d3.timeFormat("%M:%S"))); //time format must be called on axis

};