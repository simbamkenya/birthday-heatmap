import React, { useState, useEffect, useRef} from 'react'
import { csv, scaleBand, select, scaleLinear, extent } from 'd3'
import { axisLeft } from 'd3'
import { axisTop } from 'd3'


function Heat() {
    const contRef = useRef(null)
    const [data, setData] = useState([])
    useEffect(() => {
        csv('https://raw.githubusercontent.com/fivethirtyeight/data/master/births/US_births_2000-2014_SSA.csv',
            d=> {
                return {
                    births: +d.births,
                    date_of_month: +d.date_of_month,
                    day_of_week: +d.day_of_week,
                    month: +d.month,
                    year: +d.year
                }

            })
            .then(data => setData(data))
    },[])

    useEffect(() => {

     const margin = { top: 40, right: 40, bottom: 40, left: 40 },
         width = 960 - margin.left - margin.right,
         height = 640 - margin.top - margin.bottom;

    const xAccessor = d => d.date_of_month;
    const yAccessor = d => d.month

     const svg = select(contRef.current).append('svg')
         .attr('width', width + margin.left + margin.right)
         .attr('height', height + margin.top + margin.bottom)
       .append('g')
         .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const months = [...new Set(data.map(d => d.month))]
    const days = [...new Set(data.map(d => d.date_of_month))]
    console.log(days)

    //xscale
    const x = scaleBand()
        .domain(days)
        .range([0, width])
        .padding(0.02)
        

    //yscale
    const y = scaleBand()
        .domain(months)
        .range([height, 0])
        .padding(0.02)
        

    svg.append('g')
        .call(axisLeft(y).ticks(12))
        .attr('stroke', "red")
        
    svg.append('g')
        .call(axisTop(x).ticks(30))

    //color scale
    const colorScale = scaleLinear()
        .domain(extent(data, d => d.births))
        .range(['#FFFDC9', '#931700'])
    // console.log(x.domain())
    // console.log(y.domain())

    svg.selectAll()
        .data(data)
        .enter()
        .append('rect')
        .attr('x', d=> x(d.date_of_month))
        .attr('y', d=> y(d.month))
        .attr('width', x.bandwidth())
        .attr('height', y.bandwidth())
        .attr('fill', d => colorScale(d.births))


    },[data])
    console.log(data[0])

  return (
    <div ref={contRef}></div>
  )
}

export default Heat