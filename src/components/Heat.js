import React, { useState, useEffect, useRef} from 'react'
import { csv, scaleBand, select, scaleLinear, extent } from 'd3'
import { axisLeft } from 'd3'
import { axisTop } from 'd3'


function Heat() {
    const contRef = useRef(null)
    const [data, setData] = useState([])
    const [date, setDate]  = useState({month:0, day_of_month:0, year:0})

    function reverseArray(arr) {
        return arr.slice().reverse();
      } 

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      
    useEffect(() => {
        csv('https://raw.githubusercontent.com/fivethirtyeight/data/master/births/US_births_2000-2014_SSA.csv',
            d=> {
                return {
                    births: +d.births,
                    date_of_month: +d.date_of_month,
                    day_of_week: +d.day_of_week,
                    month: months[+d.month - 1],
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

    const months = reverseArray([...new Set(data.map(d => d.month))])
    const days = [...new Set(data.map(d => d.date_of_month))]
    console.log(months)

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
        

   const yAxis = svg.append('g')
        .call(axisLeft(y).ticks(12))
        .style('font-size', "0.875em")
        
   const xAxis = svg.append('g')
        .call(axisTop(x).ticks(30))
        .style('font-size', "0.875em")

    xAxis.selectAll("path")
        .style("stroke", "white")
        .style("opacity", 0);

    xAxis.selectAll("text")
        .style("fill", "white")
    
    xAxis.selectAll("line")
        .style("opacity", 0)
    
    yAxis.selectAll("path")
    .style("stroke", "white")
    .style("opacity", 0);

    yAxis.selectAll("line")
    .style("opacity", 0)

    xAxis.selectAll("text")
    .style("fill", "white")

    yAxis.selectAll("text")
    .style("fill", "white")

    //color scale
    const colorScale = scaleLinear()
        .domain(extent(data, d => d.births))
        .range(['#DCF0FB', '#106A9E'])
    // console.log(x.domain())
    // console.log(y.domain())
    const tooltip = select("#tooltip")
        .style("opacity", 0.5)
        .attr("class", "tooltip")
        .style("background-color", "#E5E7EB")
        .style("padding", "5px")
        .style('padding-bottom', '10px')
        .style("position", 'absolute')
        

    function mouseenter(){
        tooltip
        .style("opacity", 1)
      
        select(this)
        .style("stroke", "#C97B0D")
        .style("stroke-width", 3)
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
        console.log(e.clientX)
        setDate(d)

    tooltip
      .style("left", (e.clientX - 120 ) + "px")
      .style("top", e.clientY + "px")
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
        <div id='tooltip' className='absolute'>
            <span className='inline-block text-sm'>Date: {date.date_of_month}-{date.month}-{date.year}</span> <br/>
            <span className='inline-block text-sm'>Births: {date.births} </span>
        </div>
        <svg viewBox={`0 0 ${width + 100} ${height}`}  ref={contRef}></svg>
    </div>
  )
}

export default Heat