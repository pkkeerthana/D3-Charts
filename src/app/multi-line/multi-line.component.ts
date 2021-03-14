import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Axis from 'd3-axis';
import * as d3Zoom from 'd3-zoom';
import * as d3Brush from 'd3-brush';
import * as d3Array from 'd3-array';
import { linedata } from '../../assets/data';

export interface Margin {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface UsersData{
  date: Date,
  users: number,
  google_users: number,
  temp_users: number
}

@Component({
  selector: 'app-multi-line',
  templateUrl: './multi-line.component.html',
  styleUrls: ['./multi-line.component.css']
})
export class MultiLineComponent implements OnInit {

  Users_merged = linedata;
  margin: Margin;
  margin2: Margin;

  private width: number;
  private height: number;
  private height2: number;

  private x: any;
  private x2: any;
  private y: any;
  private y2: any;
  private y3: any;
  private y4: any;

  private xbar:any;

  private xAxis: any;
  private xAxis2: any;
  private yAxis: any;
  private yAxis3: any;

  private context: any;
  private brush: any;
  private zoom: any;
  private focus: any;
  private line: any;
  private line3: any;
  private line2: any;
  private line4: any;
  private line5: any;
  private line6: any;
  svg: any;
  hover_rect:any;
  start: any;
  end:any;

  constructor() { }

  ngOnInit(): void {
    this.start = new Date(1,1,2021);
    this.end = new Date(6,1,2021)
    
    this.initMargins();
    this.initSVG();
    this.drawAxis(this.Users_merged);
    this.drawline1(this.Users_merged);
    this.drawline2(this.Users_merged);
    this.drawline3(this.Users_merged);
    this.drawBars();
  }
  initMargins() {
    this.margin = { left: 40, right: 70, top: 20, bottom: 110 };
    this.margin2 = { top: 430, left: 40, right: 20, bottom: 30 };
  }

  private initSVG() {
    d3.select('svg').remove();
    this.svg = d3.select('#chart')
    .append('svg')
    .attr('width','960')
    .attr('height','500');

    this.width = +this.svg.attr('width') - this.margin.left - this.margin.right;
    this.height = +this.svg.attr('height') - this.margin.top - this.margin.bottom;
    this.height2 = +this.svg.attr('height') - this.margin2.top - this.margin2.bottom;


    this.x = d3Scale.scaleTime().range([0, this.width]);
    this.x2 = d3Scale.scaleTime().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]); // left y-axis
    this.y2 = d3Scale.scaleLinear().range([this.height2, 0]);
    this.y3 = d3Scale.scaleLinear().range([this.height, 0]);  // right y-axis
    this.y4 = d3Scale.scaleLinear().range([this.height2, 0]);

    this.xbar = d3Scale.scaleTime().range([0,this.width]);
    this.x.domain([this.start,this.end]);

    this.xAxis = d3Axis.axisBottom(this.x);
    this.xAxis2 = d3Axis.axisBottom(this.x2);
    this.yAxis = d3Axis.axisLeft(this.y);
    this.yAxis3 = d3Axis.axisRight(this.y3);

    this.brush = d3Brush.brushX()
      .extent([[0, 0], [this.width, this.height2]])
      .on('brush end', this.brushed.bind(this));

    this.zoom = d3Zoom.zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([[0, 0], [this.width, this.height]])
      .extent([[0, 0], [this.width, this.height]])
      .on('zoom', this.zoomed.bind(this));

    this.line = d3Shape.line()
      .curve(d3Shape.curveMonotoneX)
      .x((d: any) => this.x(d.date))
      .y((d: any) => this.y(d.google_users));

    this.line3 = d3Shape.line()
      .curve(d3Shape.curveMonotoneX)
      .x((d: any) => this.x(d.date))
      .y((d: any) => this.y3(d.users));

    this.line5 = d3Shape.line()
    .curve(d3Shape.curveMonotoneX)
    .x((d: any) => this.x(d.date))
    .y((d: any) => this.y(d.temp_users))


    this.line2 = d3Shape.line()
      .curve(d3Shape.curveMonotoneX)
      .x((d: any) => this.x2(d.date))
      .y((d: any) => this.y2(d.google_users));

    this.line4 = d3Shape.line()
      .curve(d3Shape.curveMonotoneX)
      .x((d: any) => this.x2(d.date))
      .y((d: any) => this.y4(d.users));

    this.line6 = d3Shape.line()
      .curve(d3Shape.curveMonotoneX)
      .x((d: any) => this.x2(d.date))
      .y((d: any) => this.y2(d.temp_users));

    this.svg.append('defs').append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', this.width)
      .attr('height', this.height);

    this.focus = this.svg.append('g')
      .attr('class', 'focus')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.context = this.svg.append('g')
      .attr('class', 'context')
      .attr('transform', 'translate(' + this.margin2.left + ',' + this.margin2.top + ')');

    this.svg.append('rect')
      .attr('class', 'zoom')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
      .style('fill', 'none')
      .call(this.zoom);

  }

    brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return;
    let s = d3.event.selection || this.x2.range();
    this.x.domain(s.map(this.x2.invert, this.x2));
    this.focus.select('.line1').attr('d', this.line);
    this.focus.select('.line2').attr('d', this.line3);
    this.focus.select('.line3').attr('d',this.line5);
    this.focus.select('.axis--x').call(this.xAxis);
    this.svg.select('.zoom').call(this.zoom.transform, d3Zoom.zoomIdentity
      .scale(this.width / (s[1] - s[0]))
      .translate(-s[0], 0));
  }

  zoomed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') return;
    let t = d3.event.transform;
    this.x.domain(t.rescaleX(this.x2).domain());
    this.focus.select('.line1').attr('d', this.line);
    this.focus.select('.line2').attr('d', this.line3);
    this.focus.select('.line6').attr('d',this.line6);
    this.focus.select('.axis--x').call(this.xAxis);
    this.context.select('.brush').call(this.brush.move, this.x.range().map(t.invertX, t));
  }

    private drawAxis(data) {

    this.x.domain(d3Array.extent(data, (d: UsersData) => d.date));
    this.x2.domain(this.x.domain());

    this.y.domain([0, d3Array.max(data, (d: UsersData) => d.google_users)]);
    this.y2.domain(this.y.domain());

    this.y3.domain([0, d3Array.max(data, (d: UsersData) => d.users)]);
    this.y4.domain(this.y.domain);

    this.focus.append('g')
      .attr('class', 'axis axis--x')
      .style('fill','white')
      .style('stroke','white')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(this.xAxis);

    this.focus.append('g')
      .attr('class', 'axis axis--y')
      .style('fill','white')
      .style('stroke','white')
      .call(this.yAxis)
      .append('text')
      .attr('class', 'axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '-3.5em')
      .attr('fill','blue')
      .attr('text-anchor', 'end')
      .text('line1 & line2');

    this.focus.append('g')
      .attr('class', 'axis axis--y3')
      .style('fill','white')
      .style('stroke','white')
      .attr('transform', 'translate(' + this.width + ',0)')
      .call(this.yAxis3)
      .append('text')
      .attr('class', 'axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '3.5em')
      .attr('fill','blue')
      .attr('text-anchor', 'end')
      .text('line3');

    this.context.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + this.height2 + ')')
      .call(this.xAxis2);

    this.context.append('g')
      .attr('class', 'brush')
      .call(this.brush)
      .call(this.brush.move, this.x.range());

  }

  private drawline1(data: UsersData[]) {

    this.focus.append('path')
    .datum(data)
    .attr('class', 'line1')
    .attr('d', this.line)
    .style('fill', 'none')
    .style('stroke', 'blue');

    this.context.append('path')
    .datum(data)
    .attr('class', 'line1')
    .attr('d', this.line2)
    .style('fill', 'none')
    .style('stroke', 'transparent');
    
  }

  private drawline2(data: UsersData[]) {

    this.focus.append('path')
    .datum(data)
    .attr('class', 'line2')
    .attr('d', this.line3)
    .style('fill', 'none')
    .style('stroke', 'red');

    this.context.append('path')
    .datum(data)
    .attr('class', 'line2')
    .attr('d', this.line4)
    .style('fill', 'none')
    .style('stroke', 'red');
    
  }

  private drawline3(data: UsersData[]){
    this.focus.append('path')
    .datum(data)
    .attr('class', 'line3')
    .attr('d', this.line5)
    .style('fill', 'none')
    .style('stroke', 'rgb(206, 168, 0)');

    this.context.append('path')
    .datum(data)
    .attr('class', 'line3')
    .attr('d', this.line6)
    .style('fill', 'none')
    .style('stroke', 'transparent');
  }

  drawBars(){

    let tooltip = d3.select('#chart').select('.chartheader').select('#tooltip');

    this.focus.append('rect')
    .attr('width', this.width)
    .attr('height', this.height)
    .style('fill', 'transparent');
    
    this.focus.selectAll('.bar')
    .data(this.Users_merged)
    .enter()
    .append('line')
    .attr('class','bar')
    .attr('x1',(d) =>this.x(d.date))
    .attr('x2',(d) =>this.x(d.date))
    .attr('y1','0')
    .attr('y2','370')
    .attr('stroke','transparent')
    .attr('stroke-width','15')
    .on('mouseover',function(d,i){
      tooltip.select('#date').text('Date :' + d.date.toLocaleString());
      tooltip.select('#users').text('Users: ' + d.users);
      tooltip.select('#temp').text('Temp Users: '+ d.temp_users);
      tooltip.select('#google').text('Google Users: '+ d.google_users);
      d3.select('svg').select('.focus').selectAll('.bar')
      .attr('stroke','transparent')
      .attr('stroke-width','15');
      d3.select(this).attr('stroke','gray').attr('stroke-width','2');
    })
  }
}
