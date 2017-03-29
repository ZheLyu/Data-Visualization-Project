var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x1 = d3.scale.linear()
    .range([0, width]);
var tooltip = EstLib.tooltip();
var y = d3.scale.linear()
    .range([height, 0]);

var color1 = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x1)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("body").append("svg")
    .attr("width", 1200 + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("viewBox", "0 0 600 600")
  .append("g")
    .attr("transform","translate(50,20)");

d3.tsv("data/tsdgp4102.tsv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.geo = +d.geo;
    d.rate = +d.rate;
  //  console.log(d);
  });

  x1.domain(d3.extent(data, function(d) { return d.geo; })).nice();
  y.domain(d3.extent(data, function(d) { return d.rate; })).nice();

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
       .attr("fill","white")
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
       .attr("fill","white")
      .style("text-anchor", "end")
      .text("Year");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
       .attr("fill","white")
    .append("text")
     .attr("fill","white")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("CO2")

 var dot= svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 4.5)
      .attr("cx", function(d) { return x1(d.geo); })
      .attr("cy", function(d) { return y(d.rate); })
      .style("fill", function(d) { return color1(d.country); })
      .attr("stroke","White")
      .style("opacity", 0.7)

      .on("mouseover", function(d) {
          dot.transition()
          .attr("r",6)
          .style("opacity",1)
         dot.attr("d", path)
               .append("title")
                .text(function(d) {
                 
                    return d.country+","+d.rate+"%";
                })
          
          tooltip.mouseover("<b>"+d.country+"</br><br>"+d.geo+"</br><br>"+d.rate+"</br><br>"); })
        .on("mousemove", function(d) {  tooltip.mouseover("<b>"+d.country+"</br><br>"+d.geo+"</br><br>"+d.rate+"</br><br>"); })
        .on("mouseout", function() { 
          dot.transition()
          .attr("r",4.5)
          .style("opacity",0.7)
          tooltip.mouseout(); })
   


  var legend = svg.selectAll(".legend")
      .data(color1.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(20," + i * 22 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color1);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .attr("fill","white")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

});