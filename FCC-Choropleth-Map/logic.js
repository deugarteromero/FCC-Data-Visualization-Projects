//Fetch Data from Online Source
let datasetEducation;
let mapData;
async function getData(){
  const response = await fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json');
  const data = await response.json();
  datasetEducation = [...data];

  const response2 = await fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json');
  const data2 = await response2.json();
  mapData = data2;

  drawChart();
};
getData();

//Draw Chart Once Data is Available
function drawChart(){
  const w = 1500;
  const h = 750;
  const padding = 90;

  //Path Setup
  const path = d3.geoPath();

  //Geo Setup of Counties with topojson
  const mapDataCounties = topojson.feature(mapData, mapData.objects.counties).features;
  
  //Chart Setup
  const chart = d3.select("svg")
                  .classed("design", true)
                  .attr("width", w)
                  .attr("height", h);

  const county = chart.append("g")
                      .attr("transform", () => {
                        return `translate(${w / 6}, ${h / 6})`;
                      })

                      .selectAll(".county")
                      .data(mapDataCounties)
                      .enter()
                      .append("path")
                      .classed("county", true)
                      .attr("d", path)

                      .attr("data-fips", (data) => {
                        return data.id
                      })
                      .attr("data-education", (data) => {
                        const result = datasetEducation.filter( (el) => {
                          return data.id === el.fips;
                        });
                        return result[0].bachelorsOrHigher;
                      })
                      .attr("data-county", (data) => {
                        const result = datasetEducation.filter( (el) => {
                          return data.id === el.fips;
                        });
                        return result[0].area_name;
                      })
                      .attr("data-state", (data) => {
                        const result = datasetEducation.filter( (el) => {
                          return data.id === el.fips;
                        });
                        return result[0].state;
                      })

                      .attr("fill", (data) => {
                        const result = datasetEducation.filter( (el) => {
                          return data.id === el.fips;
                        });
                        let percent = result[0].bachelorsOrHigher;
                        if (percent <=   3) { return "#FFFFFF" } else
                        if (percent <=  12) { return "#E5F5E0" } else
                        if (percent <=  21) { return "#C7E9C0" } else
                        if (percent <=  30) { return "#A1D99B" } else
                        if (percent <=  39) { return "#74C476" } else
                        if (percent <=  48) { return "#41AB5D" } else
                        if (percent <=  57) { return "#238B45" } else
                        if (percent <=  66) { return "#006D2C" } else
                        if (percent <= 100) { return "#00441B" };
                      });

  //Labels Setup
  chart.append("text")
       .attr("id", "title")
       .attr("x", (w / 2) )
       .attr("y", 75)
       .attr("text-anchor", "middle")
       .classed("title", true)
       .text("United States Educational Attainment");

  chart.append("text")
       .attr("x", (w / 2) )
       .attr("y", 110)
       .attr("text-anchor", "middle")
       .classed("sub-title", true)
       .attr("id", "description") //FCC Pass Test, Not Necessary in Function
       .text("Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)");

  chart.append("text")
       .attr("x", w - padding)
       .attr("y", h - (padding / 2))
       .classed("bottomLabel", true)
       .text("Source: USDA Economic Research Service"); //NEED URL

  //Legend Setup
  const legend = chart.append("g")
                      .attr("id", "legend") //FCC Pass Test, Not Necessary in Function
                      .attr("transform", `translate(${(w / 2) + 100}, 150)`); //ADJUST

  legend.selectAll("rect")
        .data([3, 12, 21, 30, 39, 48, 57, 66]) //Number of Circles
        .enter()
        .append("rect")
        .attr("x", (data, index) => (index * 30) )
        .attr("y", 0)
        .attr("width", 30)
        .attr("height", 10)
        .attr("fill", (data) => {
          if (data <=  12) { return "#E5F5E0" } else
          if (data <=  21) { return "#C7E9C0" } else
          if (data <=  30) { return "#A1D99B" } else
          if (data <=  39) { return "#74C476" } else
          if (data <=  48) { return "#41AB5D" } else
          if (data <=  57) { return "#238B45" } else
          if (data <=  66) { return "#006D2C" } else
          if (data <= 100) { return "#00441B" };
        })

  const individual = legend.selectAll(".tick")
                           .data([3, 12, 21, 30, 39, 48, 57, 66])
                           .enter()
                           .append("g")
                           .classed("tick", true);

  individual.append("text")
            .attr("x", (data, index) => index * 30)
            .attr("y", 20)
            .text( (data) => {
              return `${data}%`;
            });

  // individual.append("line")
  //           .attr("y2", 15)
  //           .attr("stroke", "black")

  drawTooltip();
};

//Tooltip Component
const tooltipElement = document.createElement('div');
const textOne = document.createElement('p');
tooltipElement.appendChild(textOne);
tooltipElement.setAttribute("id", "tooltip");
tooltipElement.setAttribute("class", "noVisibility");
//Append tooltip to body
const divContainer = document.getElementsByTagName('div')[0];
divContainer.appendChild(tooltipElement);
//Selection for tooltip
const tooltip = document.getElementById('tooltip');

function drawTooltip(){
  const countyArray = document.querySelectorAll('.county');
  for(const el of countyArray){
    el.addEventListener('mouseenter', () => {

      tooltip.setAttribute("data-education", el.dataset.education); //Pass Test #TooltipTests 2 of FCC, Even though it does not affect actual function of chart

      //Update tooltip Data
      const updatedParagraph1 = document.createElement('p');
      updatedParagraph1.appendChild(document.createTextNode(`${el.dataset.county}, ${el.dataset.state}: ${el.dataset.education}%`)); //ADJUST
      tooltipElement.replaceChild(updatedParagraph1, tooltipElement.childNodes[0]);

      //Show tooltip @Desired x Position
      let xPos = Math.round(el.getBoundingClientRect().x);
      let yPos = Math.round(el.getBoundingClientRect().y);
      tooltip.classList.remove('noVisibility');
      tooltip.style.top = `${yPos - 20}px`;
      tooltip.style.left = `${xPos + 20}px`;

    });
    el.addEventListener('mouseleave', () => {
      tooltip.classList.add('noVisibility');
    });
  };
};