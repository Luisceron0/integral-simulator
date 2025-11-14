import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/Tabs';
import RiemannSum from './components/RiemannSum';
import AreaBetweenFunctions from './components/AreaBetweenFunctions';
import RealTimeMonitoring from './components/RealTimeMonitoring';
import DefiniteIntegrals from './components/DefiniteIntegrals';
import EducationalPanel from './components/EducationalPanel';

function App() {
  const [activeTab, setActiveTab] = useState('riemann');

  return (
    <div className="min-h-screen bg-gray-900 text-white p-3 md:p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-6 md:mb-8 text-cyan-400 break-words">
          Simulador de Recursos Computacionales - Cálculo Integral
        </h1>

        <div className="mb-6 p-3 md:p-4 bg-gray-700 rounded-lg max-w-4xl mx-auto">
          <p className="text-center text-xs md:text-sm text-gray-300 mb-2 break-words">
            <strong>Objetivo Educativo:</strong> Este simulador demuestra cómo los conceptos del cálculo integral se aplican al monitoreo y análisis de recursos computacionales.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs md:text-sm text-gray-300">
            <div className="text-center break-words">
              <strong className="text-cyan-400">Nivel Básico</strong><br/>
              Suma de Riemann para aproximar uso acumulado de CPU
            </div>
            <div className="text-center break-words">
              <strong className="text-cyan-400">Nivel Intermedio</strong><br/>
              Área entre funciones para comparar Memoria vs CPU
            </div>
            <div className="text-center break-words">
              <strong className="text-cyan-400">Nivel Avanzado</strong><br/>
              Integración en tiempo real para monitoreo continuo
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                <TabsTrigger value="riemann" className="data-[state=active]:bg-cyan-600">
                  Suma de Riemann
                </TabsTrigger>
                <TabsTrigger value="area" className="data-[state=active]:bg-cyan-600">
                  Área entre Funciones
                </TabsTrigger>
                <TabsTrigger value="realtime" className="data-[state=active]:bg-cyan-600">
                  Monitoreo en Tiempo Real
                </TabsTrigger>
                <TabsTrigger value="integrals" className="data-[state=active]:bg-cyan-600">
                  Integrales Definidas
                </TabsTrigger>
              </TabsList>

              <TabsContent value="riemann" className="mt-6">
                <RiemannSum />
              </TabsContent>

              <TabsContent value="area" className="mt-6">
                <AreaBetweenFunctions />
              </TabsContent>

              <TabsContent value="realtime" className="mt-6">
                <RealTimeMonitoring />
              </TabsContent>

              <TabsContent value="integrals" className="mt-6">
                <DefiniteIntegrals />
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <EducationalPanel activeTab={activeTab} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
