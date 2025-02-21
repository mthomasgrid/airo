import { useCallback, useEffect, useRef } from "react";
import * as d3 from "d3";
import { createGradient, createShadow } from "@/utils/chart.utils";

export default function HourChart({
  max = 0,
  value = null,
  id = "",
  outerRadius = 40,
  innerRadius = 30,
  text,
  gradientColors = { start: "#acf254", end: "#20944e" },
}: Props) {
  const gaugeChart = useRef<SVGSVGElement | null>(null);
  const margin = {
    top: 30,
    right: 0,
    bottom: 10,
    left: 70,
  };
  const width = 2 * outerRadius + margin.left + margin.right;
  const height = 2 * outerRadius + margin.top + margin.bottom;

  const drawChart = useCallback(() => {
    if (value === null || typeof value !== "number") return; 

    d3.select(`#gauge-container-${id} svg *:not(title)`).remove();

    const graidentId = "areaGradient";
    const shadowId = "dropshadow";
    const colors = [`url(#${graidentId}-${id})`, "#30363d"];
    const data = [Math.round(value), Math.round(max - value)];
    const svg = d3.select(gaugeChart.current).attr("width", width).attr("height", height);
    const arc = d3.arc<d3.PieArcDatum<number>>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const angle = (3 * Math.PI) / 4;
    const startAngle = value >= max / 2 ? -angle : angle; 
    const pie = d3.pie<number>().startAngle(startAngle).endAngle(-startAngle);

    svg.selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", (d) => arc(d as d3.PieArcDatum<number>))
      .attr("transform", `translate(${width / 2},${height / 2})`)
      .style("fill", (d, i) => colors[i]);

    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("data-testid", "value")
      .attr("fill", "white")
      .attr("filter", `url(#${shadowId})`)
      .attr("font-size", "16px")
      .attr("font-family", "Source Sans Pro, sans-serif")
      .attr("font-weight", "600")
      .attr("transform", `translate(${width / 2},${height / 2 + 4})`)
      .text(text);

    const defs = svg.append("defs");
    createGradient(defs, gradientColors.start, gradientColors.end, `${graidentId}-${id}`);
    createShadow(defs, shadowId);
  }, [value, max, id, width, height, innerRadius, outerRadius, gradientColors, text]);

  useEffect(() => {
    drawChart();
  }, [drawChart]);

  return <svg ref={gaugeChart} data-testid="hourchart" id="pm25"></svg>;
}

interface Props {
  max: number;
  value: number | number[] | null;
  id: string;
  outerRadius?: number;
  innerRadius?: number;
  gradientColors: { start: string; end: string };
  text: string | number;
}
