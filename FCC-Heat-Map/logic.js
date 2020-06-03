//Fetch Data from Online Source
let dataset;
async function getData(){
  const response = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json');
  const data = await response.json();
  dataset = data; //Object Rather than Array

  drawChart();
};
getData();

//Draw Chart Once Data is Available
function drawChart(){
  const w = 1500;
  const h = 750;
  const xPadding = 90;
  const yPadding = 90;

// console.log(dataset.monthlyVariance); //DEBUG

  //Scale Setup
  const xMaxValue = d3.max(dataset.monthlyVariance, (data) => new Date(data.year, data.month, 1) );
  const xMinValue = d3.min(dataset.monthlyVariance, (data) => new Date(data.year, data.month, 1) );
  const xScale = d3.scaleTime()
                   .domain([xMinValue, xMaxValue])
                   .range([xPadding, w - xPadding]);

  const Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const yScale = d3.scaleBand()
                   .domain(Months.reverse())
                   .range([h - yPadding, yPadding]);

  //Chart Setup
  const chart = d3.select("svg")
                  .classed("design", true)
                  .attr("width", w)
                  .attr("height", h);

  const bar = chart.selectAll('.bar')
                     .data(dataset.monthlyVariance)
                     .enter()
                     .append("rect")
                     .classed("bar", true)

                     .classed("cell", true) //FCC Pass Test, Not Necessary in Function

                     .attr("x", (data) => xScale(new Date(data.year, 0, 1)) )
                     .attr("y", (data) => yScale(convertMonth(data.month)) )
                     .attr("width", w / 262 )
                     .attr("height", (h - 165) / 12 )

                     .attr("data-month", (data) => data.month)
                     .attr("data-year", (data) => data.year)
                     .attr("data-temp", (data) => Number((8.66 + (data.variance)).toFixed(2)))

                     .attr("fill", (data) => {
                        const temp = Number((8.66 + (data.variance)).toFixed(2));
                        if (temp <= 2.80) { return "firebrick" } else
                        if (temp <= 3.80) { return "blue" } else
                        if (temp <= 5.00) { return "yellow" } else
                        if (temp <= 6.10) { return "green" } else
                        if (temp <= 7.20) { return "purple" } else
                        if (temp <= 8.30) { return "blue" } else
                        if (temp <= 9.50) { return "blue" } else
                        if (temp <= 10.60) { return "blue" } else
                        if (temp <= 11.70) { return "blue" } else
                        if (temp <= 12.80) { return "blue" } else
                        if (temp >= 12.81) { return "blue" };
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
        .call(yAxis);

  //Labels Setup
  chart.append("text")
       .attr("id", "title")
       .attr("x", (w / 2) )
       .attr("y", 45)
       .attr("text-anchor", "middle")
       .classed("title", true)
       .text("Monthly Global Land-Surface Temperature");

  chart.append("text")
       .attr("x", (w / 2) )
       .attr("y", 70)
       .attr("text-anchor", "middle")
       .classed("sub-title", true)
       .attr("id", "description") //FCC Pass Test, Not Necessary in Function
       .text("1753 - 2015: Base Temperature 8.66C");

//   chart.append("text")
//        .attr("x", h - 45)
//        .attr("y", -85)
//        .classed("leftLabel", true)
//        .text("Time in Minutes");

//   chart.append("text")
//        .attr("id", "legend") //Pass fccTest
//        .attr("x", w - xPadding)
//        .attr("y", h / 2)
//        .classed("legendLabel", true)
//        .text("No Doping Allegations");

//   chart.append("rect")
//        .attr("x", (w - xPadding) + 5)
//        .attr("y", (h / 2) - 12)
//        .attr("width", 16)
//        .attr("height", 16)
//        .style("fill", "orange")

//   chart.append("text")
//           .attr("x", w - xPadding)
//           .attr("y", (h / 2) + 20)
//           .classed("legendLabel", true)
//           .text("Riders with Doping Allegations")

//   chart.append("rect")
//        .attr("x", (w - xPadding) + 5)
//        .attr("y", (h / 2) + 8)
//        .attr("width", 16)
//        .attr("height", 16)
//        .style("fill", "firebrick");

//   drawTooltip();
};

function convertMonth(num){
  switch(num){
    case 1:
      return "January";
      break;
    case 2:
      return "February";
      break;
    case 3:
      return "March";
      break;
    case 4:
      return "April";
      break;
    case 5:
      return "May";
      break;
    case 6:
      return "June";
      break;
    case 7:
      return "July";
      break;
    case 8:
      return "August";
      break;
    case 9:
      return "September";
      break;
    case 10:
      return "October";
      break;
    case 11:
      return "November";
      break;
    case 12:
      return "December";
      break;
  };
};

// //Tooltip Component
// const tooltipElement = document.createElement('div');
// const textOne = document.createElement('p');
// const textTwo = document.createElement('p');
// const textThree = document.createElement('p');
// tooltipElement.appendChild(textOne);
// tooltipElement.appendChild(textTwo);
// tooltipElement.appendChild(textThree);
// tooltipElement.setAttribute("id", "tooltip");
// tooltipElement.setAttribute("class", "noVisibility");
// //Append tooltip to body
// const divContainer = document.getElementsByTagName('div')[0];
// divContainer.appendChild(tooltipElement);
// //Selection for tooltip
// const tooltip = document.getElementById('tooltip');

// function drawTooltip(){
//   const plotsArray = document.querySelectorAll('.plot');
//   for(const el of plotsArray){
//     el.addEventListener('mouseenter', () => {
//       el.classList.add('hoverEffect');

//       tooltip.setAttribute("data-year", el.dataset.year); //Pass Test #TooltipTests 2 of FCC, Even though it does not affect actual function of chart

//       //Update tooltip Data
//       const updatedParagraph1 = document.createElement('p');
//       updatedParagraph1.appendChild(document.createTextNode(`${el.dataset.name}: ${el.dataset.nationality}`));
//       tooltipElement.replaceChild(updatedParagraph1, tooltipElement.childNodes[0]);

//       const updatedParagraph2 = document.createElement('p');
//       updatedParagraph2.appendChild(document.createTextNode(`Year: ${el.dataset.xvalue}, Time: ${el.dataset.time}`));
//       tooltipElement.replaceChild(updatedParagraph2, tooltipElement.childNodes[1]);

//       const updatedParagraph3 = document.createElement('p');
//       updatedParagraph3.appendChild(document.createTextNode(`${el.dataset.doping}`));
//       tooltipElement.replaceChild(updatedParagraph3, tooltipElement.childNodes[2]);

//       if(el.dataset.doping === ""){
        
//       };

//       //Show tooltip @Desired x Position
//       let xPos = Math.round(el.getBoundingClientRect().x);
//       let yPos = Math.round(el.getBoundingClientRect().y);
//       tooltip.classList.remove('noVisibility');
//       tooltip.style.top = `${(yPos - 33)}px`;
//       tooltip.style.left = `${xPos + 15}px`;

//     });
//     el.addEventListener('mouseleave', () => {
//       el.classList.remove('hoverEffect');
//       tooltip.classList.add('noVisibility');
//     });
//   };
// };

