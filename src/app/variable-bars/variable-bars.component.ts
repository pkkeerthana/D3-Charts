import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import { bardata } from '../../assets/data';

@Component({
  selector: 'app-variable-bars',
  templateUrl: './variable-bars.component.html',
  styleUrls: ['./variable-bars.component.css']
})
export class VariableBarsComponent implements OnInit {

  private width: number;
  private height: number;
  private margin = {top: 20, right: 20, bottom: 30, left: 40};

  private x: any;
  private y: any;
  private svg: any;
  private g: any;

  login:any;
  logout:any;
  advisor:string = 'Kaushik dayanand Kunder';
  advisor_list = [];
  from_date:any = new Date();
  from_formatted: any;
  show_graph:boolean = false;

  mins_arr = [];
  constructor() { }

  ngOnInit(): void {
    this.mins_arr = bardata;
    this.initSVG();
    this.initAxis();
    this.drawAxis();
    this.drawBars();
  }

  initSVG(){
    d3.select('svg').remove();
    this.svg = d3.select('#chart').append('svg').attr('width','960').attr('height','400');

    this.width = +this.svg.attr('width') - this.margin.left - this.margin.right;
    this.height = +this.svg.attr('height') - this.margin.top - this.margin.bottom;
    this.g = this.svg.append('g').attr('transform','translate(' + this.margin.left + ','
    + this.margin.top + ')');
  }

  initAxis(){
    let d1 = new Date(2021,1,18,8,48,49);
    let d2 = new Date(2021,1,18,10,53,39);
    this.x = d3Scale.scaleTime().range([0,this.width]);
    this.y = d3Scale.scaleLinear().range([this.height,0]);
    this.x.domain([d1,d2]);
    this.y.domain([0,d3Array.max(this.mins_arr, (d) => d.mins)]);
  }

  drawAxis(){
    this.g.append('g')
    .attr('class', 'axis axis--x')
    .style('stroke','white')
    .style('fill','white')
    .attr('transform', 'translate(0,' + this.height + ')')
    .call(d3Axis.axisBottom(this.x));

    this.g.append('g')
    .attr('class','axis axis--y')
    .style('stroke','white')
    .style('fill','white')
    .call(d3Axis.axisLeft(this.y))
    .append('text')
    .style('fill','blue')
    .attr('class', 'axis-title')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '-3.5em')
    .attr('text-anchor', 'end')
    .text('Talktime in Minutes');
  }

  drawBars(){

    let tooltip = d3.select('.chartheader').select('.tooltip');

    this.g.selectAll('.bar')
    .data(this.mins_arr)
    .enter()
    .append('rect')
    .attr('class','bar')
    .attr('x',(d) => this.x(d.date))
    .attr('y',(d) => this.y(d.mins))
    .attr('width', (d) => d.width)
    .attr('height', (d) => this.height - this.y(d.mins) )
    .style('fill', (d) => d.color)
    .on('mouseover',function(d,i){
      tooltip.select('#date').text('Start: ' + d.date.toLocaleString());
      tooltip.select('#talktime').text('Talktime: ' + Math.round(d.mins) + 'mins');
      tooltip.select('#endtime').text('End: ' + d.end.toLocaleString());
    });
  }

}
