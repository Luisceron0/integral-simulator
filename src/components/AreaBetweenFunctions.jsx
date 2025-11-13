import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { evaluate, parse, solve } from 'mathjs';

const AreaBetweenFunctions = () => {
  const [mParam, setMParam] = useState(5);
  const [cParam, setCParam] = useState(5);

  const memoryFunc = `(t + ${mParam}) ** 2`;
  const cpuFunc = `-t + ${cParam}`;

  const calculateIntersectionsAndArea = useMemo(() => {
    try {
      // Solve (t + mParam)^2 = -t + cParam
      const equation = `(t + ${mParam}) ** 2 + t - ${cParam}`;
      const derivative = `2 * (t + ${mParam}) + 1`;

      // Find intersections numerically
      const intersections = [];
      for (let t = -10; t <= 10; t += 0.1) {
        const mVal = evaluate(memoryFunc, { t });
        const cVal = evaluate(cpuFunc, { t });
        if (Math.abs(mVal - cVal) < 0.1) {
          intersections.push(t);
        }
      }

      // Remove duplicates
      const uniqueIntersections = [...new Set(intersections.map(x => Math.round(x * 10) / 10))];

      if (uniqueIntersections.length >= 2) {
        const a = Math.min(...uniqueIntersections);
        const b = Math.max(...uniqueIntersections);

        // Calculate area using numerical integration
        let area = 0;
        const steps = 1000;
        const dt = (b - a) / steps;

        for (let i = 0; i < steps; i++) {
          const t = a + i * dt;
          const mVal = evaluate(memoryFunc, { t });
          const cVal = evaluate(cpuFunc, { t });
          area += Math.abs(mVal - cVal) * dt;
        }

        return { intersections: uniqueIntersections, area, a, b };
      }

      return { intersections: uniqueIntersections, area: 0, a: 0, b: 0 };
    } catch (error) {
      console.error('Error calculating intersections:', error);
      return { intersections: [], area: 0, a: 0, b: 0 };
    }
  }, [mParam, cParam]);

  const chartData = useMemo(() => {
    const data = [];
    for (let t = -10; t <= 10; t += 0.1) {
      const mVal = evaluate(memoryFunc, { t });
      const cVal = evaluate(cpuFunc, { t });
      data.push({
        t: t.toFixed(2),
        memory: mVal,
        cpu: cVal,
        difference: Math.abs(mVal - cVal)
      });
    }
    return data;
  }, [memoryFunc, cpuFunc]);

  const areaData = useMemo(() => {
    if (calculateIntersectionsAndArea.intersections.length < 2) return [];

    const a = calculateIntersectionsAndArea.a;
    const b = calculateIntersectionsAndArea.b;
    const data = [];

    for (let t = a; t <= b; t += 0.1) {
      const mVal = evaluate(memoryFunc, { t });
      const cVal = evaluate(cpuFunc, { t });
      data.push({
        t: t.toFixed(2),
        memory: mVal,
        cpu: cVal,
        fill: mVal > cVal ? mVal : cVal
      });
    }
    return data;
  }, [calculateIntersectionsAndArea, memoryFunc, cpuFunc]);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-cyan-400">Área entre Funciones</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Parámetro Memoria (M(t) = (t + x)²)</label>
          <input
            type="range"
            min="1"
            max="10"
            value={mParam}
            onChange={(e) => setMParam(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-sm">{mParam}</span>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Parámetro CPU (C(t) = -t + y)</label>
          <input
            type="range"
            min="1"
            max="10"
            value={cParam}
            onChange={(e) => setCParam(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-sm">{cParam}</span>
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
            <Line type="monotone" dataKey="memory" stroke="#3B82F6" strokeWidth={2} name="Memoria (MB)" />
            <Line type="monotone" dataKey="cpu" stroke="#06B6D4" strokeWidth={2} name="CPU (%)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {areaData.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Región Acotada</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={areaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="t" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                labelStyle={{ color: '#F9FAFB' }}
              />
              <Area
                type="monotone"
                dataKey="fill"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="bg-gray-700 p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Cálculos</h3>
        <p>Funciones:</p>
        <p>M(t) = (t + {mParam})² [Memoria en MB]</p>
        <p>C(t) = -t + {cParam} [CPU en %]</p>
        {calculateIntersectionsAndArea.intersections.length > 0 && (
          <>
            <p>Puntos de intersección: {calculateIntersectionsAndArea.intersections.map(x => x.toFixed(2)).join(', ')}</p>
            <p>Área = ∫|M(t) - C(t)|dt ≈ {calculateIntersectionsAndArea.area.toFixed(2)}</p>
            <p className="text-cyan-400">Diferencia acumulada de recursos: {calculateIntersectionsAndArea.area.toFixed(2)} MB·minuto</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AreaBetweenFunctions;
