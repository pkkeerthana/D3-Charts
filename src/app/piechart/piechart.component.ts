import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import { piedata } from '../../assets/data';

@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.css']
})
export class PiechartComponent implements OnInit {

  private margin = { top: 30, right: 20, bottom: 30, left: 50 };
  private width: number;
  private height: number;
  private radius: number;

  private arc: any;
  private labelArc: any;
  private pie: any;
  private color: any;
  private svg: any;
  private g: any;
  private chart: any;

  constructor() { }

  ngOnInit(): void {
    this.width = 860 - this.margin.left - this.margin.right;
    this.height = 350 - this.margin.top - this.margin.bottom;
    this.radius = Math.min(this.width, this.height) / 2;
    this.initSvg();
    this.drawPie();
    this.drawLegend();
    this.drawlineLabels();
    this.labelHighlight();
  }

  private initSvg() {
    this.color = d3Scale.scaleOrdinal()
      .range(['#0288FC', '#01B999', '#00DB73', '#1BA700', '#D1CA00', '#EA9901', '#EA4001',
        '#1F0078', '#7B01C1', '#BE01C1', '#A1016E', '#6B0129', '#3E3939', '#94B993']);
    this.arc = d3Shape.arc()
      .outerRadius(this.radius - 10)
      .innerRadius(0);
    this.labelArc = d3Shape.arc()
      .outerRadius(this.radius + 20)
      .innerRadius(this.radius + 20);
    this.pie = d3Shape.pie()
      .sort(null)
      .value((d: any) => d.value);
    this.svg = d3.select('.pie-chart')
      .append('svg')
      .attr('width', '860')
      .attr('height', '450')
      .append('g')
      .attr('transform', 'translate(' + 305 + ',' + 195 + ')');
  }
  private drawPie() {
    const parent = this;
    let g = this.svg.selectAll('.arc')
      .data(this.pie(piedata))
      .enter().append('g')
      .attr('class', 'arc');
    g.append('path').attr('d', this.arc)
      .style('fill', (d: any) => parent.color(d.data.name));
    g.append('text').attr('transform', (d: any) => 'translate(' + this.labelArc.centroid(d) + ')')
      .attr('dy', '.35em')
      .text((d: any) => '');
    g.append('polyline')
      .attr('stroke', 'transparent')
      .attr('stroke-width', '1')
      .attr('fill', 'none')
      .attr('points', (d) => {
        let pos = this.labelArc.centroid(d);
        pos[0] = this.radius * 1.2 * (this.midAngle(d) < Math.PI ? 1 : -1);
        return [this.arc.centroid(d), this.labelArc.centroid(d), pos]
      });
    this.g = g;
  }

  drawLegend() {
    const parent = this;
    let legend = this.svg.append('g')
      .attr('transform', 'translate(300,-100)')
      .selectAll('.legend')
      .data(this.pie(piedata))
      .enter()
      .append('g')
      .attr('transform', (d, i) =>
        'translate( 0, ' + (i * 30) + ')'
      )
      .attr('class', 'legend');
    legend.append('rect')
      .attr('width', '10')
      .attr('height', '10')
      .attr('fill', (d: any, i) => parent.color(d.data.name));

    legend.append('text')
      .attr("y", 10)
      .attr("x", 30)
      .text((d) => d.data.name.replace(/_/g, ' ') + ' (' + d.data.value + ') ')
      .style('text-transform', 'Capitalize')
      .style('font-size', 12)
      .style('fill', 'white');

  }

  drawlineLabels() {
    this.svg
      .attr('class', 'lines')
      .selectAll('polyline')
      .data(this.pie(piedata))
      .enter()
      .append('polyline')
      .attr('stroke', 'transparent')
      .attr('stroke-width', '1')
      .attr('fill', 'none')
      .attr('points', (d) => {
        let pos = this.labelArc.centroid(d);
        pos[0] = this.radius * 1.2 * (this.midAngle(d) < Math.PI ? 1 : -1);
        return [this.arc.centroid(d), this.labelArc.centroid(d), pos]
      });

    this.svg.attr('class', 'labels')
      .selectAll('text')
      .data(this.pie(piedata))
      .attr('dy', '.35em')
      .text((d) => d.data.name + '( ' + d.data.value + ' )')
      // .html(function(d) {
      //     return d.data.name;
      // })
      .attr('transform', (d) => {
        let pos = this.labelArc.centroid(d);
        pos[0] = this.radius * 1.2 * (this.midAngle(d) < Math.PI ? 1 : -1);
        return 'translate(' + pos + ')';
      })
      .style('text-anchor', (d) => {
        return (this.midAngle(d)) < Math.PI ? 'start' : 'end';
      })
      .style('font-size', 12)
      .style('fill', 'transparent');

  }

  midAngle(d) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
  }

  labelHighlight() {
    const parent = this;
    this.g.on('mouseover', function (d, i) {
      d3.select(this).select('path').style('stroke', 'black').style('stroke-width', '2');
      d3.select(this).select('text').style('fill', 'gray');
      d3.select(this).select('polyline').style('stroke', 'gray')
    }).on('mouseout', function (d, i) {
      d3.select(this).select('path').style('stroke', 'transparent').style('stroke-width', '0');
      d3.select(this).select('text').style('fill', 'transparent');
      d3.select(this).select('polyline').style('stroke', 'transparent')
    })
  }
}
