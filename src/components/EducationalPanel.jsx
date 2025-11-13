import React from 'react';

const EducationalPanel = ({ activeTab }) => {
  const content = {
    riemann: {
      title: "¿Qué es una Suma de Riemann?",
      explanation: "La suma de Riemann es una aproximación del área bajo una curva mediante rectángulos. En el contexto de recursos computacionales, representa el trabajo total realizado por el CPU en un intervalo de tiempo.",
      formula: "S = Σ f(tᵢ) Δt",
      applications: "Se utiliza para calcular consumo de energía, tiempo de procesamiento y recursos utilizados en intervalos discretos."
    },
    area: {
      title: "¿Por qué calcular área entre funciones?",
      explanation: "El área entre dos funciones representa la diferencia acumulada entre dos magnitudes a lo largo del tiempo. En sistemas computacionales, puede mostrar el desbalance entre demanda y capacidad de recursos.",
      formula: "Área = ∫[f(t) - g(t)] dt",
      applications: "Útil para analizar bottlenecks, optimizar asignación de recursos y predecir necesidades futuras de hardware."
    },
    realtime: {
      title: "Monitoreo Continuo de Recursos",
      explanation: "La integración en tiempo real permite observar cómo se acumulan los recursos utilizados. La integral acumulada muestra el trabajo total realizado hasta el momento actual.",
      formula: "Trabajo(t) = ∫₀ᵗ recursos(τ) dτ",
      applications: "Monitoreo de sistemas en producción, análisis de rendimiento y detección de anomalías en el consumo de recursos."
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
