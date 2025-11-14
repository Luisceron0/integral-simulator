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
    },
    integrals: {
      title: "Ejemplo: Superficie de revolución (y = √x, a=0, b=6)",
      explanation: `Se calcula el área del sólido generado al girar la región delimitada por y = √x, x = 6 y el eje x alrededor del eje x. El proceso se descompone en: definición de la región, cálculo del área lateral mediante la fórmula de superficie de revolución, cálculo del área de la tapa (si aplica) y suma para obtener el área total. A continuación se muestra el desarrollo analítico resumido.`,
      formula: `Fórmulas clave:\n
  - Área lateral de revolución alrededor del eje x: A_lateral = 2π ∫_a^b y \sqrt{1 + (dy/dx)^2} dx\n
  - Para y = √x ⇒ dy/dx = 1/(2√x). Sustituyendo y simplificando se obtiene A_lateral = π ∫_0^6 √{4x + 1} dx\n
  - Área de la tapa en x = 6 (círculo de radio √6): A_tapa = π(√6)^2 = 6π\n
  - Área total: A_total = A_lateral + A_tapa = \frac{62π}{3} + 6π = \frac{80π}{3}`,
      applications: `Desarrollo matemático (resumen):\n
  1) y = √x, dy/dx = 1/(2√x)\n
  2) A_lateral = 2π ∫_0^6 √x \sqrt{1 + (1/(2√x))^2} dx = π ∫_0^6 √{4x + 1} dx\n
  3) Haciendo u = 4x + 1 ⇒ du = 4 dx, límites: x=0 → u=1, x=6 → u=25.\n
     I = ∫_0^6 √{4x+1} dx = (1/4) ∫_1^{25} u^{1/2} du = (1/6)(25^{3/2} - 1^{3/2}) = 62/3\n
     Por tanto A_lateral = π * 62/3 = 62π/3\n
  4) A_tapa = 6π.\n
  5) A_total = 62π/3 + 6π = 80π/3 ≈ 83.7758 unidades^2.`
    }
    ,
    server: {
      title: "Tráfico de Servidor y Cálculo Integral",
      explanation: "Ejemplo práctico: una campaña de marketing de 12 horas modela el tráfico con T(t) = 100 + 50·sin(πt/6) + 20t. El total de peticiones se obtiene integrando T(t) en [0,12], lo que nos da información precisa para dimensionamiento y costos.",
      formula: "Peticiones totales = ∫_0^{12} [100 + 50·sin(πt/6) + 20t] dt = 1,200 + 0 + 1,440 = 2,640",
      applications: "Usos: dimensionamiento de instancias, estimación de ancho de banda (~2.64 GB asumiendo 1MB/petición), optimización de políticas de auto-scaling y estimación de costos en la nube."
    }
  };

  // Proteger accesos si `activeTab` no existe en `content`
  const currentContent = content[activeTab] || {
    title: 'Contenido no disponible',
    explanation: 'No hay información educativa para esta pestaña.',
    formula: '-',
    applications: '-'
  };

  return (
    <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg h-fit">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-cyan-400 break-words">Información Educativa</h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-base md:text-lg font-semibold text-purple-400 mb-2 break-words">
            {currentContent.title}
          </h3>
          <p className="text-gray-300 text-xs md:text-sm leading-relaxed break-words">
            {currentContent.explanation}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-cyan-300 mb-1 text-xs md:text-sm break-words">Fórmula Matemática:</h4>
          <div className="bg-gray-700 p-3 rounded font-mono text-center text-purple-300 text-xs md:text-sm break-words">
            {currentContent.formula}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-cyan-300 mb-1 text-xs md:text-sm break-words">Aplicaciones en Ingeniería:</h4>
          <p className="text-gray-300 text-xs md:text-sm leading-relaxed break-words">
            {currentContent.applications}
          </p>
        </div>

        <div className="border-t border-gray-600 pt-4">
          <h4 className="font-semibold text-cyan-300 mb-2 text-xs md:text-sm break-words">Consejos de Uso:</h4>
          <ul className="text-gray-300 text-xs md:text-sm space-y-1 break-words">
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
