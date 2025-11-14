import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, ResponsiveContainer } from 'recharts';
import * as math from 'mathjs';

const DefiniteIntegrals = () => {
  const [fx, setFx] = useState('x^2');
  const [a, setA] = useState(0);
  const [b, setB] = useState(1);
  const [n, setN] = useState(100);
  const [result, setResult] = useState(0);
  const [surfaceLateral, setSurfaceLateral] = useState(null);
  const [surfaceLid, setSurfaceLid] = useState(null);
  const [surfaceTotal, setSurfaceTotal] = useState(null);
  const [analyticTotal, setAnalyticTotal] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState('');
  // Sólo cálculo de área (integral definida)
  const [xMin, setXMin] = useState(-1);
  const [xMax, setXMax] = useState(2);
  const [yMin, setYMin] = useState(-1);
  const [yMax, setYMax] = useState(5);
  const [xRangeStr, setXRangeStr] = useState(`[${xMin}, ${xMax}]`);
  const [yRangeStr, setYRangeStr] = useState(`[${yMin}, ${yMax}]`);

  // (Se eliminó visualización 3D de volumen por decisión de simplificar la UI)

  const evaluateFunction = (x) => {
    try {
      // Use math.js for safe evaluation
      return math.evaluate(fx, { x });
    } catch (e) {
      setError('Error en la función: ' + e.message);
      return 0;
    }
  };

  const calculateIntegral = () => {
    setError('');
    const h = (b - a) / n;
    let sum = 0;
    for (let i = 0; i < n; i++) {
      const x = a + i * h;
      const y = evaluateFunction(x);
        // Área bajo la curva (integral definida)
        sum += y * h;
    }
    setResult(sum);
  };

  // Numerical integration using composite Simpson's rule
  const compositeSimpson = (f, a0, b0, m) => {
    // m must be even
    let mEven = m;
    if (mEven % 2 === 1) mEven += 1;
    const h = (b0 - a0) / mEven;
    let s = f(a0) + f(b0);
    for (let i = 1; i < mEven; i++) {
      const x = a0 + i * h;
      s += (i % 2 === 0 ? 2 : 4) * f(x);
    }
    return (h / 3) * s;
  };

  const calculateSurfaceAreas = () => {
    setError('');
    try {
      // derivative node using math.js
      let derivativeNode = null;
      try {
        derivativeNode = math.derivative(fx, 'x');
      } catch (e) {
        derivativeNode = null;
      }

      const derivativeFn = (x) => {
        // Try symbolic derivative first (if available)
        if (derivativeNode) {
          try {
            const v = derivativeNode.evaluate({ x });
            if (Number.isFinite(v)) return v;
            // otherwise fall through to numeric fallback
          } catch (e) {
            // fall through to numeric fallback
          }
        }

        // Numeric fallback: adaptive finite differences
        const baseH = Math.max(1e-6, (Math.abs(b - a) || 1) * 1e-6);
        let h = baseH;
        try {
          // forward difference near left endpoint
          if (x - h < a) {
            const fx0 = evaluateFunction(x);
            const fx1 = evaluateFunction(x + h);
            const num = (fx1 - fx0) / h;
            if (Number.isFinite(num)) return num;
          } else if (x + h > b) {
            // backward difference near right endpoint
            const fx0 = evaluateFunction(x);
            const fxm = evaluateFunction(x - h);
            const num = (fx0 - fxm) / h;
            if (Number.isFinite(num)) return num;
          } else {
            // central difference
            const fxp = evaluateFunction(x + h);
            const fxm = evaluateFunction(x - h);
            const num = (fxp - fxm) / (2 * h);
            if (Number.isFinite(num)) return num;
          }
        } catch (err) {
          // fallthrough to finer h
        }

        // Try reducing h for better accuracy / avoid singularities
        for (let i = 0; i < 6; i++) {
          h = h / 10;
          try {
            if (x - h < a) {
              const fx0 = evaluateFunction(x);
              const fx1 = evaluateFunction(x + h);
              const num = (fx1 - fx0) / h;
              if (Number.isFinite(num)) return num;
            } else if (x + h > b) {
              const fx0 = evaluateFunction(x);
              const fxm = evaluateFunction(x - h);
              const num = (fx0 - fxm) / h;
              if (Number.isFinite(num)) return num;
            } else {
              const fxp = evaluateFunction(x + h);
              const fxm = evaluateFunction(x - h);
              const num = (fxp - fxm) / (2 * h);
              if (Number.isFinite(num)) return num;
            }
          } catch (err) {
            continue;
          }
        }

        // As last resort, return 0 (should be rare)
        return 0;
      };

      const integrand = (x) => {
        const y = evaluateFunction(x);
        const dydx = derivativeFn(x);
        const val = 2 * Math.PI * Math.abs(y) * Math.sqrt(1 + dydx * dydx);
        return val;
      };

      // Choose a sufficiently large even number of panels for Simpson
      let m = Math.max(1000, n);
      if (m % 2 === 1) m += 1;
      const A_lateral = compositeSimpson(integrand, a, b, m);
      const fB = evaluateFunction(b);
      const A_tapa = Math.PI * Math.max(0, fB) * Math.max(0, fB);
      const A_total = A_lateral + A_tapa;

      setSurfaceLateral(A_lateral);
      setSurfaceLid(A_tapa);
      setSurfaceTotal(A_total);

      // If matches the example y = sqrt(x), a=0, b=6 try to compute analytic value
      const normalizedFx = fx.replace(/\s+/g, '');
      if ((normalizedFx === 'sqrt(x)' || normalizedFx === 'x^(1/2)' || normalizedFx === 'x^0.5') && a === 0 && b === 6) {
        const analytic = (80 * Math.PI) / 3;
        setAnalyticTotal(analytic);
      } else {
        setAnalyticTotal(null);
      }
    } catch (e) {
      setError('Error calculando superficies: ' + e.message);
      setSurfaceLateral(null);
      setSurfaceLid(null);
      setSurfaceTotal(null);
      setAnalyticTotal(null);
    }
  };

  useEffect(() => {
    calculateIntegral();
    calculateSurfaceAreas();
  }, [fx, a, b, n]);

  useEffect(() => {
    const points = 200;
    const h = (b - a) / points;
    const data = [];

    for (let i = 0; i <= points; i++) {
      const x = a + i * h;
      const y = evaluateFunction(x);
      data.push({ x: parseFloat(x.toFixed(2)), y: y });
    }

    setChartData(data);
  }, [fx, a, b]);

  // keep the editable range strings in sync when numeric ranges change
  useEffect(() => {
    setXRangeStr(`[${xMin}, ${xMax}]`);
  }, [xMin, xMax]);

  useEffect(() => {
    setYRangeStr(`[${yMin}, ${yMax}]`);
  }, [yMin, yMax]);

  return (
    <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-cyan-400">Integrales Definidas</h2>

          <div className="mb-4">
            <p className="text-sm text-gray-300">Cálculo: <span className="font-semibold text-cyan-300">Área bajo la curva</span></p>
          </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Función f(x):
            </label>
            <input
              type="text"
              value={fx}
              onChange={(e) => setFx(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              placeholder="Ej: x^2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">a (límite inferior):</label>
              <input
                type="number"
                step="any"
                value={a}
                onChange={(e) => setA(parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                placeholder="Ej: 0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">b (límite superior):</label>
              <input
                type="number"
                step="any"
                value={b}
                onChange={(e) => setB(parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                placeholder="Ej: 1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">n (subintervalos):</label>
              <input
                type="number"
                value={n}
                onChange={(e) => setN(parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              />
            </div>
          </div>

          <div className="mb-4">
            <p className="text-gray-300">
              Resultado aproximado (Área): <span className="text-cyan-400 font-bold">{result.toFixed(6)}</span>
            </p>
            <p className="text-gray-400 text-sm">
              Intervalo: [{a.toFixed(4)}, {b.toFixed(4)}] con {n} subintervalos
            </p>
            {surfaceTotal !== null && (
              <div className="mt-3 text-gray-300">
                <p>Área lateral (numérica): <span className="text-cyan-400 font-bold">{surfaceLateral.toFixed(6)}</span></p>
                <p>Área tapa (x = b): <span className="text-cyan-400 font-bold">{surfaceLid.toFixed(6)}</span></p>
                <p className="mt-1">Área total (numérica): <span className="text-cyan-400 font-bold">{surfaceTotal.toFixed(6)}</span></p>
                {analyticTotal !== null && (
                  <p className="mt-1 text-sm text-gray-400">Resultado analítico (ejemplo): <span className="text-purple-300 font-semibold">{analyticTotal.toFixed(6)} ≈ 80π/3</span></p>
                )}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Intervalos de gráfica (formato coordenada):</label>
            <div className="grid grid-cols-1 gap-2">
              <div>
                <label className="block text-xs text-gray-400">X (min, max):</label>
                <input
                  type="text"
                  value={xRangeStr}
                  onChange={(e) => {
                    const v = e.target.value;
                    setXRangeStr(v);
                    const match = v.match(/\[(.+),\s*(.+)\]/);
                    if (match) {
                      try {
                        const newMin = math.evaluate(match[1]);
                        const newMax = math.evaluate(match[2]);
                        if (typeof newMin === 'number' && typeof newMax === 'number') {
                          setXMin(newMin);
                          setXMax(newMax);
                        }
                      } catch (err) {
                        // ignore transient parse errors while typing
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const match = e.target.value.match(/\[(.+),\s*(.+)\]/);
                    if (match) {
                      try {
                        const newMin = math.evaluate(match[1]);
                        const newMax = math.evaluate(match[2]);
                        if (typeof newMin === 'number' && typeof newMax === 'number') {
                          setXRangeStr(`[${newMin}, ${newMax}]`);
                        } else {
                          setXRangeStr(`[${xMin}, ${xMax}]`);
                        }
                      } catch (err) {
                        setXRangeStr(`[${xMin}, ${xMax}]`);
                      }
                    } else {
                      setXRangeStr(`[${xMin}, ${xMax}]`);
                    }
                  }}
                  className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400">Y (min, max):</label>
                <input
                  type="text"
                  value={yRangeStr}
                  onChange={(e) => {
                    const v = e.target.value;
                    setYRangeStr(v);
                    const match = v.match(/\[(.+),\s*(.+)\]/);
                    if (match) {
                      try {
                        const newMin = math.evaluate(match[1]);
                        const newMax = math.evaluate(match[2]);
                        if (typeof newMin === 'number' && typeof newMax === 'number') {
                          setYMin(newMin);
                          setYMax(newMax);
                        }
                      } catch (err) {
                        // ignore transient parse errors while typing
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const match = e.target.value.match(/\[(.+),\s*(.+)\]/);
                    if (match) {
                      try {
                        const newMin = math.evaluate(match[1]);
                        const newMax = math.evaluate(match[2]);
                        if (typeof newMin === 'number' && typeof newMax === 'number') {
                          setYRangeStr(`[${newMin}, ${newMax}]`);
                        } else {
                          setYRangeStr(`[${yMin}, ${yMax}]`);
                        }
                      } catch (err) {
                        setYRangeStr(`[${yMin}, ${yMax}]`);
                      }
                    } else {
                      setYRangeStr(`[${yMin}, ${yMax}]`);
                    }
                  }}
                  className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-600 text-white rounded">
              {error}
            </div>
          )}
        </div>
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="x"
                type="number"
                domain={[xMin, xMax]}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                domain={[yMin, yMax]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="y"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="y"
                stroke="#06b6d4"
                fill="#06b6d4"
                fillOpacity={0.3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DefiniteIntegrals;
