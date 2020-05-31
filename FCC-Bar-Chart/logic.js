//Fetch Data from Online Source
let dataset;
async function getData(){
  const response = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json');
  const data = await response.json();
  dataset = [...data.data];
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
  const xMaxValue = d3.max(dataset, (data) => new Date(data[0]) );
  const xMinValue = d3.min(dataset, (data) => new Date(data[0]) ); //Need to Avoid 1970 Start Rule
  const yMaxValue = d3.max(dataset, (data) => data[1] );

  const xScale = d3.scaleTime()
                   .domain([xMinValue, xMaxValue]) //Make 0 a 'date'?
                   .range([xPadding, w - xPadding]);

  const yScale = d3.scaleLinear()
                   .domain([0, yMaxValue ])
                   .range([h - yPadding, yPadding]);

  //Chart Setup
  const chart = d3.select("svg")
              .classed("design", true)
              .attr("width", w)
              .attr("height", h);

  const bars = chart.selectAll(".bar")
              .data(dataset)
              .enter()
              .append("rect")
              .classed("bar", true)
              .attr("x", (data, index) => (index * ((w - (xPadding * 2))/275)) + xPadding ) //Making Sure Data Points on X start @Padding
              .attr("y", (data) => yScale(data[1]) )
              .attr("width", (w - (xPadding * 2)) / 275 ) //Total Width Divided by Number of Data Points to Calculate Exact width of Bars to fill Chart Evenly
              .attr("height", (data) => (h - yPadding) - yScale(data[1]) )
              .attr("data-date", (data) => data[0])
              .attr("data-gdp", (data) => data[1])
              .classed("bar:hover", true);

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
       .attr("id", "title") //Just to Pass Tests XD, I used mainly classes in .classed()
       .attr("x", (w / 2) )
       .attr("y", xPadding)
       .attr("text-anchor", "middle")
       .classed("title", true)
       .text("United States GDP");

  chart.append("text")
       .attr("x", h + 35)
       .attr("y", -85)
       .classed("leftLabel", true)
       .text("Gross Domestic Product");

  chart.append("text")
       .attr("x", w - xPadding)
       .attr("y", h - 40)
       .classed("bottomLabel", true)
       .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf");
     
  drawTooltip();
};

//Tooltip Component
const tooltipElement = document.createElement('div');
const textOne = document.createElement('p');
const textTwo = document.createElement('p');
tooltipElement.appendChild(textOne);
tooltipElement.appendChild(textTwo);
tooltipElement.setAttribute("id", "tooltip");
tooltipElement.setAttribute("class", "noVisibility");
//Append tooltip to body
const divContainer = document.getElementsByTagName('div')[0];
divContainer.appendChild(tooltipElement);
//Selection for tooltip
const tooltip = document.getElementById('tooltip');

function drawTooltip(){
  const barsArray = document.querySelectorAll('.bar');

  //Get xPos from svg container to determine tooltip x position of bars
  const xPosSVG = document.getElementsByTagName('svg')[0].getBoundingClientRect().x;

  for(const el of barsArray){
    el.addEventListener('mouseenter', () => {
      el.classList.add('hoverEffect');

      tooltip.setAttribute("data-date", el.dataset.date); //Pass Test 13 of FCC, Even though it does not affect actual function of chart

      //Update tooltip Data
      let resultDate = tooltipFormatDate(el.dataset.date);
      const updatedParagraph1 = document.createElement('p');
      updatedParagraph1.appendChild(document.createTextNode(resultDate));
      tooltipElement.replaceChild(updatedParagraph1, tooltipElement.childNodes[0]);

      let resultGdp = tooltipFormatGdp(el.dataset.gdp);
      const updatedParagraph2 = document.createElement('p');
      updatedParagraph2.appendChild(document.createTextNode(resultGdp));
      tooltipElement.replaceChild(updatedParagraph2, tooltipElement.childNodes[1]);

      //Show tooltip @Desired x Position
      let xPos = Math.round(el.getBoundingClientRect().x);
      tooltip.classList.remove('noVisibility');
      tooltip.style.left = `${(xPos - xPosSVG) + 30}px`;

    });
    el.addEventListener('mouseleave', () => {
      el.classList.remove('hoverEffect');
      tooltip.classList.add('noVisibility');
    });
  };
};

function tooltipFormatDate(date){
  const getYearFromDate = date.split("-")[0];
  const getMonthFromDate = date.split("-")[1];

  const numberMonth = Number(getMonthFromDate);
  let quarter;
  switch(numberMonth){
    case 1:
      quarter = "Q1";
      break;
    case 4:
      quarter = "Q2";
      break;
    case 7:
      quarter = "Q3";
      break;
    case 10:
      quarter = "Q4";
      break;
    default:
      console.log("Error: 4201");
  };

  return `${getYearFromDate} ${quarter}`;
};

function tooltipFormatGdp(gdp){
  let gdpCommaAddition = gdp.replace(/\d{1,3}(?=(\d{3})+(?=\.))/g, "$&,");
  return `$${gdpCommaAddition} Billion`;
};