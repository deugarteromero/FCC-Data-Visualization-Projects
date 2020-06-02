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
                     .classed("dot", true) //Only to Pass fccTest, I prefer plot
                     .attr("cx", (data) => xScale(new Date(data.Year, 0, 1)) )
                     .attr("cy", (data) => {
                        const Minutes = Math.floor(data.Seconds / 60);
                        const Seconds = data.Seconds - (Minutes * 60);
                        return yScale(new Date(2020, 4, 31, 5, Minutes, Seconds));
                      })
                     .attr("data-xvalue", (data) => data.Year)
                     .attr("data-yvalue", (data) => {
                        const Minutes = Math.floor(data.Seconds / 60);
                        const Seconds = data.Seconds - (Minutes * 60);
                        return new Date(2020, 4, 31, 5, Minutes, Seconds);
                      })
                     .attr("data-name", (data) => data.Name)
                     .attr("data-nationality", (data) => data.Nationality)
                     .attr("data-time", (data) => data.Time)
                     .attr("data-year", (data) => data.Year)
                     .attr("data-doping", (data) => data.Doping)
                     .attr("r", 5)
                     .attr("fill", (data) => {
                       if(data.Doping){
                         return "firebrick";
                       } else {
                         return "orange";
                       };
                     });

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

  //Labels Setup
  chart.append("text")
       .attr("id", "title")
       .attr("x", (w / 2) )
       .attr("y", xPadding - 15)
       .attr("text-anchor", "middle")
       .classed("title", true)
       .text("Doping in Professional Bicycle Racing");

  chart.append("text")
       .attr("x", (w / 2) )
       .attr("y", xPadding + 10)
       .attr("text-anchor", "middle")
       .classed("sub-title", true)
       .text("35 Fastest times up Alpe d'Huez");

  chart.append("text")
       .attr("x", h - 45)
       .attr("y", -85)
       .classed("leftLabel", true)
       .text("Time in Minutes");

  chart.append("text")
       .attr("id", "legend") //Pass fccTest
       .attr("x", w - xPadding)
       .attr("y", h / 2)
       .classed("legendLabel", true)
       .text("No Doping Allegations");

  chart.append("rect")
       .attr("x", (w - xPadding) + 5)
       .attr("y", (h / 2) - 12)
       .attr("width", 16)
       .attr("height", 16)
       .style("fill", "orange")

  chart.append("text")
          .attr("x", w - xPadding)
          .attr("y", (h / 2) + 20)
          .classed("legendLabel", true)
          .text("Riders with Doping Allegations")

  chart.append("rect")
       .attr("x", (w - xPadding) + 5)
       .attr("y", (h / 2) + 8)
       .attr("width", 16)
       .attr("height", 16)
       .style("fill", "firebrick");

  drawTooltip();
};

//Tooltip Component
const tooltipElement = document.createElement('div');
const textOne = document.createElement('p');
const textTwo = document.createElement('p');
const textThree = document.createElement('p');
tooltipElement.appendChild(textOne);
tooltipElement.appendChild(textTwo);
tooltipElement.appendChild(textThree);
tooltipElement.setAttribute("id", "tooltip");
tooltipElement.setAttribute("class", "noVisibility");
//Append tooltip to body
const divContainer = document.getElementsByTagName('div')[0];
divContainer.appendChild(tooltipElement);
//Selection for tooltip
const tooltip = document.getElementById('tooltip');

function drawTooltip(){
  const plotsArray = document.querySelectorAll('.plot');
  for(const el of plotsArray){
    el.addEventListener('mouseenter', () => {
      el.classList.add('hoverEffect');

      tooltip.setAttribute("data-year", el.dataset.year); //Pass Test #TooltipTests 2 of FCC, Even though it does not affect actual function of chart

      //Update tooltip Data
      const updatedParagraph1 = document.createElement('p');
      updatedParagraph1.appendChild(document.createTextNode(`${el.dataset.name}: ${el.dataset.nationality}`));
      tooltipElement.replaceChild(updatedParagraph1, tooltipElement.childNodes[0]);

      const updatedParagraph2 = document.createElement('p');
      updatedParagraph2.appendChild(document.createTextNode(`Year: ${el.dataset.xvalue}, Time: ${el.dataset.time}`));
      tooltipElement.replaceChild(updatedParagraph2, tooltipElement.childNodes[1]);

      const updatedParagraph3 = document.createElement('p');
      updatedParagraph3.appendChild(document.createTextNode(`${el.dataset.doping}`));
      tooltipElement.replaceChild(updatedParagraph3, tooltipElement.childNodes[2]);

      if(el.dataset.doping === ""){
        
      };

      //Show tooltip @Desired x Position
      let xPos = Math.round(el.getBoundingClientRect().x);
      let yPos = Math.round(el.getBoundingClientRect().y);
      tooltip.classList.remove('noVisibility');
      tooltip.style.top = `${(yPos - 33)}px`;
      tooltip.style.left = `${xPos + 15}px`;

    });
    el.addEventListener('mouseleave', () => {
      el.classList.remove('hoverEffect');
      tooltip.classList.add('noVisibility');
    });
  };
};