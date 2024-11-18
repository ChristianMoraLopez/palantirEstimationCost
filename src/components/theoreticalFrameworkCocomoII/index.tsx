import React from "react";
import {
  Box,
  Text,
  VStack,
  UnorderedList,
  ListItem,
  Code,
  Divider,
  Stack,
} from "@chakra-ui/react";
import type { CostSummaryProps } from "@/lib/types/cost";

const Formula = ({
  formula,
  description,
  variables,
  explanation,
}: {
  formula: string;
  description: string;
  explanation?: string;
  variables?: Array<{ symbol: string; description: string; example?: string }>;
}) => (
  <Box w="full" bg="blue.50" p={4} borderRadius="md">
    <Code p={3} display="block" fontSize="lg" bg="white">
      {formula}
    </Code>
    <Box mt={2} color="gray.600" fontSize="sm">
      {description}
    </Box>
    {explanation && (
      <Box mt={2} fontStyle="italic" fontSize="sm">
        {explanation}
      </Box>
    )}
    {variables && (
      <Stack spacing={1} mt={3}>
        {variables.map(({ symbol, description, example }) => (
          <Box key={symbol} fontSize="sm">
            <Text as="span" fontWeight="bold">
              {symbol}
            </Text>
            <Text as="span">: {description}</Text>
            {example && (
              <Text as="span" fontStyle="italic" ml={2}>
                (Ejemplo: {example})
              </Text>
            )}
          </Box>
        ))}
      </Stack>
    )}
  </Box>
);

const Section = ({
  title,
  children,
  description,
}: {
  title: string;
  children: React.ReactNode;
  description?: string;
}) => (
  <Box w="full" mt={6}>
    <Text fontSize="xl" fontWeight="bold" color="blue.700" mb={2}>
      {title}
    </Text>
    {description && (
      <Box color="gray.600" mb={4}>
        {description}
      </Box>
    )}
    {children}
  </Box>
);

export const CocomoFramework = ({
  totalCost,
  averageDailyCost,
  peakCost,
  estimatedEffort,
  teamSize,
  costBreakdown,
}: CostSummaryProps) => {
  // Cálculos COCOMO II
  const monthlyEffort = estimatedEffort / (teamSize * 160);
  const productivity = estimatedEffort / monthlyEffort;
  const KLOC = estimatedEffort / 20;

  // Factores de escala
  const scaleFactors = {
    PREC: {
      value: 1.24,
      name: "Precedencia",
      description: "Experiencia previa con proyectos similares",
    },
    FLEX: {
      value: 1.01,
      name: "Flexibilidad",
      description: "Flexibilidad del proceso de desarrollo",
    },
    RESL: {
      value: 1.41,
      name: "Resolución de Riesgos",
      description: "Gestión de riesgos y arquitectura",
    },
    TEAM: {
      value: 1.1,
      name: "Cohesión del Equipo",
      description: "Trabajo en equipo y comunicación",
    },
    PMAT: {
      value: 1.56,
      name: "Madurez del Proceso",
      description: "Nivel de madurez de los procesos",
    },
  };

  const B = 0.91;
  const E =
    B + 0.01 * Object.values(scaleFactors).reduce((a, b) => a + b.value, 0);
  const A = 2.94;
  const nominalEffort = A * Math.pow(KLOC, E);
  const TDEV =
    3.67 *
    Math.pow(
      nominalEffort,
      0.28 +
        0.002 * Object.values(scaleFactors).reduce((a, b) => a + b.value, 0)
    );
  const avgStaffing = nominalEffort / TDEV;

  return (
    <Box className="w-full p-8 bg-white rounded-lg shadow-xl">
      <VStack className="space-y-8">
        <Box>
          <Text className="text-3xl font-bold text-blue-700 border-b-4 border-blue-500 pb-2">
            Marco Teórico: Modelo COCOMO II
          </Text>
          <Text className="mt-4 text-gray-700">
            El Modelo Constructivo de Costos (COCOMO II) es una herramienta
            matemática avanzada para la estimación de costos en proyectos de
            software. Este marco combina principios de ingeniería de software
            con análisis estadístico para proporcionar estimaciones precisas de
            esfuerzo, tiempo y costo.
          </Text>
        </Box>

        <Section
          title="1. Fundamentos Matemáticos"
          description="Las ecuaciones fundamentales que constituyen el núcleo del modelo COCOMO II."
        >
          <VStack className="space-y-4">
            <Formula
              formula="PM = A × Size^E × ∏EMi"
              description="Ecuación Principal de Esfuerzo"
              explanation="Esta ecuación calcula el esfuerzo total necesario en personas-mes, considerando el tamaño del proyecto y diversos factores de ajuste."
              variables={[
                {
                  symbol: "PM",
                  description: "Esfuerzo en Personas-Mes",
                  example: "100 PM",
                },
                {
                  symbol: "A",
                  description: "Constante de calibración (2.94)",
                  example: "2.94",
                },
                {
                  symbol: "Size",
                  description: "Tamaño en miles de líneas de código",
                  example: "50 KLOC",
                },
                {
                  symbol: "E",
                  description: "Factor exponencial de escala",
                  example: "1.1",
                },
                {
                  symbol: "EMi",
                  description: "Multiplicadores de esfuerzo",
                  example: "1.2",
                },
              ]}
            />

            <Formula
              formula="E = B + 0.01 × ΣSFi"
              description="Factor Exponencial de Escala"
              explanation="Determina cómo el esfuerzo escala con el tamaño del proyecto."
              variables={[
                {
                  symbol: "B",
                  description:
                    "Valor base (0.91 para proyectos semi-separados)",
                  example: "0.91",
                },
                {
                  symbol: "SFi",
                  description: "Factores de escala",
                  example: "PREC + FLEX + RESL + TEAM + PMAT",
                },
              ]}
            />

            <Formula
              formula="TDEV = C × PM^F"
              description="Tiempo de Desarrollo"
              explanation="Calcula la duración del proyecto en meses basándose en el esfuerzo calculado."
              variables={[
                {
                  symbol: "TDEV",
                  description: "Tiempo de desarrollo en meses",
                  example: "12 meses",
                },
                {
                  symbol: "C",
                  description: "Constante de tiempo (3.67)",
                  example: "3.67",
                },
                {
                  symbol: "F",
                  description:
                    "Factor de escala temporal (0.28 + 0.002 × ΣSFi)",
                  example: "0.33",
                },
              ]}
            />
          </VStack>
        </Section>

        <Section
          title="2. Aplicación al Proyecto Actual"
          description="Análisis detallado de las métricas calculadas para este proyecto específico."
        >
          <Box className="bg-blue-50 p-6 rounded-md">
            <VStack className="items-start space-y-4">
              <Box>
                <Text className="font-bold">Métricas Base</Text>
                <UnorderedList>
                  <ListItem>
                    Esfuerzo Total: {estimatedEffort.toFixed(2)} horas
                  </ListItem>
                  <ListItem>Equipo: {teamSize} personas</ListItem>
                  <ListItem>KLOC Estimado: {KLOC.toFixed(2)}K</ListItem>
                </UnorderedList>
              </Box>

              <Box>
                <Text className="font-bold">Métricas Calculadas</Text>
                <UnorderedList>
                  <ListItem>
                    Esfuerzo Nominal: {nominalEffort.toFixed(2)} personas-mes
                  </ListItem>
                  <ListItem>Duración: {TDEV.toFixed(2)} meses</ListItem>
                  <ListItem>
                    Productividad: {productivity.toFixed(2)} LOC/persona-mes
                  </ListItem>
                </UnorderedList>
              </Box>

              <Box>
                <Text className="font-bold">Métricas de Costo</Text>
                <UnorderedList>
                  <ListItem>Costo Total: ${totalCost.toFixed(2)}</ListItem>
                  <ListItem>
                    Costo Diario Promedio: ${averageDailyCost.toFixed(2)}
                  </ListItem>
                  <ListItem>Costo Pico: ${peakCost.toFixed(2)}</ListItem>
                </UnorderedList>
              </Box>
            </VStack>
          </Box>
        </Section>

        <Section
          title="3. Factores de Escala"
          description="Los factores que influyen en cómo el proyecto escala con su tamaño."
        >
          <VStack className="space-y-4">
            {Object.entries(scaleFactors).map(([key, data]) => (
              <Box key={key} className="w-full bg-gray-50 p-4 rounded-md">
                <Text className="font-bold">
                  {data.name} ({key})
                </Text>
                <Text className="text-sm">{data.description}</Text>
                <Text className="text-sm mt-1">
                  Valor: {data.value.toFixed(2)}
                </Text>
                <Box
                  className="bg-blue-200 h-2 mt-2 rounded"
                  style={{ width: `${(data.value / 2) * 100}%` }}
                />
              </Box>
            ))}
          </VStack>
        </Section>

        <Section
          title="4. Análisis de Costos y Esfuerzo"
          description="Desglose de costos por fases principales del proyecto."
        >
          <Box className="bg-gray-50 p-6 rounded-md">
            <VStack spacing={6}>
              <Box className="w-full">
                <Text className="font-bold mb-4">Fase de Inicio (20%)</Text>
                <Box className="flex items-center space-x-2 mb-4">
                  <Box className="flex-grow">
                    <Box
                      className="bg-blue-400 h-4 rounded"
                      style={{ width: "20%" }}
                    />
                  </Box>
                  <Text className="text-sm">
                    ${(totalCost * 0.2).toFixed(2)}
                  </Text>
                </Box>
                <UnorderedList fontSize="sm">
                  <ListItem>Análisis de requisitos</ListItem>
                  <ListItem>Planificación inicial</ListItem>
                  <ListItem>Diseño de arquitectura</ListItem>
                </UnorderedList>
              </Box>

              <Box className="w-full">
                <Text className="font-bold mb-4">
                  Fase de Elaboración (30%)
                </Text>
                <Box className="flex items-center space-x-2 mb-4">
                  <Box className="flex-grow">
                    <Box
                      className="bg-green-400 h-4 rounded"
                      style={{ width: "30%" }}
                    />
                  </Box>
                  <Text className="text-sm">
                    ${(totalCost * 0.3).toFixed(2)}
                  </Text>
                </Box>
                <UnorderedList fontSize="sm">
                  <ListItem>Desarrollo de componentes core</ListItem>
                  <ListItem>Establecimiento de infraestructura</ListItem>
                  <ListItem>Pruebas preliminares</ListItem>
                </UnorderedList>
              </Box>

              <Box className="w-full">
                <Text className="font-bold mb-4">
                  Fase de Construcción (35%)
                </Text>
                <Box className="flex items-center space-x-2 mb-4">
                  <Box className="flex-grow">
                    <Box
                      className="bg-purple-400 h-4 rounded"
                      style={{ width: "35%" }}
                    />
                  </Box>
                  <Text className="text-sm">
                    ${(totalCost * 0.35).toFixed(2)}
                  </Text>
                </Box>
                <UnorderedList fontSize="sm">
                  <ListItem>Implementación de funcionalidades</ListItem>
                  <ListItem>Integración continua</ListItem>
                  <ListItem>Pruebas unitarias y de integración</ListItem>
                </UnorderedList>
              </Box>

              <Box className="w-full">
                <Text className="font-bold mb-4">Fase de Transición (15%)</Text>
                <Box className="flex items-center space-x-2 mb-4">
                  <Box className="flex-grow">
                    <Box
                      className="bg-yellow-400 h-4 rounded"
                      style={{ width: "15%" }}
                    />
                  </Box>
                  <Text className="text-sm">
                    ${(totalCost * 0.15).toFixed(2)}
                  </Text>
                </Box>
                <UnorderedList fontSize="sm">
                  <ListItem>Pruebas de aceptación</ListItem>
                  <ListItem>Documentación final</ListItem>
                  <ListItem>Despliegue y entrega</ListItem>
                </UnorderedList>
              </Box>
            </VStack>
          </Box>
        </Section>

        <Section
          title="5. Recomendaciones Prácticas"
          description="Sugerencias basadas en el análisis COCOMO II para la gestión efectiva del proyecto."
        >
          <Box className="space-y-4">
            <Box className="bg-green-50 p-4 rounded-md">
              <Text className="font-bold mb-2">Planificación de Recursos</Text>
              <UnorderedList>
                <ListItem>
                  Mantener un equipo base de {Math.ceil(avgStaffing)} personas
                </ListItem>
                <ListItem>
                  Planificar para una duración de {Math.ceil(TDEV)} meses
                </ListItem>
                <ListItem>
                  Presupuesto mensual objetivo: ${(totalCost / TDEV).toFixed(2)}
                </ListItem>
              </UnorderedList>
            </Box>

            <Box className="bg-yellow-50 p-4 rounded-md">
              <Text className="font-bold mb-2">Consideraciones de Riesgo</Text>
              <UnorderedList>
                <ListItem>
                  Preparar para picos de costo de hasta ${peakCost.toFixed(2)}
                </ListItem>
                <ListItem>
                  Mantener un margen de{" "}
                  {((peakCost / averageDailyCost - 1) * 100).toFixed(1)}% sobre
                  el costo promedio
                </ListItem>
                <ListItem>
                  Considerar la variabilidad en la productividad del equipo
                </ListItem>
              </UnorderedList>
            </Box>
          </Box>
        </Section>

        <Section title="6. Resumen Ejecutivo">
          <Box className="w-full p-6 border border-gray-200 rounded-md bg-gray-50">
            <VStack className="items-start space-y-4">
              <Text className="text-xl font-bold">
                Resumen de Costes del Proyecto Actual
              </Text>

              <Box>
                <Text className="font-bold">Métricas Clave:</Text>
                <UnorderedList className="space-y-2">
                  <ListItem>Coste Total: ${totalCost.toFixed(2)}</ListItem>
                  <ListItem>
                    Coste Diario Promedio: ${averageDailyCost.toFixed(2)}
                  </ListItem>
                  <ListItem>Coste Pico: ${peakCost.toFixed(2)}</ListItem>
                  <ListItem>
                    Horas Totales: {estimatedEffort.toFixed(1)}
                  </ListItem>
                </UnorderedList>
              </Box>

              <Box>
                <Text className="font-bold">Interpretación de Resultados:</Text>
                <UnorderedList className="space-y-2">
                  <ListItem>
                    Fase Inicial: Menor coste debido al período de
                    familiarización
                  </ListItem>
                  <ListItem>
                    Fase Media: Pico de productividad y coste máximo
                  </ListItem>
                  <ListItem>
                    Fase Final: Reducción gradual del coste diario
                  </ListItem>
                </UnorderedList>
              </Box>
            </VStack>
          </Box>
        </Section>
      </VStack>
    </Box>
  );
};

export default CocomoFramework;
