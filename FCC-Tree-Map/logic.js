//Fetch Data from Online Source
let dataset;
async function getData(){
  const response = await fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json');
  const data = await response.json();
  dataset = data; //Object Rather than Array

  drawChart();
};
getData();

//Draw Chart Once Data is Available
function drawChart(){
  const w = 940;
  const h = 640;
  const xPadding = 30;
  const yPadding = 90;

  // console.log(dataset); //DEBUG

//   //Scale Setup
//   const xMaxValue = d3.max(dataset.monthlyVariance, (data) => new Date(data.year, data.month, 1) );
//   const xMinValue = d3.min(dataset.monthlyVariance, (data) => new Date(data.year, data.month, 1) );
//   const xScale = d3.scaleTime()
//                    .domain([xMinValue, xMaxValue])
//                    .range([xPadding, w - xPadding]);

//   const Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//   const yScale = d3.scaleBand()
//                    .domain(Months.reverse())
//                    .range([h - yPadding, yPadding]);

  //Chart Setup
  const chart = d3.select("svg")
                  .classed("design", true)
                  .attr("width", w)
                  .attr("height", h);

  const root = d3.hierarchy(dataset).sum( (data) => data.value );
  // console.log(root); //DEBUG

  d3.treemap().size([w - xPadding, h - yPadding]).padding(0)(root);

  const tiles = chart.append("g")
                     .attr("transform", `translate(${xPadding / 2}, ${yPadding / 2})`)

                     .selectAll('.tile')
                     .data(root.leaves())
                     .enter()
                     .append("rect")
                     .classed("tile", true)

//                      .classed("cell:hover", true)

                     .attr("x", (data) => data.x0 )
                     .attr("y", (data) => data.y0 )
                     .attr("width", (data) => data.x1 - data.x0)
                     .attr("height", (data) => data.y1 - data.y0)

//                      .attr("data-month", (data) => data.month - 1)
//                      .attr("data-year", (data) => data.year)
//                      .attr("data-temp", (data) => Number((8.66 + (data.variance)).toFixed(2)))

                     .attr("stroke", "white")
                     .attr("fill", "blue");

//   //Axis Setup
//   const xAxis = d3.axisBottom(xScale);
//   chart.append("g")
//         .attr("id", "x-axis")
//         .attr("transform", "translate(0, " + (h - yPadding) + ")")
//         .call(xAxis);

//   const yAxis = d3.axisLeft(yScale);
//   chart.append("g")
//         .attr("id", "y-axis")
//         .attr("transform", "translate(" + xPadding + ", 0)")
//         .call(yAxis);

//   //Labels Setup
//   chart.append("text")
//        .attr("id", "title")
//        .attr("x", (w / 2) )
//        .attr("y", 45)
//        .attr("text-anchor", "middle")
//        .classed("title", true)
//        .text("Monthly Global Land-Surface Temperature");

//   chart.append("text")
//        .attr("x", (w / 2) )
//        .attr("y", 70)
//        .attr("text-anchor", "middle")
//        .classed("sub-title", true)
//        .attr("id", "description") //FCC Pass Test, Not Necessary in Function
//        .text("1753 - 2015: Base Temperature 8.66C");

//   chart.append("text")
//        .attr("x", h)
//        .attr("y", -350)
//        .classed("leftLabel", true)
//        .text("Months");

//   chart.append("text")
//        .attr("x", w / 2)
//        .attr("y", h - (yPadding  / 2))
//        .classed("bottomLabel", true)
//        .text("Years");

//   const legend = chart.append("g")
//                       .attr("id", "legend") //FCC Pass Test, Not Necessary in Function
//                       .attr("transform", "translate(90, 690)");

//   legend.append("g")
//         .selectAll("rect")
//         .data([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) //Number of Circles
//         .enter()
//         .append("rect")
//         .attr("x", (data, index) => (index * 35) )
//         .attr("y", 0)
//         .attr("width", 30)
//         .attr("height", 30)
//         .attr("fill", (data) => {
//          if (data === 1) { return "#006AFF" } else
//          if (data === 2) { return "#3288FF" } else
//          if (data === 3) { return "#66A5FF" } else
//          if (data === 4) { return "#99C3FF" } else
//          if (data === 5) { return "#CCE1FF" } else
//          if (data === 6) { return "#FFAD99" } else
//          if (data === 7) { return "#FF8466" } else
//          if (data === 8) { return "#FF5B32" } else
//          if (data === 9) { return "#FF6666" } else
//          if (data === 10) { return "#FF3232" } else
//          if (data === 11) { return "#FF0000" };
//         })
//         .attr("stroke", "black");

//   const subLegend = legend.append("g")
//                           .attr("transform", "translate(0, 50)")
//                           .selectAll("g")
//                           .data([2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8])
//                           .enter()
//                           .append("g")
//                           .attr("transform", "translate(10, 0)");

//   subLegend.append("text")
//            .attr("x", (data, index) => (index * 35) + 10)
//            .attr("y", 0)
//            .text( (data) => data.toFixed(1))

//   drawTooltip();
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
//   const cellsArray = document.querySelectorAll('.cell');
//   for(const el of cellsArray){
//     el.addEventListener('mouseenter', () => {

//       tooltip.setAttribute("data-year", el.dataset.year); //Pass Test #TooltipTests 2 of FCC, Even though it does not affect actual function of chart

//       //Update tooltip Data
//       const updatedParagraph1 = document.createElement('p');
//       updatedParagraph1.appendChild(document.createTextNode(`${el.dataset.year}: ${convertMonth(Number(el.dataset.month))}`));
//       tooltipElement.replaceChild(updatedParagraph1, tooltipElement.childNodes[0]);

//       const updatedParagraph2 = document.createElement('p');
//       updatedParagraph2.appendChild(document.createTextNode(`${el.dataset.temp}`));
//       tooltipElement.replaceChild(updatedParagraph2, tooltipElement.childNodes[1]);

//       const updatedParagraph3 = document.createElement('p');
//       updatedParagraph3.appendChild(document.createTextNode(`${((el.dataset.temp) - 8.66).toFixed(2)+String.fromCharCode(176)}C`));
//       tooltipElement.replaceChild(updatedParagraph3, tooltipElement.childNodes[2]);

//       //Show tooltip @Desired x Position
//       let xPos = Math.round(el.getBoundingClientRect().x);
//       let yPos = Math.round(el.getBoundingClientRect().y);
//       tooltip.classList.remove('noVisibility');
//       tooltip.style.top = `${yPos - 85}px`;
//       tooltip.style.left = `${xPos - 20}px`;

//     });
//     el.addEventListener('mouseleave', () => {
//       tooltip.classList.add('noVisibility');
//     });
//   };
// };