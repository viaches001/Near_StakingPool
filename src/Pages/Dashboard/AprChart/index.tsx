import React, { FunctionComponent, createRef, useEffect } from 'react';
import { HStack, VStack, Flex, Text, Image, Button, Box } from '@chakra-ui/react'

import Chart from 'chart.js/auto'
import './Chart.css'
import { getDateString } from '../../../Util';
import Indicator from './../../../assets/Indicator.svg'

interface Props{
  data: {
    time: number,
    apr: number
  }[],
  id: string
}
const AprChart: FunctionComponent<Props> = ({data, id}) => {
  let canvasRef = createRef<HTMLCanvasElement>();
  let tooltipRef = createRef<HTMLDivElement>();
  let chart!: Chart;

  const createChart = () => {
    if(canvasRef.current == null)
      return;
    chart = new Chart(canvasRef.current, {
      type: 'line',
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,

            external: ({ chart, tooltip }) => {
              // let element = tooltipRef.current;
              let element = document.getElementById(`tooltip${id}`);
              if(element == null)
                return;

              if (tooltip.opacity === 0) {
                element.style.opacity = '0';
                return;
              }

              const div1 = element.querySelector('div:nth-child(2)');
              const div2 = element.querySelector('div:nth-child(3)');
              const div3 = element.querySelector('div:nth-child(1)');
              const hr = element.querySelector('hr');

              if (div1 && div2 && div3) {
                try {
                  const i = tooltip.dataPoints[0].dataIndex;
                  const item = data[i];

                  div1.innerHTML = `${getDateString(item.time)}`;
                  div2.innerHTML = `${item.apr/100}%`;

                  let style="border-radius: 50%; background-color: #493C3C; width: 20px; height: 20px; position: absolute; ";
                  style += `top: ${chart.scales.y.height-10}px;`;
                  div3.setAttribute('style', style);
                } catch {}
              }

              if (hr) {
                hr.style.top = chart.scales.y.paddingTop + 'px';
                hr.style.height = chart.scales.y.height + 'px';
              }
              
              element.style.opacity = '1';
              element.style.transform = `translateX(${tooltip.caretX}px)`;
            },
          },
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
        scales: {
          x: {
            grid: {
              borderColor: '#434040',
              display: false,
            },
            ticks: {
              display: false,
            },
          },
          y: {
            // grace: '0%',
            display: false,
          },
        },
        elements: {
          point: {
            radius: 0,
            hoverRadius: 10,
            backgroundColor: '#F9D85E'
          },
        },
      },
      data: {
        labels: data.map(({ time }) => time.toString()),
        datasets: [
          {
            data: data.map(({ apr }) =>
              apr,
            ),
            borderColor: "#F9D85E",
            borderWidth: 2,
          },
        ],
      },
    });
  };

  useEffect(()=>{
    createChart()
  }, [])
  return (
    <div style={{width: '100%', position: 'relative', height: '300px', marginTop:'30px'}}>
      <canvas ref={canvasRef} />
      <div ref={tooltipRef} className="root" id={`tooltip${id}`} >
        <hr className="hr0"/>
        <section className="section0">
          <div className="div0" >
            <img src={Indicator} alt="loading" style={{maxWidth:'10px'}}/>
          </div>
          <div className="div0"/>
          <div className="div0" style={{marginTop: '45px'}}/>
         </section>
      </div>      
    </div>
  );
}


export default AprChart;