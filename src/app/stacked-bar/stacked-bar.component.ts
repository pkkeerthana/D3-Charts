import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Axis from 'd3-axis';
import * as d3Array from 'd3-array';

export interface Margin {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

@Component({
    selector: 'app-stacked-bar',
    templateUrl: './stacked-bar.component.html',
    styleUrls: ['./stacked-bar.component.css']
})
export class StackedBarComponent implements OnInit {

    title = 'Stacked Bar Chart';

    private margin: Margin;

    private width: number;
    private height: number;

    private svg: any;     // TODO replace all `any` by the right type

    private x: any;
    private y: any;
    private z: any;
    private g: any;
    sample_data: any[] = [
        { State: 'AL', 'Under 5 Years': 310504, '5 to 13 Years': 552339, '14 to 17 Years': 259034, '18 to 24 Years': 450818, '25 to 44 Years': 1231572, '45 to 64 Years': 1215966, '65 Years and Over': 641667 },
        { State: 'AK', 'Under 5 Years': 52083, '5 to 13 Years': 85640, '14 to 17 Years': 42153, '18 to 24 Years': 74257, '25 to 44 Years': 198724, '45 to 64 Years': 183159, '65 Years and Over': 50277 },
        { State: 'AZ', 'Under 5 Years': 515910, '5 to 13 Years': 828669, '14 to 17 Years': 362642, '18 to 24 Years': 601943, '25 to 44 Years': 1804762, '45 to 64 Years': 1523681, '65 Years and Over': 862573 },
        { State: 'AR', 'Under 5 Years': 202070, '5 to 13 Years': 343207, '14 to 17 Years': 157204, '18 to 24 Years': 264160, '25 to 44 Years': 754420, '45 to 64 Years': 727124, '65 Years and Over': 407205 },
        { State: 'CA', 'Under 5 Years': 2704659, '5 to 13 Years': 4499890, '14 to 17 Years': 2159981, '18 to 24 Years': 3853788, '25 to 44 Years': 10604510, '45 to 64 Years': 8819342, '65 Years and Over': 4114496 },
        { State: 'CO', 'Under 5 Years': 358280, '5 to 13 Years': 587154, '14 to 17 Years': 261701, '18 to 24 Years': 466194, '25 to 44 Years': 1464939, '45 to 64 Years': 1290094, '65 Years and Over': 511094 },
        { State: 'CT', 'Under 5 Years': 211637, '5 to 13 Years': 403658, '14 to 17 Years': 196918, '18 to 24 Years': 325110, '25 to 44 Years': 916955, '45 to 64 Years': 968967, '65 Years and Over': 478007 },
        { State: 'DE', 'Under 5 Years': 59319, '5 to 13 Years': 99496, '14 to 17 Years': 47414, '18 to 24 Years': 84464, '25 to 44 Years': 230183, '45 to 64 Years': 230528, '65 Years and Over': 121688 },
        { State: 'DC', 'Under 5 Years': 36352, '5 to 13 Years': 50439, '14 to 17 Years': 25225, '18 to 24 Years': 75569, '25 to 44 Years': 193557, '45 to 64 Years': 140043, '65 Years and Over': 70648 },
        { State: 'FL', 'Under 5 Years': 1140516, '5 to 13 Years': 1938695, '14 to 17 Years': 925060, '18 to 24 Years': 1607297, '25 to 44 Years': 4782119, '45 to 64 Years': 4746856, '65 Years and Over': 3187797 },
        { State: 'GA', 'Under 5 Years': 740521, '5 to 13 Years': 1250460, '14 to 17 Years': 557860, '18 to 24 Years': 919876, '25 to 44 Years': 2846985, '45 to 64 Years': 2389018, '65 Years and Over': 981024 },
        { State: 'HI', 'Under 5 Years': 87207, '5 to 13 Years': 134025, '14 to 17 Years': 64011, '18 to 24 Years': 124834, '25 to 44 Years': 356237, '45 to 64 Years': 331817, '65 Years and Over': 190067 },
        { State: 'ID', 'Under 5 Years': 121746, '5 to 13 Years': 201192, '14 to 17 Years': 89702, '18 to 24 Years': 147606, '25 to 44 Years': 406247, '45 to 64 Years': 375173, '65 Years and Over': 182150 },
        { State: 'IL', 'Under 5 Years': 894368, '5 to 13 Years': 1558919, '14 to 17 Years': 725973, '18 to 24 Years': 1311479, '25 to 44 Years': 3596343, '45 to 64 Years': 3239173, '65 Years and Over': 1575308 },
        { State: 'IN', 'Under 5 Years': 443089, '5 to 13 Years': 780199, '14 to 17 Years': 361393, '18 to 24 Years': 605863, '25 to 44 Years': 1724528, '45 to 64 Years': 1647881, '65 Years and Over': 813839 },
        { State: 'IA', 'Under 5 Years': 201321, '5 to 13 Years': 345409, '14 to 17 Years': 165883, '18 to 24 Years': 306398, '25 to 44 Years': 750505, '45 to 64 Years': 788485, '65 Years and Over': 444554 }
    ];

    constructor() { }

    ngOnInit() {
        this.initMargins();
        this.initSvg();
        this.drawChart(this.sample_data);
    }

    private initMargins() {
        this.margin = { top: 20, right: 20, bottom: 30, left: 40 };
    }

    private initSvg() {
        this.svg = d3.select('svg');

        this.width = +this.svg.attr('width') - this.margin.left - this.margin.right;
        this.height = +this.svg.attr('height') - this.margin.top - this.margin.bottom;
        this.g = this.svg.append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        this.x = d3Scale.scaleBand()
            .rangeRound([0, this.width])
            .paddingInner(0.05)
            .align(0.1);
        this.y = d3Scale.scaleLinear()
            .rangeRound([this.height, 0]);
        this.z = d3Scale.scaleOrdinal()
            .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']);
    }

    private drawChart(data: any[]) {

        let keys = Object.getOwnPropertyNames(data[0]).slice(1);

        data = data.map(v => {
            v.total = keys.map(key => v[key]).reduce((a, b) => a + b, 0);
            return v;
        });
        data.sort((a: any, b: any) => b.total - a.total);

        this.x.domain(data.map((d: any) => d.State));
        this.y.domain([0, d3Array.max(data, (d: any) => d.total)]).nice();
        this.z.domain(keys);

        this.g.append('g')
            .selectAll('g')
            .data(d3Shape.stack().keys(keys)(data))
            .enter().append('g')
            .attr('fill', d => this.z(d.key))
            .selectAll('rect')
            .data(d => d)
            .enter().append('rect')
            .attr('x', d => this.x(d.data.State))
            .attr('y', d => this.y(d[1]))
            .attr('height', d => this.y(d[0]) - this.y(d[1]))
            .attr('width', this.x.bandwidth());

        this.g.append('g')
            .attr('class', 'axis')
            .style('stroke', 'white')
            .style('fill', 'white')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(d3Axis.axisBottom(this.x));

        this.g.append('g')
            .attr('class', 'axis')
            .style('stroke', 'white')
            .style('fill', 'white')
            .call(d3Axis.axisLeft(this.y).ticks(null, 's'))
            .append('text')
            .attr('x', 2)
            .attr('y', this.y(this.y.ticks().pop()) + 0.5)
            .attr('dy', '0.32em')
            .attr('fill', '#000')
            .attr('font-weight', 'bold')
            .attr('text-anchor', 'start')
            .text('Population');

        let legend = this.g.append('g')
            .attr('font-family', 'sans-serif')
            .attr('font-size', 10)
            .attr('text-anchor', 'end')
            .selectAll('g')
            .data(keys.slice().reverse())
            .enter().append('g')
            .attr('transform', (d, i) => 'translate(0,' + i * 20 + ')');

        legend.append('rect')
            .attr('x', this.width - 19)
            .attr('width', 19)
            .attr('height', 19)
            .attr('fill', this.z);

        legend.append('text')
            .attr('x', this.width - 24)
            .attr('y', 9.5)
            .attr('dy', '0.32em')
            .style('fill','white')
            .text(d => d);
    }

}
