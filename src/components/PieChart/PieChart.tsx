import { createGradient, createShadow } from '@/utils/chart.utils';
import * as d3 from "d3";
import { useEffect, useRef } from 'react';


const PieChart = ({ max = 10,
  label = '',
  value = 0,
  outerRadius = 35,
  innerRadius = 27.5,
  gradientColors = { start: '#acf254', end: '#20944e' },
}) => {


  const pieChart = useRef<SVGSVGElement | null>(null);
  const margin = {
    top: 4,
    right: 4,
    bottom: 8,
    left: 4,
  };

  const width = 2 * outerRadius + margin.left + margin.right;
  const height = 2 * outerRadius + margin.top + margin.bottom;

  useEffect(() => {
    drawChart();
  });


          function drawChart() {
                  
                
                    const graidentId = 'areaGradient';
                    const shadowId = 'dropshadow';
                    // Clear svg before the redraw
                    d3.select('#pie-container svg *:not(title)').remove();
                
                    const arc = d3
                    .arc<d3.PieArcDatum<number>>()
                    .innerRadius(innerRadius)
                    .outerRadius(outerRadius)
                    .startAngle(0)
                    .endAngle((value / max) * Math.PI * 2);
                
                    // Define the size and position of svg
                   const svg = d3
                      .select(pieChart.current)
                      .attr('width', width)
                      .attr('height', height)
                      .append('g')
                      .attr('transform', `translate(${width / 2},${height / 2})`);
                
              
                    d3.select('#pie-container g')
                      .append('circle')
                      .attr('cx', 0)
                      .attr('cy', 0)
                      .attr('r', outerRadius - 1.7)
                      .style('stroke-width', 1.5)
                      .style('stroke', '#30363d')
                      .style('fill', 'none');
                

                      
                    svg
                      .append('path')
                      .attr("d", (d) => arc(d as d3.PieArcDatum<number>))
                      .attr('filter', `url(#${shadowId})`)
                      .style('fill', `url(#${graidentId})`);
                
                    // Text
                    d3.select('#pie-container g')
                      .append('text')
                      .attr('text-anchor', 'middle')
                      .attr('data-testid', 'label')
                      .attr('fill', 'rgba(255, 255, 255, 0.5)')
                      .attr('y', 14)
                      .text(label);
                    d3.select('#pie-container g')
                      .append('text')
                      .attr('text-anchor', 'middle')
                      .attr('data-testid', 'value')
                      .attr('fill', 'white')
                      .attr('y', -4)
                      .text(value);
                
                  const  defs = svg.append('defs');
                    createGradient(defs, gradientColors.start, gradientColors.end, graidentId);
                    createShadow(defs, shadowId);
                  }
                



          return (
                    <div data-testid="piechart" id='pie-container'>
                    <svg width={width} height={height} ref={pieChart}>
                      <title>PieChart</title>
                    </svg>
                  </div>
                    
          );
}


export default PieChart;