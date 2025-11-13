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
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-cyan-400">Monitoreo en Tiempo Real</h2>

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
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9CA3AF" />
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

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Trabajo Acumulado</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
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
              name="Trabajo Acumulado"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-700 p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Estadísticas en Tiempo Real</h3>
        <p>Tiempo transcurrido: {time} segundos</p>
        <p>Trabajo acumulado: {totalWork.toFixed(2)} unidades</p>
        {data.length > 0 && (
          <>
            <p>Memoria actual: {data[data.length - 1].memory.toFixed(2)} MB</p>
            <p>CPU actual: {data[data.length - 1].cpu.toFixed(2)} %</p>
          </>
        )}
      </div>
    </div>
  );
};

export default RealTimeMonitoring;
