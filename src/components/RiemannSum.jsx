import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { evaluate, parse } from 'mathjs';

const RiemannSum = () => {
  const [a, setA] = useState(0);
  const [b, setB] = useState(4);
  const [n, setN] = useState(4);
  const [method, setMethod] = useState('midpoint');

  const functionStr = 'exp(t) + 1';

  const calculateRiemannSum = useMemo(() => {
    const deltaT = (b - a) / n;
    let sum = 0;
    const points = [];
    const rectangles = [];

    for (let i = 0; i < n; i++) {
      const x1 = a + i * deltaT;
      const x2 = a + (i + 1) * deltaT;

      let height;
      switch (method) {
        case 'left':
          height = evaluate(functionStr, { t: x1 });
          break;
        case 'right':
          height = evaluate(functionStr, { t: x2 });
          break;
        case 'midpoint':
        default:
          height = evaluate(functionStr, { t: (x1 + x2) / 2 });
          break;
        case 'trapezoid':
          const h1 = evaluate(functionStr, { t: x1 });
          const h2 = evaluate(functionStr, { t: x2 });
          height = (h1 + h2) / 2;
          break;
      }

      sum += height * deltaT;
      points.push({ t: x1, f: evaluate(functionStr, { t: x1 }) });
      rectangles.push({ x: x1, width: deltaT, height });
    }

    // Add last point
    points.push({ t: b, f: evaluate(functionStr, { t: b }) });

    return { sum, deltaT, points, rectangles };
  }, [a, b, n, method]);

  const chartData = useMemo(() => {
    const data = [];
    for (let t = a; t <= b; t += 0.1) {
      data.push({
        t: t.toFixed(2),
        f: evaluate(functionStr, { t })
      });
    }
    return data;
  }, [a, b]);

  const rectangleData = useMemo(() => {
    return calculateRiemannSum.rectangles.map((rect, index) => ({
      x: rect.x.toFixed(2),
      height: rect.height.toFixed(2),
      index
    }));
  }, [calculateRiemannSum.rectangles]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-cyan-400">Suma de Riemann</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Intervalo [a, b]</label>
          <div className="flex space-x-2">
            <input
              type="range"
              min="0"
              max="10"
              value={a}
              onChange={(e) => setA(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-sm">{a}</span>
          </div>
          <div className="flex space-x-2 mt-2">
            <input
              type="range"
              min="0"
              max="10"
              value={b}
              onChange={(e) => setB(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-sm">{b}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Número de subintervalos (n)</label>
          <input
            type="range"
            min="4"
            max="100"
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-sm">{n}</span>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Método</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
          >
            <option value="midpoint">Puntos medios</option>
            <option value="left">Izquierda</option>
            <option value="right">Derecha</option>
            <option value="trapezoid">Trapecios</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="t" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
              labelStyle={{ color: '#F9FAFB' }}
            />
            <Line type="monotone" dataKey="f" stroke="#06B6D4" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Aproximación con Rectángulos</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={rectangleData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="x" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
              labelStyle={{ color: '#F9FAFB' }}
            />
            <Bar dataKey="height" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-700 p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Cálculos</h3>
        <p>Δt = (b - a) / n = ({b} - {a}) / {n} = {calculateRiemannSum.deltaT.toFixed(4)}</p>
        <p>Suma de Riemann ≈ {calculateRiemannSum.sum.toFixed(4)}</p>
        <p className="text-cyan-400">El CPU realizó aproximadamente {calculateRiemannSum.sum.toFixed(2)} unidades de trabajo</p>
      </div>
    </div>
  );
};

export default RiemannSum;
