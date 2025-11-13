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
    <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-cyan-400 break-words">Suma de Riemann - Consumo de CPU</h2>

      <div className="mb-4 p-3 md:p-4 bg-gray-700 rounded-lg">
        <p className="text-xs md:text-sm text-gray-300 mb-2 break-words">
          <strong>Contexto de CPU:</strong> Esta simulación representa el consumo de CPU de un servidor durante un período de tiempo.
          La función f(t) = e^t + 1 modela cómo el uso de CPU aumenta exponencialmente con el tiempo debido a la carga de trabajo creciente.
        </p>
        <p className="text-xs md:text-sm text-gray-300 break-words">
          El intervalo [a,b] representa el período de medición: 'a' es el tiempo inicial (segundos) y 'b' es el tiempo final.
          Ajusta los parámetros para ver cómo diferentes intervalos de tiempo y métodos de aproximación afectan el cálculo del trabajo total realizado por el CPU.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs md:text-sm font-medium mb-2 break-words">Intervalo [a, b]</label>
          <div className="flex space-x-2">
            <input
              type="range"
              min="0"
              max="10"
              value={a}
              onChange={(e) => setA(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-xs md:text-sm">{a}</span>
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
            <span className="text-xs md:text-sm">{b}</span>
          </div>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium mb-2 break-words">Número de subintervalos (n)</label>
          <input
            type="range"
            min="4"
            max="100"
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-xs md:text-sm">{n}</span>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium mb-2">Método</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-xs md:text-sm"
          >
            <option value="midpoint">Puntos medios</option>
            <option value="left">Izquierda</option>
            <option value="right">Derecha</option>
            <option value="trapezoid">Trapecios</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-base md:text-lg font-semibold mb-2 break-words">Función de Consumo de CPU: f(t) = e^t + 1</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="t" stroke="#9CA3AF" label={{ value: 'Tiempo (segundos)', position: 'insideBottom', offset: -5 }} />
            <YAxis stroke="#9CA3AF" label={{ value: 'Uso de CPU (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
              labelStyle={{ color: '#F9FAFB' }}
              formatter={(value) => [`${value}%`, 'CPU']}
            />
            <Line type="monotone" dataKey="f" stroke="#06B6D4" strokeWidth={2} name="Uso de CPU" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-6">
        <h3 className="text-base md:text-lg font-semibold mb-2 break-words">Aproximación del Trabajo del CPU por Intervalos</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={rectangleData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="x" stroke="#9CA3AF" label={{ value: 'Tiempo (segundos)', position: 'insideBottom', offset: -5 }} />
            <YAxis stroke="#9CA3AF" label={{ value: 'Trabajo CPU', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
              labelStyle={{ color: '#F9FAFB' }}
              formatter={(value) => [`${value} unidades`, 'Trabajo']}
            />
            <Bar dataKey="height" fill="#8B5CF6" name="Trabajo por intervalo" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-700 p-3 md:p-4 rounded">
        <h3 className="text-base md:text-lg font-semibold mb-2 break-words">Análisis del Consumo de CPU</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs md:text-sm text-gray-300 break-words">Intervalo de tiempo: [{a}, {b}] segundos</p>
            <p className="text-xs md:text-sm text-gray-300 break-words">Subintervalos: {n}</p>
            <p className="text-xs md:text-sm text-gray-300 break-words">Δt = {calculateRiemannSum.deltaT.toFixed(4)} segundos</p>
          </div>
          <div>
            <p className="text-xs md:text-sm text-gray-300 break-words">Método: {method === 'midpoint' ? 'Puntos medios' : method === 'left' ? 'Izquierda' : method === 'right' ? 'Derecha' : 'Trapecios'}</p>
            <p className="text-xs md:text-sm text-gray-300 break-words">Trabajo total aproximado: {calculateRiemannSum.sum.toFixed(4)} unidades</p>
            <p className="text-xs md:text-sm md:text-base text-cyan-400 font-semibold break-words">El CPU procesó {calculateRiemannSum.sum.toFixed(2)} unidades de trabajo en {b - a} segundos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiemannSum;
