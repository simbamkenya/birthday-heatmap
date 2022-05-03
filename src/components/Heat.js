import React, { useState, useEffect, useRef} from 'react'
import { csv, scaleBand, select, scaleLinear, extent } from 'd3'
import { axisLeft } from 'd3'
import { axisTop } from 'd3'


function Heat() {
    const contRef = useRef(null)
    const [data, setData] = useState([])
    const [date, setDate]  = useState({month:0, day_of_month:0, year:0})
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
    const margin = { top: 10, right: 40, bottom: 40, left: 40 },
    width = 960 - margin.left - margin.right,
    height = 640 - margin.top - margin.bottom;

    useEffect(() => {

    const xAccessor = d => d.date_of_month;
    const yAccessor = d => d.month

     const svg = select(contRef.current)
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
        .style('font-size', "0.875em")
        
    svg.append('g')
        .call(axisTop(x).ticks(30))
        .style('font-size', "0.875em")

    //color scale
    const colorScale = scaleLinear()
        .domain(extent(data, d => d.births))
        .range(['#FFFDC9', '#931700'])
    // console.log(x.domain())
    // console.log(y.domain())
    const tooltip = select("#tooltip")
        .style("opacity", 0.5)
        .attr("class", "tooltip")
        .style("background-color", "#E5E7EB")
        .style("padding", "5px")
        .style('padding-bottom', '10px')
        

    function mouseenter(){
        tooltip
        .style("opacity", 1)
      
        select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }
    function mouseleave(e){
        tooltip
      .style("opacity", 0)
    select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
    }

    const handleMouseMove = (e,d) => {
        console.log(d)
        setDate(d)

    tooltip
      .style("left", e.pageX + "px")
      .style("top", e.pageY + "px")
    }

    svg.selectAll()
        .data(data)
        .enter()
        .append('rect')
        .attr('x', d=> x(d.date_of_month))
        .attr('y', d=> y(d.month))
        .attr('width', x.bandwidth())
        .attr('height', y.bandwidth())
        .attr('fill', d => colorScale(d.births))
        .on('mouseenter', mouseenter)
        .on('mousemove', handleMouseMove)
        .on('mouseleave', mouseleave)


    },[data])
    // console.log(data[0])

  return (
    <div className='relative'>
        <div id='tooltip' className='tooltip aboslute w-24'>
            <span className='inline-block text-lg'>Date: {date.date_of_month}-{date.month}-{date.year}</span>
            <span className='inline-block text-lg ml-2'>Births: {date.births} </span>
        </div>
        <svg viewBox={`0 0 ${width + 100} ${height}`}  ref={contRef}></svg>
    </div>
  )
}

export default Heat