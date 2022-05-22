import React, { FunctionComponent, createRef, useEffect, useState } from 'react';

import Chart from 'chart.js/auto'
import './Chart.css'

import { useStore } from '../../../../store';
import { getDateString } from '../../../../Util';
import Indicator from './../../../../assets/Indicator.svg'

interface Props{

}
const LockedChart: FunctionComponent<Props> = () => {
  const {state, dispatch} = useStore();  
  const data = state.amountHistory;

  const [chart, setChart] = useState<Chart | undefined>(undefined);

  let canvasRef = createRef<HTMLCanvasElement>();
  let tooltipRef = createRef<HTMLDivElement>();

  const createChart = () => {
    if(canvasRef.current == null)
      return;

    var canvas = canvasRef.current;
    var ctx = canvas?.getContext('2d');
    var gradient = ctx?.createLinearGradient(0, 0, 0, 400);
    gradient?.addColorStop(0, 'rgba(10, 147, 150, 0.21)');   
    gradient?.addColorStop(0.9, 'rgba(255, 255, 255, 0)');

    if(chart != undefined)
      chart.destroy();

    let _chart = new Chart(canvasRef.current, {
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
              let element = document.getElementById(`tooltipTotalLocked`);
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

                  div1.innerHTML = `${getDateString(item.time/10 ** 9)}`;
                  div2.innerHTML = `$${item.totalUSD.toLocaleString()}`;

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
              drawBorder: false,
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
            data: data.map(({ totalUSD }) =>
              totalUSD,
            ),
            borderColor: "#F9D85E",
            borderWidth: 2,
            fill: {
              target: 'origin',
              above: gradient,   // Area will be red above the origin
            }
          },
        ],
      },
    });
    setChart(_chart);

  };

  useEffect(()=>{
    if(data.length == 0)
      return;

    createChart()
  }, [data])

  return (
    <div style={{width: '100%', position: 'relative', height: '330px', marginTop:'30px'}}>
      <canvas ref={canvasRef} id= 'lockedChart'/>
      <div ref={tooltipRef} className="root" id={`tooltipTotalLocked`} >
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


export default LockedChart;