import { Group } from '@visx/group';
import { Pie } from '@visx/shape';
import { Text } from '@visx/text';
import React, { useState } from 'react';

const coins = [
  { symbol: 'ADA', amount: 200, color: '#0033ad', inUSD: 1.48 },
  { symbol: 'SOL', amount: 5, color: '#00ffbd', inUSD: 37.6 },
  { symbol: 'BTC', amount: 0.005, color: '#F7931A', inUSD: 37363 },
];

const PieChart = () => {
  const [active, setActive] = useState(null);
  const width = 400;
  const half = width / 2;
  return (
    <div>
      <svg width={width} height={width}>
        <Group top={half} left={half}>
          <Pie
            data={coins}
            pieValue={(data) => data.amount * data.inUSD}
            outerRadius={half}
            innerRadius={({ data }) => {
              const size = active && active.symbol === data.symbol ? 15 : 12;
              return half - size;
            }}
            padAngle={0.02}
          >
            {(pie) => {
              console.log(pie);
              return pie.arcs.map((arc) => (
                <g
                  key={arc.data.symbol}
                  onMouseEnter={() => setActive(arc.data)}
                  onMouseLeave={() => setActive(null)}
                >
                  <path d={pie.path(arc)} fill={arc.data.color}></path>
                </g>
              ));
            }}
          </Pie>
          {active ? (
            <>
              <Text
                fill={active.color}
                textAnchor="middle"
                fontSize={40}
                dy={-20}
              >
                {`$${Math.floor(active.amount * active.inUSD)}`}
              </Text>
              <Text
                fill={active.color}
                textAnchor="middle"
                fontSize={20}
                dy={20}
              >
                {`${active.amount} ${active.symbol}`}
              </Text>
            </>
          ) : (
            <>
              <Text fill="#fff" textAnchor="middle" fontSize={40} dy={-20}>
                {`$${Math.floor(
                  coins.reduce((acc, coin) => acc + coin.amount * coin.inUSD, 0)
                )}`}
              </Text>
              <Text fill="#ccc" textAnchor="middle" fontSize={20} dy={20}>
                {`${coins.length} Assets`}
              </Text>
            </>
          )}
        </Group>
      </svg>
    </div>
  );
};

export default PieChart;
