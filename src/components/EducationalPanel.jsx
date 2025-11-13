import React from 'react';

const EducationalPanel = ({ activeTab }) => {
  const content = {
    riemann: {
      title: "¿Qué es una Suma de Riemann?",
      explanation: "La suma de Riemann divide el intervalo [a,b] en n subintervalos y aproxima el área bajo la curva f(x) usando rectángulos. En el contexto de CPU, 'a' es el tiempo inicial y 'b' es el tiempo final del intervalo de medición. Cada rectángulo representa el trabajo realizado en un pequeño intervalo de tiempo Δt.",
      formula: "S = Σ f(tᵢ) Δt donde tᵢ ∈ [a,b]",
      applications: "Se utiliza para calcular consumo de energía del CPU, tiempo de procesamiento y recursos utilizados en intervalos discretos. Los diferentes métodos (izquierdo, derecho, medio, trapezoidal) ofrecen diferentes niveles de precisión."
    },
    area: {
      title: "¿Por qué calcular área entre funciones?",
      explanation: "El área entre dos funciones M(t) y C(t) representa la diferencia acumulada entre memoria utilizada y capacidad del CPU a lo largo del tiempo. Un área positiva indica que la memoria excede la capacidad del CPU, sugiriendo posibles cuellos de botella.",
      formula: "Área = ∫[M(t) - C(t)] dt entre intersecciones",
      applications: "Útil para analizar desbalances entre demanda de memoria y capacidad de procesamiento, optimizar asignación de recursos y predecir necesidades futuras de hardware en sistemas distribuidos."
    },
    realtime: {
      title: "Monitoreo Continuo de Recursos",
      explanation: "La integración en tiempo real acumula el trabajo total realizado por el sistema. Muestra cómo el consumo de recursos se integra a lo largo del tiempo, permitiendo observar tendencias y detectar anomalías en el rendimiento del sistema.",
      formula: "Trabajo(t) = ∫₀ᵗ [CPU(τ) + Memoria(τ)] dτ",
      applications: "Monitoreo de sistemas en producción, análisis de rendimiento en tiempo real, detección de anomalías en el consumo de recursos y optimización de la eficiencia energética de servidores."
    }
  };

  const currentContent = content[activeTab];

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-fit">
      <h2 className="text-2xl font-bold mb-4 text-cyan-400">Información Educativa</h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-purple-400 mb-2">
            {currentContent.title}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {currentContent.explanation}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-cyan-300 mb-1">Fórmula Matemática:</h4>
          <div className="bg-gray-700 p-3 rounded font-mono text-center text-purple-300">
            {currentContent.formula}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-cyan-300 mb-1">Aplicaciones en Ingeniería:</h4>
          <p className="text-gray-300 text-sm leading-relaxed">
            {currentContent.applications}
          </p>
        </div>

        <div className="border-t border-gray-600 pt-4">
          <h4 className="font-semibold text-cyan-300 mb-2">Consejos de Uso:</h4>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Ajusta los parámetros para ver cambios en tiempo real</li>
            <li>• Observa cómo diferentes métodos afectan la precisión</li>
            <li>• Compara resultados teóricos con aproximaciones numéricas</li>
            <li>• Experimenta con diferentes intervalos de tiempo</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EducationalPanel;
