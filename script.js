


const getJSON = () => {
    var req = new XMLHttpRequest();
    req.open("GET", 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true)
    req.send()
    req.onload = () => {
        const json = JSON.parse(req.responseText)
        // document.getElementById('data').innerHTML = JSON.stringify(json)
        displayData(json)
    }
}

const displayData = (json) => {

const qParse = (date) => {
    const q = date.slice(5, 7)
    if (q === '01') {
        return date.slice(0, 4) + " Q1"
    }
    if (q === '04') {
        return date.slice(0, 4) + " Q2"
    }
    if (q === '07') {
        return date.slice(0, 4) + " Q3"
    }
    if (q === '10') {
        return date.slice(0, 4) + " Q4"
    }
    
}


const title = json["source_name"]
document.getElementById('title').textContent = title

const description = json["description"]
document.getElementById('description').textContent = description

//Set Consts
const parseTime = d3.timeParse("%Y-%m-%d");
const dataset = json['data']
const w = 700 * 1.5
const h = 400 * 1.5
const padding = 80
let dates = [];
dataset.forEach(date => {
    dates.push(parseTime(date[0]))
})
const xDomain = d3.extent(dates)

const tooltip = d3.select("body")
.append("div")
.attr("id", "tooltip")
.style('opacity', 0)


//Scales

const xScale = d3.scaleTime()
.domain(xDomain)
.range([padding, w - padding])



const yScale = d3.scaleLinear()
.domain([0, d3.max(dataset, (d) => d[1])])
.range([h - padding , padding])

//Axises
const xAxis = d3.axisBottom(xScale).ticks(10)
const yAxis = d3.axisLeft(yScale).ticks(10)



//D3 Objects

const svg = d3.select(".container")
.append("svg")
.attr("width", w)
.attr("height", h)

svg.append("g")
.attr("transform", "translate(0, " + (h - padding) + " )")
.attr("id", "x-axis")
.call(xAxis)

svg.append("g")
.attr("transform", "translate(" + (padding) + ",0)")
.attr("id", "y-axis")
.call(yAxis)

svg.selectAll("rect")
.data(dataset)
.enter()
.append("rect")
.attr("class", "bar")
.attr("x", (d) => xScale(parseTime(d[0])))
.attr("y", (d) => yScale(d[1]))
.attr("width", w / dataset.length)
.attr("height", (d) => yScale(0) - yScale(d[1]))
.attr("class", "bar")
.attr("data-date", (d) => d[0])
.attr("data-gdp", (d) => d[1])
.on("mouseover", (event, d) => {
    tooltip
    .style('opacity', 0.9)
    .html(
        "Year: " + qParse(d[0]) + " GDP: $" + d[1]
    )
        .style("top", `${event.pageY - 20}px`)
        .style("left", `${event.pageX + 20}px`)
        .attr("data-date", d[0]);


})
.on("mouseout", function(event, d) {
    tooltip
      
      .style("opacity", 0);
  });

  svg.append("text")      // text label for the x axis
  .attr("x", w / 2)
  .attr("y", h - 30)
  .style("text-anchor", "middle")
  .text("Date");

  svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", padding - 53)
        .attr("x", 0 - (h / 2))
        .style("text-anchor", "middle")
        .text("$ Billions of Dollars");

  const source = d3.select(".container")
  .append("div")
  .html("Source: " + json['display_url'])
  .attr("class", "source")



const tick = d3.selectAll("tick")
tick.attr("class", "tick")


}

document.addEventListener("DOMContentLoaded", getJSON())