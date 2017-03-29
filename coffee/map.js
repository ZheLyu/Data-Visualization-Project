
var pos = 0;
var svg = d3.select("svg").
attr("preserveAspectRatio", "xMidYMid meet")
            .attr("viewBox", "-100 10 1300 1000"),
    margin = {right: 50, left: 50},
    width = +svg.attr("width")+300 
    height = +svg.attr("height")+512 


var proj = "laea",
			nutsLvl = 0;
			size = 1200;
	var co2 = d3.map();

	var color = d3.scale.threshold()
    .domain(d3.range(1,10))
    .range(d3.schemeYlGn[9]);

svg.append("rect").attr("x",0).attr("y",0).attr("width", width).attr("height", height).attr("fill","white");

	var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(20,60)");
    var x = d3.scale.linear()
            .domain([1, 9])
            .rangeRound([500, 800]);

g.selectAll("rect")
  .data(color.range().map(function(d) {
      d = color.invertExtent(d);
      if (d[0] == null) d[0] = x.domain()[0];
      if (d[1] == null) d[1] = x.domain()[1];
      return d;
    }))
  .enter().append("rect")
    .attr("height", 8)
    .attr("x", function(d) { return x(d[0]); })
    .attr("width", function(d) { return x(d[1]) - x(d[0]); })
    .attr("fill", function(d) { return color(d[0]); });

g.append("text")
    .attr("class", "caption")
    .attr("x", x.range()[0])
    .attr("y", -6)
    .attr("fill", "#000")
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .text("CO2 Emissions rate");

g.call(d3.svg.axis().scale(x)
    .tickSize(13)
    .tickFormat(function(x, i) { return i ? x*3 : x + "%"; })
    .tickValues(color.domain()))
  .select(".domain")
    .remove();
	//drawing group
	var g = svg.append("g").attr("transform","translate(0,0)");

	//zoom


	//tooltip element
	var tooltip = EstLib.tooltip();


	var path = d3.geo.path().projection(null);




var x = d3.scale.linear()
    .domain([1990, 2012])
    .range([0, 300])
    .clamp(true);
  var x1 = d3.scale.linear()
    .domain([1990, 2012])
    .range([0, 300])
    .clamp(true);

var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(20,60)");

slider.append("line")
    .attr("class", "track")
    .attr("x1", x.range()[0])
    .attr("x2", x.range()[1])
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.behavior.drag()
       //.on("interruptstart", function() { slider.interrupt(); })
       //console.log()
        .on("drag",function(){ 
        //lider.interrupt();
           draw(x.invert(d3.event.sourceEvent.x-300))
        
        }) 

        )



slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
  .selectAll("text")
  .data(x.ticks(20))
  .enter().append("text")
    .attr("x", x)
    .attr("text-anchor", "middle")
    .text(function(d) {
      if(d%5==0)
      return d;
      else return "";

        })
    ;


var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9)
    .attr("fill","black");

slider.transition()
    .duration(900)// Gratuitous intro
    .tween("draw", function(t) {

    return draw(t);
    });



//var zoom;
//  svg.call(zoom=d3.zoom().scaleExtent([0.5,0.5]).on("zoom", function() {
//    var k = d3.event.transform.k;
//    d3.selectAll(".bn_0").style("stroke-width", (1.5/k)+"px");
//    d3.selectAll(".bn_1").style("stroke-width", (1/k)+"px");
//    d3.selectAll(".bn_2").style("stroke-width", (1/k)+"px");
//    d3.selectAll(".bn_3").style("stroke-width", (0.5/k)+"px");
//    d3.selectAll(".bn_oth").style("stroke-width", (1/k)+"px");
//    g.attr("transform", d3.event.transform);
		//g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
//  }));


function draw(t){
  if(t==null){
    t=1990;
  }
	//get data
	 handle.attr("cx", x(t));
	var d=Math.ceil(t);
	var w=d;
	console.log(t);
	d3.queue()
    .defer(d3.json, "NUTS_lvl0.json")
    .defer(d3.tsv, "data/tsdgp410.tsv", function(d) {
      if(w!=NaN)
      {co2.set(d.geo, +d[w]/2);}
    // else  co2.set(d.geo, +d[1990]);
     // console.log(w);
                 })
    .await(ready);}

	function ready(error, nuts) {
		if (error) return console.error(error);
		//console.log(t);
		//center
		//zoom.scaleBy(g, 0.8);





		//country
		g.append("g").selectAll("path").data(topojson.feature(nuts, nuts.objects.cntrg).features).enter()
				.append("path").attr("d", path)

				.attr("class", "cntrg")

				.on("mouseover", function(rg) {               
          //console.log(rg.properties.cna);
            
          tooltip.mouseover(rg.properties.cna+rg.properties.cid); })
				.on("mousemove", function() { tooltip.mousemove(); })
				.on("mouseout", function() { tooltip.mouseout(); })
        .attr("d", path)
                .append("title")
                .text(function(rg) {
                    return rg.properties.cna;
                });


				//console.log(topojson.feature(nuts, nuts.objects.nutsrg).features);
		g.append("g").selectAll("path").data(topojson.feature(nuts, nuts.objects.cntbn).features).enter()
				.append("path").attr("d", path)
				.attr("class", "cntbn")
        .attr("fill", function(d) {
                 //console.log(d);
          if(co2.get(d.id)!=null)
         return color(d[1990] = co2.get(d.id));
         else return "lightgray";
      }) ;

		//nuts regions
	    g.append("g").selectAll("path").data(topojson.feature(nuts, nuts.objects.nutsrg).features).enter()
				.append("path")
        .attr("d", path)        
				.attr("fill", function(d) {
                 //console.log(d);
          if(co2.get(d.id)!=null)
				 return color(d[1990] = co2.get(d.id));
				 else return "lightgray";
			})
        
        .on("click", function(d, i) {
                console.log(d);
                if(co2.get(d.id)!=null)
                    console.log(d);
                line(d);
                   // d3.select(this)
                     //   .attr("fill", "black");
                })
        .on("mouseover", function(d, i) {
             console.log(d);
          
      
          tooltip.mouseover("<b>"+d.id+"</br><br>"+d.properties.na+"</br><br>"+d[1990]*2+"%"); })
        .on("mousemove", function() {
            

         tooltip.mousemove(); })
        .on("mouseout", function() { tooltip.mouseout(); }) .attr("d", path)
    
                .append("title")
                .text(function(d) {
                    return d.properties.na+","+ d[1990]*2+"%";
                }) ;
;

	};



function line(id){
//console.log(id);
var width=1000,height=700,
margin={left:50,top:30,right:20,bottom:20},
g_width=width-margin.left-margin.right,
g_height=height-margin.top-margin.bottom;

//div--svg--g--path--xyÖá
//SVG
var g1=d3.select("svg")
.append("g")
//width,height
.attr("width",1000) //attribute .Á¬½ÓÃ¿¸öÔªËØ
.attr("height",500)
.attr("transform","translate(100,200)");
g1.append("rect")
    .attr("width", 1000)
    .attr("height", 700)
    .attr("fill", "white");

//g
var line=g1
.append("g")
.attr("transform","translate("+margin.left+","+margin.top+")")


d3.tsv("data/tsdgp4101.tsv",function(data){
  var year = [];
  var AT = [];
  var BE = [];
  var BG = [];
  var CH = [];
  var CY = [];
  var CZ = [];
  var DE = [];
  var DK = [];
  var EE = [];
  var EL = [];
  var ES = [];
  var EU27 = [];
  var EU28 = [];
  var FI = [];
  var FR = [];
  var HR = [];
  var HU = [];
  var IE = [];
  var IS = [];
  var IT = [];
  var LT = [];
  var LU = [];
  var LV = [];
  var MT = [];
  var NL = [];
  var NO = [];
  var ODA = [];
  var PL = [];
  var PT = [];
  var RO = [];
  var SE = [];
  var SI = [];
  var SK = [];
  var TR = [];
  var UK = [];

  var hightlight=[];


 data.forEach(function(d) {
   year.push(d.geo);
   AT.push(d.AT);
   BE.push(d.BE);
   BG.push(d.BG);
   CH.push(d.CH);
   CY.push(d.CY);
   CZ.push(d.CZ);
   DE.push(d.DE);
   DK.push(d.DK);
   EE.push(d.EE);
   EL.push(d.EL);
   ES.push(d.ES);
   EU27.push(d.EU27);
   EU28.push(d.EU28);
   FI.push(d.FI);
   FR.push(d.FR);
   HR.push(d.HR);
   HU.push(d.HU);
   IE.push(d.IE);
   IS.push(d.IS);
   IT.push(d.IT);
   LT.push(d.LT);
   LU.push(d.LU);
   LV.push(d.LV);
   MT.push(d.MT);
   NL.push(d.NL);
   NO.push(d.NO);
   ODA.push(d.ODA);
   PL.push(d.PL);
   PT.push(d.PT);
   RO.push(d.RO);
   SE.push(d.SE);
   SI.push(d.SI);
   SK.push(d.SK);
   TR.push(d.TR);
   UK.push(d.UK);
  // console.log(d);
 });



//xÖáËõ·Å
var scale_x=d3.scale.linear()
.domain([0,AT.length-1])
.range([0,g_width])

var scale_x1=d3.scale.linear()
.domain([1990,2012])
.range([0,g_width])


var scale_y=d3.scale.linear()
.domain([0,d3.max(LU)])
.range([g_height,0])


var line_generator=d3.svg.line()
.x(function(d,i){return scale_x(i);})//0,1,2,3...
.y(function(d){return scale_y(d);})//1,3,5...

cx=function(d,i) { return scale_x(i);},
  cy=function(d) { return scale_y(d);}

var color = d3.scale.category10();
var country = [AT,BE,BG,CH,CY,CZ,DE,DK,EE,EL,ES,EU27,EU28,FI,FR,HR,HU,IE,IS,IT,LT,LU,LV,MT,NL,NO,ODA,PL,PT,RO,SE,SI,SK,TR,UK];
var country_name = ["AT","BE","BG","CH","CY","CZ","DE","DK","EE","EL","ES","EU27","EU28","FI","FR","HR","HU","IE","IS","IT","LT","LU","LV","MT","NL","NO","ODA","PL","PT","RO","SE","SI","SK","TR","UK"];
for(i=0;i<country_name.length;i++){
  if(id.id==country_name[i]){
    //console.log(id);
     data.forEach(function(d) {
       hightlight.push(d[id.id]);

     });
  //console.log(hightlight);
  }

}


for(i=0;i<country.length;i++)
{
  line
  .append("path")
  .attr("d",line_generator(country[i]))
  .attr("stroke",color(i))//d="M1,0L20,40L40,50L100,100L0,200",d -path data
  .style("fill","none")
  .style("opacity", 0.2)
  
  //console.log(country[i]);
}

line
  .append("path")
  .attr("d",line_generator(hightlight))
  .attr("stroke","red")//d="M1,0L20,40L40,50L100,100L0,200",d -path data
  .style("fill","none")
   .attr("stroke-width",2.5)
  .on("mouseover", function() {
          console.log(id);
          tooltip.mouseover("<b>"+id.id+"</br><br>"+id.properties.na+"</br><br>"+id[1990]+"%"+"</br><br>"); })
        .on("mousemove", function() { tooltip.mousemove("<b>"+id.id+"</br><br>"+id.properties.na+"</br><br>"+id[1990]+"%"+"</br><br>"); })
        .on("mouseout", function() { tooltip.mouseout(); });
;
//for(i=0;i<country.length-1;i++)
//{
//g.selectAll(year[i])
    //.data(country[i])
    //.enter().append("circle")
    //.attr("r",5)
    //.attr("cx", cx)
    //.attr("cy", cy)
    //.style("fill", color(i))
    //.style("opacity", 0.5);
//}

line.append("text")
.attr("transform","translate(450,50)")
.text(function(){
  return id.properties.na;
})
.style("text-anchor", "middle")
 .attr("stroke-width",1.5)


var x_axis=d3.svg.axis().scale(scale_x1),
y_axis=d3.svg.axis().scale(scale_y).orient("left");

line.append("g")
  .call(x_axis)
  .attr("transform","translate(0,"+g_height+")")
  .append("text")
  .attr("x", g_width-20)
  .attr("y", -6)
  .style("text-anchor", "end")
  .text("Year")
  .attr("dy","-1em");

line.append("g")
.call(y_axis)
.append("text")
.text("Number")
.attr("transform","rotate(-90)")
.attr("text-anchor","end")
.attr("dy","1em")

var he = 0;
/*
for(i=0;i<country.length-1;i++)
{
  g.append("rect")
    .attr("x", g_width - 20)
    .attr("y",g_height - 50 - he)
    .attr("width", 20)
    .attr("height", 5)
    .style("fill",color(i));
  g.append("text")
    .attr("x", g_width - 24)
    .attr("y",g_height -45 - he)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(country_name[i])
    he = he + 10;
}*/
circie=line.append("circle")

                .attr("cx", 865)
                .attr("cy", 35)
                .attr("r", 30)
                .attr("fill","white")
                .attr("stroke","black")
                .attr("stroke-width",1.5)
                 .on("click", function(d, i) {

                   // console.log(d);
                   g1.remove();

                })

 cross = line.append("g");
 cross.append("line")

                .attr("x1", 850)
                .attr("y1", 50)
                .attr("x2", 880)
                .attr("y2", 20)
                .attr("stroke","black")
                .attr("stroke-width",1.5)
                .on("click", function(d, i) {

                   // console.log(d);
                   g1.remove();

                });

            cross.append("line")
                .attr("x1", 880)
                .attr("y1", 50)
                .attr("x2", 850)
                .attr("y2", 20)
                .attr("stroke","black")
                .attr("stroke-width",1.5)
                .on("click", function(d, i) {

                   // console.log(d);
                   g1.remove();

                });
  });


}