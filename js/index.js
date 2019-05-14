(function() {
    let data = ""; // keep data in global scope
    let svgContainer = ""; // keep SVG reference in global scope
    let trendLine = "";
  
    // load data and make scatter plot after window loads
    window.onload = function() {
      // TODO: use d3 select, append, and attr to append a 500x500 SVG to body
      svgContainer = d3.select('body').append('svg')
        .attr('width', 800)
        .attr('height', 500);
  
      svgContainer.append('text')
        .attr('x', 150)
        .attr('y', 20)
        .text('Average Viewship By Season')
        .style("font-size", "25px");

  
      // TODO: use d3.csv to load in Admission Predict data and then call the
      // makeScatterPlot function and pass it the data
      // d3.csv is basically fetch but it can be be passed a csv file as a parameter
      // https://www.tutorialsteacher.com/d3js/loading-data-from-file-in-d3js
      d3.csv('data/data2.csv')
        .then((data) => makeBarChart(data));
    }
    function makeBarChart(csvData) {

        data = csvData; 
        c = d3.scaleOrdinal()
        .domain(["Estimated", "Actual"])
        .range(["#66CDAA","#1f78b4"]);
        // let color = d3.scale.category10();

      // get an array of gre scores and an array of chance of admit
        let avgViewers = data.map((row) => parseInt(row['Avg. Viewers (mil)']));
        let viewers = data.map((row) => parseInt(row['Viewers (mil)']));

        console.log(avgViewers)
        let year = data.map((row) => parseInt(row['Year']));
        console.log(year)

    
        let axesLimits = findMinMax(year, avgViewers);
        console.log(axesLimits);
        let mapFunctions = drawTicks(axesLimits);
        console.log(mapFunctions);
       // TODO: go to plotData function and fill it out
        plotData(mapFunctions,c);

        genderLegend(c)

        let average = getAverage(avgViewers)
        
        trendLine = svgContainer.selectAll('.trendLine')
            .data(data)
            .enter()
            .append('line')
                .attr('x1', mapFunctions.xScale(1989.35))
                .attr("y1", mapFunctions.yScale(13.5))
                .attr("x2",mapFunctions.xScale(2015))
                .attr("y2", mapFunctions.yScale(13.5))
                .attr('stroke', 'black')
                .attr('stroke-width', 2)
                .style("opacity", 0.02)
        
           
        svgContainer.selectAll(".textline")        
        .data(data)
        .enter()
        .append("text")
            .attr("class","label")
            .attr("x", mapFunctions.xScale(1990.5))
            .attr("y", mapFunctions.yScale(14))
            // .attr("dx", ".75em")
            .style('text-anchor', "middle")
            .text("13.5")
            .style("opacity", 0.05)
            .style("font-size", "25px")

            
 


    
        // // plot the trend line using gre scores, admit rates, axes limits, and
        // // scaling + mapping functions
        // plotTrendLine(greScores, admissionRates, axesLimits, mapFunctions);
    
      }

      function getAverage(feature) {
        let total = 0;

        // note that incrementing total is done within the for loop
        // for(let i = 0, l = feature.length; i < l; total += feature[i], i++);
  
        // let average = total / feature.length;

        average = d3.mean(feature)
        console.log("AVERAGE: " + average)

        return average
          
      }
      function findMinMax(year, avgViewers) {

        // TODO: Use d3.min and d3.max to find the min/max of the greScores array
        let yearMin = d3.min(year);
        let yearMax = d3.max(year);
    
        // round x-axis limits
        yearMax = Math.round(yearMax*10)/10;
        yearMin = Math.round(yearMin*10)/10;
    
        console.log(yearMin, yearMax);
    
        // TODO: Use d3.min and d3.max to find the min/max of the  admissionRates array
    
        let viewerMin = d3.min(avgViewers);
        let viewerMax = d3.max(avgViewers);
    
        // round y-axis limits to nearest 0.05
        viewerMax = Number((Math.ceil(viewerMax*20)/20).toFixed(2));
        viewerMin = Number((Math.ceil(viewerMin*20)/20).toFixed(2));
    
        // return formatted min/max data as an object
        return {
          viewerMin : viewerMin,
          viewerMax : viewerMax,
          yearMin : yearMin,
          yearMax : yearMax
        }
    
      }
      function drawTicks(limits) {
        // return gre score from a row of data
        let xValue = function(d) { return d["Year"]; }
        console.log(xValue)
    
        // TODO: Use d3 scaleLinear, domain, and range to make a scaling function. Assign
        // the function to variable xScale. Use a range of [50, 450] and a domain of
        // [limits.greMin - 5, limits.greMax]
        // See here for more details:
        // https://www.tutorialsteacher.com/d3js/scales-in-d3
        let xScale = d3.scaleLinear()
          .domain([limits.yearMin - .7, limits.yearMax + 1])
          .range([50, 700]);

    
        // xMap returns a scaled x value from a row of data
        let xMap = function(d) { return xScale(xValue(d)); };
    
        // TODO: Use d3 axisBottom and scale to make the x-axis and assign it to xAxis
        // xAxis will be a function
        // See here for more details:
        // https://www.tutorialsteacher.com/d3js/axes-in-d3
        let xAxis = d3.axisBottom()
          .scale(xScale)
          .tickFormat(d3.format("d"))
          .ticks(20)
    
        // TODO: use d3 append, attr, and call to append a "g" element to the svgContainer
        // variable and assign it a 'transform' attribute of 'translate(0, 450)' then
        // call the xAxis function
        svgContainer.append('g')
          .attr('transform', 'translate(0, 450)')
          .call(xAxis)
        .selectAll("text")
          .attr("y", 0)
          .attr("x", -20)
          .attr("dy", ".35em")
          .attr("transform", "rotate(-90)")

    
        svgContainer.append('text')
          .attr('x', 350)
          .attr('y', 500)
          .text('Year')
          .style("font-size", "15px");

    
        // return Chance of Admit from a row of data
        let yValue = function(d) { return +d["Avg. Viewers (mil)"]}
    
        // TODO: make a linear scale for y. Use a domain of [limits.admitMax, limits.admitMin - 0.05]
        // Use a range of [50, 450]
    
        let yScale = d3.scaleLinear()
          .domain([limits.viewerMax + 3, limits.viewerMin -6])
          .range([50, 450]);
    
        // yMap returns a scaled y value from a row of data
        let yMap = function (d) { return yScale(yValue(d)); };
    
        // TODO: use axisLeft and scale to make the y-axis and assign it to yAxis
        let yAxis = d3.axisLeft().scale(yScale);
    
        // TODO: append a g element to the svgContainer
        // assign it a transform attribute of 'translate(50, 0)'
        // lastly, call the yAxis function on it
        svgContainer.append('g')
          .attr('transform', 'translate(50, 0)')
          .call(yAxis);
    
        svgContainer.append('text')
          .attr('transform', 'translate(15, 350)rotate(-90)')
          .text('Average Viewers (in millions)')
          .style("font-size", "15px");

        // return mapping and scaling functions
        return {
          x: xMap,
          y: yMap,
          xScale: xScale,
          yScale: yScale
        };
    
      }
      function plotData(map, c) {
        let xMap = map.x;
        let yMap = map.y;
    
        // append data to SVG and plot as points
        // Use the selectAll, data, enter, append, and attr functions to plot all
        // the data points. selectAll should be passed a parameter '.dot'
        // data should be passed the global data variable as a parameter
        // The points should have attributes:
        // 'cx' -> xMap
        // 'cy' -> yMap
        // 'r' -> 3
        // 'fill' -> #4286f4
        // See here for more details:
        // https://www.tutorialsteacher.com/d3js/data-binding-in-d3js
        toolTip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
        
        let rect = svgContainer.selectAll('rect')
          .data(data)
          .enter()
          .append('rect')
            .attr('x', (d) => xMap(d) - 10)
            .attr('y', yMap)
            .attr('width', 23)
            .attr('height', (d) => 450 - yMap(d))
            .attr("fill",function(d){ return c(d.Data); })
            .on("mouseover", (d) => {
                toolTip.transition()
                  .duration(200)
                  .style("opacity", .9)
                toolTip.html("Season: " + d.Year + "<br/>" + "Episodes: "+ d.Episodes + "<br/>" + "Avg. Viewers (mill): "+ d["Avg. Viewers (mil)"] + "<br/>" + "Most Watched Episodes: "+ d["Most watched episode"] + "<br/>" +"Viewers (mill): "+ d["Viewers (mil)"] )
                  .style("left", (d3.event.pageX) + "px")
                  .style("top", (d3.event.pageY - 28) + "px");
              })
              .on("mouseout", (d) => {
                toolTip.transition()
                  .duration(500)
                  .style("opacity", 0);
              });

   
        svgContainer.selectAll(".text")        
            .data(data)
            .enter()
            .append("text")
                .attr("class","label")
                .attr("x", (function(d) { return xMap(d); }  ))
                .attr("y", function(d) { return yMap(d) - 3; })
                // .attr("dx", ".75em")
                .style('text-anchor', "middle")
                .text(function(d) { return d["Avg. Viewers (mil)"]; }); 


      }

      function genderLegend(c) {
        // Draw the gender legend

        var legend = d3.select(".chart").selectAll(".legend")
        .data(c.domain().slice().reverse())
          .enter().append("g")
            .attr("class","legend")
            .attr("transform",function(d,i) {
              return "translate(0," + i * 20 + ")";
            });
      
        legend.append("rect")
            .attr("x",80)
            .attr("y",90)
            .attr("width",50)
            .attr("height",18)
            .style("fill",c);
      
        legend.append("text")
            .attr("x",20)
            .attr("y",100)
            .attr("dy",".35em")
            // .style("text-anchor","end")
            .text(function(d) {
              return d.charAt(0).toUpperCase()+d.slice(1);
            });
      }
})();