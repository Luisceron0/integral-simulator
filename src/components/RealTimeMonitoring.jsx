import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Play, Pause, RotateCcw } from 'lucide-react';

const RealTimeMonitoring = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [data, setData] = useState([]);
  const [time, setTime] = useState(0);
  const intervalRef = useRef(null);

  const startSimulation = () => {
    setIsRunning(true);
  };

  const pauseSimulation = () => {
    setIsRunning(false);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setData([]);
    setTime(0);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1;

          // Simulate resource consumption
          const memoryUsage = 50 + 20 * Math.sin(newTime * 0.1) + Math.random() * 10;
          const cpuUsage = 30 + 15 * Math.cos(newTime * 0.15) + Math.random() * 5;

          setData(prevData => {
            const newData = [...prevData, {
              time: newTime,
              memory: memoryUsage,
              cpu: cpuUsage,
              integral: prevData.length > 0 ? prevData[prevData.length - 1].integral + (memoryUsage + cpuUsage) * 0.1 : 0
            }];

            // Keep only last 100 points
            return newData.slice(-100);
          });

          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const totalWork = data.length > 0 ? data[data.length - 1].integral : 0;

  return (
    <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-cyan-400">Monitoreo en Tiempo Real - Integración Continua</h2>

      <div className="mb-4 p-3 md:p-4 bg-gray-700 rounded-lg">
        <p className="text-xs md:text-sm text-gray-300 mb-2 break-words">
          <strong>Contexto de Monitoreo:</strong> Esta simulación muestra el monitoreo continuo de recursos de un servidor en producción.
          Las funciones sinusoidales y cosenoidales modelan las fluctuaciones naturales del uso de memoria y CPU durante la ejecución de procesos, simulando un servidor web con carga variable.
        </p>
        <p className="text-xs md:text-sm text-gray-300 break-words">
          La integral acumulada representa el trabajo total realizado por el sistema desde el inicio del monitoreo, útil para análisis de rendimiento y detección de anomalías.
          Cada punto representa el consumo integrado de CPU y memoria en intervalos de tiempo discretos.
        </p>
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={startSimulation}
          disabled={isRunning}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded flex items-center space-x-2"
        >
          <Play size={16} />
          <span>Iniciar</span>
        </button>
        <button
          onClick={pauseSimulation}
          disabled={!isRunning}
          className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 px-4 py-2 rounded flex items-center space-x-2"
        >
          <Pause size={16} />
          <span>Pausar</span>
        </button>
        <button
          onClick={resetSimulation}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded flex items-center space-x-2"
        >
          <RotateCcw size={16} />
          <span>Reiniciar</span>
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-base md:text-lg font-semibold mb-2">Uso de Recursos en Tiempo Real</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9CA3AF" label={{ value: 'Tiempo (segundos)', position: 'insideBottom', offset: -5 }} />
            <YAxis stroke="#9CA3AF" label={{ value: 'Uso de Recursos', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
              labelStyle={{ color: '#F9FAFB' }}
            />
            <Line type="monotone" dataKey="memory" stroke="#3B82F6" strokeWidth={2} name="Memoria (MB)" />
            <Line type="monotone" dataKey="cpu" stroke="#06B6D4" strokeWidth={2} name="CPU (%)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-6">
        <h3 className="text-base md:text-lg font-semibold mb-2">Trabajo Total del Sistema (Integral Acumulativa)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9CA3AF" label={{ value: 'Tiempo (segundos)', position: 'insideBottom', offset: -5 }} />
            <YAxis stroke="#9CA3AF" label={{ value: 'Trabajo Total', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
              labelStyle={{ color: '#F9FAFB' }}
            />
            <Area
              type="monotone"
              dataKey="integral"
              stroke="#8B5CF6"
              fill="#8B5CF6"
              fillOpacity={0.3}
              name="Trabajo Total"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-700 p-3 md:p-4 rounded">
        <h3 className="text-base md:text-lg font-semibold mb-2">Métricas del Sistema en Tiempo Real</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs md:text-sm text-gray-300 break-words">Tiempo de monitoreo: {time} segundos</p>
            <p className="text-xs md:text-sm text-gray-300 break-words">Trabajo total integrado: {totalWork.toFixed(2)} unidades</p>
          </div>
          <div>
            {data.length > 0 && (
              <>
                <p className="text-xs md:text-sm text-gray-300 break-words">Memoria actual: {data[data.length - 1].memory.toFixed(2)} MB</p>
                <p className="text-xs md:text-sm text-gray-300 break-words">CPU actual: {data[data.length - 1].cpu.toFixed(2)} %</p>
                <p className="text-xs md:text-sm md:text-base text-cyan-400 font-semibold break-words">El servidor ha procesado {totalWork.toFixed(2)} unidades de trabajo en {time} segundos</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMonitoring;
