export default function addBarRaceChart(elem, data, duration, width, height)
{
    var n = 12,
      margin = {
        top: Math.min(40, height * 0.1),
        right: Math.min(40, width * 0.1),
        bottom: Math.min(30, height * 0.1),
        left: Math.min(30, width * 0.2)
      },
      width = width - margin.left - margin.right,
      height = height - margin.top - margin.bottom;

    const svg = d3.select(elem).append("svg")
      .attr("class", "brc")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    let barPadding = (height) / (n * 5);

    // let title = svg.append('text')
    //  .attr('class', 'title')
    //  .attr('y', 24)
    //  .html('Title');
  
    let subTitle = svg.append("text")
     .attr("class", "brc subTitle")
     .attr("x", margin.left)
     .attr("y", margin.top / 2)
     .html("Word count in movie's titles and descriptions");
   
    // let caption = svg.append('text')
    //  .attr('class', 'caption')
    //  .attr('x', width)
    //  .attr('y', height - 5)
    //  .style('text-anchor', 'end')
    //  .html('Word');
    
     var data_index = 0;
     var yearSlice = data[data_index].counts.slice(0, n);
     let year = data[data_index].year;
     data_index++;
     let nxtLstValues = new Map();
     let lstValues = new Map();
     yearSlice.forEach((d, i) => {
         d.rank = i; 
         d.name = d[0];
         d.value = d[1];
         d.lastValue = 0;
         lstValues[d.name] = d.value;
         d.year = year; 
         d.colour = d3.hsl(Math.random()*360,0.75,0.75);
       });
    //  console.log('yearSlice: ', yearSlice);
  
    let x = d3.scaleLinear()
        .domain([0, d3.max(yearSlice, d => d.value)])
        .range([margin.left, width + margin.left]);
  
    let y = d3.scaleLinear()
        .domain([n, 0])
        .range([height + margin.top, margin.top]);
  
    let xAxis = d3.axisTop()
        .scale(x)
        .ticks(width > 500 ? 5:2)
        .tickSize(- height)
        .tickFormat(d => d3.format(',')(d));
  
    svg.append('g')
       .attr('class', 'brc axis xAxis')
       .attr('transform', `translate(0, ${margin.top * 1})`)
       .call(xAxis)
       .selectAll('.brc .tick line')
       .classed('origin', d => d == 0);
  
    svg.selectAll('rect.brc.bar')
        .data(yearSlice, d => d.name)
        .enter()
        .append('rect')
        .attr('class', 'brc bar')
        .attr('x', x(0)+1)
        .attr('width', d => x(d.value) - x(0) - 1)
        .attr('y', d => y(d.rank) + 5)
        .attr('height', y(1) - y(0) - barPadding)
        .style('fill', d => d.colour);
      
    svg.selectAll('text.brc.label')
        .data(yearSlice, d => d.name)
        .enter()
        .append('text')
        .attr('class', 'brc label')
        .attr('x', d => x(d.value)-8)
        .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
        .style('text-anchor', 'end')
        .html(d => d.name);
      
    // svg.selectAll('text.brc.valueLabel')
    //   .data(yearSlice, d => d.name)
    //   .enter()
    //   .append('text')
    //   .attr('class', 'brc valueLabel')
    //   .attr('x', d => x(d.value)+5)
    //   .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
    //   .text(d => d3.format(',.0f')(d.lastValue));
    
  const halo = function(text, strokeWidth) {
    text.select(function() { return this.parentNode.insertBefore(this.cloneNode(true), this); })
     .style('fill', '#ffffff')
     .style( 'stroke','#ffffff')
     .style('stroke-width', strokeWidth)
     .style('stroke-linejoin', 'round')
     .style('opacity', 1);
    }   

    let yearText = svg.append('text')
      .attr('class', 'yearText')
      .attr('x', width-margin.right)
      .attr('y', height-25)
      .attr("display", "none")
      .style('text-anchor', 'end')
      .html(~~year)
      .call(halo, 10);

   setTimeout(() => { console.log("sleep over"); }, duration / 12 * 3);
     
   let ticker = d3.interval(e => {

      yearSlice = data[data_index].counts.slice(0, n);
      year = data[data_index].year;
      data_index++;
      yearSlice.forEach((d, i) => {
          d.rank = i; 
          d.name = d[0];
          d.value = d[1];
          d.lastValue = d.name in lstValues ? lstValues[d.name] : 0;
          nxtLstValues[d.name] = d.value;
          d.year = year; 
          d.colour = d3.hsl(Math.random()*360,0.75,0.75);
        });
      lstValues = nxtLstValues;
      // console.log('yearSlice: ', yearSlice);

      x.domain([0, d3.max(yearSlice, d => d.value)]); 
     
      svg.select('.brc.xAxis')
        .transition()
        .duration(duration * 0.9)
        .ease(d3.easeLinear)
        .call(xAxis);
    
       let bars = svg.selectAll('.brc.bar').data(yearSlice, d => d.name);
    
       bars
        .enter()
        .append('rect')
        .attr('class', d => `brc bar ${d.name.replace(/\s/g,'_')}`)
        .attr('x', x(0)+1)
        .attr( 'width', d => x(d.value)-x(0)-1)
        .attr('y', d => y(n+1)+5)
        .attr('height', y(1)-y(0)-barPadding)
        .style('fill', d => d.colour)
        .transition()
          .duration(duration * 0.9)
          .ease(d3.easeLinear)
          .attr('y', d => y(d.rank)+5);
          
       bars
        .transition()
          .duration(duration * 0.9)
          .ease(d3.easeLinear)
          .attr('width', d => x(d.value)-x(0)-1)
          .attr('y', d => y(d.rank)+5);
            
       bars
        .exit()
        .transition()
          .duration(duration * 0.9)
          .ease(d3.easeLinear)
          .attr('width', d => x(d.value)-x(0)-1)
          .attr('y', d => y(n+1)+5)
          .remove();

       let labels = svg.selectAll('.brc.label')
          .data(yearSlice, d => d.name);
     
       labels
        .enter()
        .append('text')
        .attr('class', 'brc label')
        .attr('x', d => x(d.value)-8)
        .attr('y', d => y(n+1)+5+((y(1)-y(0))/2))
        .style('text-anchor', 'end')
        .html(d => d.name)    
        .transition()
          .duration(duration * 0.9)
          .ease(d3.easeLinear)
          .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);
             
   	   labels
          .transition()
          .duration(duration * 0.9)
            .ease(d3.easeLinear)
            .attr('x', d => x(d.value)-8)
            .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);
    
       labels
          .exit()
          .transition()
            .duration(duration * 0.9)
            .ease(d3.easeLinear)
            .attr('x', d => x(d.value)-8)
            .attr('y', d => y(n+1)+5)
            .remove();
     
      //  let valueLabels = svg.selectAll('.brc.valueLabel').data(yearSlice, d => d.name);
    
      //  valueLabels
      //     .enter()
      //     .append('text')
      //     .attr('class', 'brc valueLabel')
      //     .attr('x', d => x(d.value)+5)
      //     .attr('y', d => y(n+1)+5)
      //     .text(d => d3.format(',.0f')(d.lastValue))
      //     .transition()
      //       .duration(duration * 0.9)
      //       .ease(d3.easeLinear)
      //       .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);
            
      //  valueLabels
      //     .transition()
      //       .duration(duration * 0.9)
      //       .ease(d3.easeLinear)
      //       .attr('x', d => x(d.value)+5)
      //       .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
      //       .tween("text", function(d) {
      //          let i = d3.interpolateRound(d.lastValue, d.value);
      //          return function(t) {
      //            this.textContent = d3.format(',')(i(t));
      //         };
      //       });
     
      // valueLabels
      //   .exit()
      //   .transition()
      //     .duration(duration * 0.9)
      //     .ease(d3.easeLinear)
      //     .attr('x', d => x(d.value)+5)
      //     .attr('y', d => y(n+1)+5)
      //     .remove();

      yearText.html(~~year);     
     if(data_index == data.length || d3.select(elem + " svg")._groups[0][0] == null) ticker.stop();
     year = d3.format('.1f')((+year) + 0.1);
   }, duration);
}