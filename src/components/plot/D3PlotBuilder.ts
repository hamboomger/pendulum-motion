import * as d3 from "d3";
import './plot.css';
import {PSData} from "../../lib/PSDSubscriberImpl";
import {DOT_THETA_UTF8_SYMBOL, THETA_UTF8_SYMBOL} from "../../lib/util";

export type DataElem = { t: number, theta: number, dotTheta: number }
export type PlotData = Array<DataElem>;
type D3Selection = d3.Selection<any, any, any, any>

const GRAPH_TITLE = 'Phase space graph'
const NUMBER_OF_TICKS_DIVIDER_CONSTANT = 50;

function formatToPi(value: d3.NumberValue): string {
  if (value.valueOf() === 0) {
    return '0';
  }
  const valueInPi = value.valueOf() / Math.PI;
  return `${valueInPi.toFixed(2)} \u03c0`;
}

export class D3PlotBuilder {
  private padding = 45;
  private width: number;
  private height: number;
  private innerWidth: number;
  private innerHeight: number;

  private currentDrawing?: D3Selection;
  private readonly ref: SVGSVGElement;
  private selection?: D3Selection;
  private tooltip?: D3Selection;

  constructor(width: number, height: number, svgRef: SVGSVGElement) {
    this.width = width;
    this.height = height;
    this.ref = svgRef;

    this.innerWidth = width - this.padding * 2;
    this.innerHeight = height - this.padding * 2;
  }

  resetDrawings() {
    d3.selectAll("path.plot-line").remove();
  }

  drawPlotLine(rawData: PSData) {
    const data: PlotData = Object.entries(rawData)
      .sort((a, b) => {
        return parseFloat(a[0]) - parseFloat(b[0])
      }).map(d => {
        const [t, [theta, dotTheta]] = d;
        return {t: parseFloat(t), theta, dotTheta};
      });

    const xValRangeRad = Math.PI / 2;
    const yValRangeRad = Math.PI / 8;
    const xValue = (d: DataElem) => d.theta;
    const yValue = (d: DataElem) => d.dotTheta;

    const xScale = d3.scaleLinear()
      .domain([-xValRangeRad, xValRangeRad])
      .range([0, this.innerWidth])
      .nice();

    const yScale = d3.scaleLinear()
      .domain([-yValRangeRad, yValRangeRad])
      .range([0, this.innerHeight])
      .nice();

    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)

    var mouseover = () => {
      this.tooltip?.style("opacity", 1)
    }
    var mousemove = (d: any) => {

      this.tooltip
        ?.html("The exact value of<br>the Ground Living area is: " + d.GrLivArea)
        .style("left", (d.x+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
        .style("top", (d.y) + "px")
    }
    var mouseleave = () => {
      this.tooltip
        ?.transition()
        .duration(200)
        .style("opacity", 0)
    }

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    const lineGen = d3.line<DataElem>()
      .x(d => xScale(xValue(d)))
      .y(d => yScale(yValue(d)))
      .curve(d3.curveNatural);

    this.currentDrawing = this.selection!.append("path")
      .attr("d", lineGen(data)!)
      .attr("class", "plot-line")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseout", mouseleave);

    var totalLength = this.currentDrawing.node()!.getTotalLength();

    this.currentDrawing
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1000)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);
  }

  pauseDrawing() {
    if (this.currentDrawing) {
      this.currentDrawing.interrupt();
    }
  }

  buildPlotPlane() {
    const svg = d3.select(this.ref);

    const xValRangeRad = Math.PI / 2;
    const yValRangeRad = Math.PI / 8;
    const widthHeightRatio = this.innerWidth / this.innerHeight;

    const xScale = d3.scaleLinear()
      .domain([-xValRangeRad, xValRangeRad])
      .range([0, this.innerWidth])
      .nice();

    const yScale = d3.scaleLinear()
      .domain([-yValRangeRad, yValRangeRad])
      .range([0, this.innerHeight])
      .nice();

    this.selection = svg.append('g')
      .attr('transform', `translate(${this.padding}, ${this.padding})`)

    const xAxis = d3.axisBottom(xScale)
      .tickSizeInner(-this.innerHeight)
      .tickSizeOuter(0)
      .ticks(this.innerHeight / NUMBER_OF_TICKS_DIVIDER_CONSTANT * widthHeightRatio)
      .tickFormat(formatToPi);

    const yAxis = d3.axisLeft(yScale)
      .tickSizeInner(-this.innerWidth)
      .tickSizeOuter(0)
      .ticks(this.innerHeight / NUMBER_OF_TICKS_DIVIDER_CONSTANT)
      .tickFormat(formatToPi);

    const yAxisG = this.selection.append('g')
      .attr("class", "axis axis--y")
      .attr('transform', `translate(${this.innerWidth / 2}, 0)`)
      .style("dominant-baseline", "central")
      .call(yAxis);

    const xAxisG = this.selection.append('g')
      .attr("class", "axis axis--x")
      .attr('transform', `translate(0, ${this.innerHeight / 2})`)
      .style("dominant-baseline", "central")
      .call(xAxis);

    xAxisG.selectAll(".tick line")
      .attr("y1", (this.height - (2 * this.padding)) / 2 * -1)
      .attr("y2", (this.height - (2 * this.padding)) / 2);

    yAxisG.selectAll(".tick line")
      .attr("x1", (this.width - (2 * this.padding)) / 2 * -1)
      .attr("x2", (this.width - (2 * this.padding)) / 2);

    // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
    // Its opacity is set to 0: we don't see it by default.
    this.tooltip = d3.select("svg")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px");

    this.appendLabels(svg, xAxisG, yAxisG);
    this.appendArrowHeads(svg, xAxisG, yAxisG);
  }

  private appendLabels(svg: D3Selection, xAxisG: D3Selection, yAxisG: D3Selection) {
    xAxisG.append('text')
      .attr('class', 'axis-label')
      .attr('x', `${this.innerWidth - 5}`)
      .attr('y', `${-10}`)
      .text(THETA_UTF8_SYMBOL);

    yAxisG.append('text')
      .attr('class', 'axis-label')
      .attr('x', `${15}`)
      .attr('y', `${10}`)
      .text(DOT_THETA_UTF8_SYMBOL);

    svg.append("text")
      .attr("x", this.width / 2)
      .attr("y", (this.padding / 2) + 5)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      // .style("text-decoration", "underline")
      .text(GRAPH_TITLE);
  }

  private appendArrowHeads(svg: D3Selection, xAxisG: D3Selection, yAxisG: D3Selection) {
    // reverse the y axis in order to use vertical arrow properly
    yAxisG.selectAll('.domain')
      .attr('transform', `scale(1, -1) translate(0, ${-this.innerHeight})`);

    svg
      .append('defs')
      .append('marker')
      .attr('id', 'arrowhead-right')
      .attr('refX', 5)
      .attr('refY', 4)
      .attr('markerWidth', 16)
      .attr('markerHeight', 13)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0 0 L 5 5 L 0 10')
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('fill', 'none');

    xAxisG.select("path").attr("marker-end", "url(#arrowhead-right)");
    yAxisG.select("path").attr("marker-end", "url(#arrowhead-right)");
  }
}
