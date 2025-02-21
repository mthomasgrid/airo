import { Selection } from "d3-selection";
export function createGradient(defs: Selection<SVGDefsElement,unknown,null,undefined>, start: string, end: string, id: string) {
  
  const areaGradient = defs
    .append('linearGradient')
    .attr('id', id)
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '0%')
    .attr('y2', '100%');
  areaGradient
    .append('stop')
    .attr('offset', '0%')
    .attr('stop-color', start)
    .attr('stop-opacity', 1);
  areaGradient
    .append('stop')
    .attr('offset', '100%')
    .attr('stop-color', end)
    .attr('stop-opacity', 1);
}

export function createShadow(defs: Selection<SVGDefsElement, unknown, null, undefined>, id: string) {
  

 const filter = defs.append('filter').attr('id', id);

  filter
    .append('feGaussianBlur')
    .attr('in', 'SourceAlpha')
    .attr('stdDeviation', 2)
    .attr('result', 'blur');
  filter
    .append('feOffset')
    .attr('in', 'blur')
    .attr('dx', 1)
    .attr('dy', 2)
    .attr('result', 'offsetBlur');
  filter
    .append('feComponentTransfer')
    .append('feFuncA')
    .attr('type', 'linear')
    .attr('slope', '0.5');

  const feMerge = filter.append('feMerge');

  feMerge.append('feMergeNode');
  feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
}
