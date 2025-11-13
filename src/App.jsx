import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/Tabs';
import RiemannSum from './components/RiemannSum';
import AreaBetweenFunctions from './components/AreaBetweenFunctions';
import RealTimeMonitoring from './components/RealTimeMonitoring';
import EducationalPanel from './components/EducationalPanel';

function App() {
  const [activeTab, setActiveTab] = useState('riemann');

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-cyan-400">
          Simulador de Consumo de Recursos - Cálculo Integral
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                <TabsTrigger value="riemann" className="data-[state=active]:bg-cyan-600">
                  Suma de Riemann
                </TabsTrigger>
                <TabsTrigger value="area" className="data-[state=active]:bg-cyan-600">
                  Área entre Funciones
                </TabsTrigger>
                <TabsTrigger value="realtime" className="data-[state=active]:bg-cyan-600">
                  Monitoreo en Tiempo Real
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
