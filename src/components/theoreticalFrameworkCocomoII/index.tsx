import React from "react";
import {
  Box,
  Text,
  VStack,
  UnorderedList,
  ListItem,
  Code,
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
  teamSize
}: CostSummaryProps) => {
  // Calcular el margen sobre el costo promedio
  const margin = ((peakCost / averageDailyCost - 1) * 100);
  const duration = Math.ceil(estimatedEffort / (8 * teamSize));

  return (
    <Box className="w-full p-8 bg-white rounded-lg shadow-xl">
      <VStack className="space-y-8">
        <Box>
          <Text className="text-3xl font-bold text-blue-700 border-b-4 border-blue-500 pb-2">
            Marco Teórico: Modelo COCOMO II Adaptado
          </Text>
          <Text className="mt-4 text-gray-700">
            Esta implementación del Modelo COCOMO II utiliza una distribución 
            Rayleigh para modelar el esfuerzo diario, reflejando el ciclo natural 
            del desarrollo de software con un pico de productividad al 40% del proyecto.
          </Text>
        </Box>

        <Section
          title="1. Fundamentos del Modelo"
          description="Ecuaciones base para la estimación del esfuerzo y costo."
        >
          <VStack className="space-y-4">
            <Formula
              formula="dailyEffort = (2 * totalEffort / (peakDay * e)) * t * exp(-(t * t))"
              description="Distribución Rayleigh del Esfuerzo Diario"
              explanation="Modela la variación del esfuerzo durante el proyecto"
              variables={[
                {
                  symbol: "totalEffort",
                  description: "Esfuerzo total en horas",
                  example: `${estimatedEffort} horas`
                },
                {
                  symbol: "peakDay",
                  description: "Día de máximo esfuerzo (40% del total)",
                  example: `día ${Math.ceil(duration * 0.4)} de ${duration}`
                },
                {
                  symbol: "t",
                  description: "Ratio del día actual al día pico",
                  example: "día/peakDay"
                }
              ]}
            />

            <Formula
              formula="dailyCost = dailyEffort * developerRate * teamSize"
              description="Cálculo del Costo Diario"
              variables={[
                {
                  symbol: "dailyEffort",
                  description: "Esfuerzo calculado para el día",
                },
                {
                  symbol: "developerRate",
                  description: "Tarifa por hora del desarrollador",
                },
                {
                  symbol: "teamSize",
                  description: "Tamaño del equipo",
                  example: String(teamSize)
                }
              ]}
            />
          </VStack>
        </Section>

        <Section
          title="2. Clasificación del Proyecto"
          description="Factores de ajuste según el tamaño y complejidad."
        >
          <Box className="bg-blue-50 p-6 rounded-md">
            <VStack className="items-start space-y-4">
              <Box>
                <Text className="font-bold">Tipos de Proyecto</Text>
                <UnorderedList>
                  <ListItem>
                    Orgánico (factor 1.0): Proyectos pequeños (≤50 KLOC, ≤5 personas)
                  </ListItem>
                  <ListItem>
                    Semi-separado (factor 1.2): Proyectos medianos (≤300 KLOC, ≤15 personas)
                  </ListItem>
                  <ListItem>
                    Embebido (factor 1.4): Proyectos grandes o complejos
                  </ListItem>
                </UnorderedList>
              </Box>
            </VStack>
          </Box>
        </Section>

        <Section
          title="3. Análisis del Proyecto Actual"
          description="Métricas calculadas para este proyecto específico."
        >
          <Box className="bg-blue-50 p-6 rounded-md">
            <VStack className="items-start space-y-6">
              <Box>
                <Text className="font-bold">Esfuerzo y Duración</Text>
                <UnorderedList>
                  <ListItem>
                    Esfuerzo Total: {estimatedEffort.toFixed(2)} horas
                  </ListItem>
                  <ListItem>
                    Duración: {duration} días
                  </ListItem>
                  <ListItem>
                    Tamaño del Equipo: {teamSize} personas
                  </ListItem>
                </UnorderedList>
              </Box>

              <Box>
                <Text className="font-bold">Métricas de Costo</Text>
                <UnorderedList>
                  <ListItem>
                    Costo Total: ${totalCost.toFixed(2)}
                  </ListItem>
                  <ListItem>
                    Costo Diario Promedio: ${averageDailyCost.toFixed(2)}
                  </ListItem>
                  <ListItem>
                    Costo Pico: ${peakCost.toFixed(2)}
                  </ListItem>
                  <ListItem>
                    Variación Máxima: {margin.toFixed(1)}% sobre el promedio
                  </ListItem>
                </UnorderedList>
              </Box>
            </VStack>
          </Box>
        </Section>

        <Section
          title="4. Distribución del Esfuerzo"
          description="Patrón de esfuerzo según la distribución Rayleigh."
        >
          <Box className="bg-gray-50 p-6 rounded-md">
            <VStack spacing={4}>
              <Box className="w-full">
                <Text className="font-bold mb-2">Fases del Proyecto</Text>
                <UnorderedList>
                  <ListItem>
                    Inicio (0-20% duración): Esfuerzo incremental
                  </ListItem>
                  <ListItem>
                    Pico (40% duración): Máxima productividad
                  </ListItem>
                  <ListItem>
                    Cierre (60-100% duración): Reducción gradual
                  </ListItem>
                </UnorderedList>
              </Box>
            </VStack>
          </Box>
        </Section>

        <Section
          title="5. Recomendaciones de Gestión"
          description="Consideraciones para la gestión efectiva del proyecto."
        >
          <Box className="space-y-4">
            <Box className="bg-green-50 p-4 rounded-md">
              <Text className="font-bold mb-2">Gestión de Recursos</Text>
              <UnorderedList>
                <ListItem>
                  Planificar capacidad máxima para el pico (día {Math.ceil(duration * 0.4)})
                </ListItem>
                <ListItem>
                  Presupuesto diario base: ${averageDailyCost.toFixed(2)}
                </ListItem>
                <ListItem>
                  Reserva para picos: ${(peakCost - averageDailyCost).toFixed(2)} adicionales
                </ListItem>
              </UnorderedList>
            </Box>
          </Box>
        </Section>

        <Section title="6. Resumen">
          <Box className="w-full p-6 border border-gray-200 rounded-md bg-gray-50">
            <VStack className="items-start space-y-4">
              <Text className="text-xl font-bold">
                Conclusiones Clave
              </Text>
              <UnorderedList className="space-y-2">
                <ListItem>
                  Esfuerzo total de {estimatedEffort.toFixed(1)} horas distribuido en {duration} días
                </ListItem>
                <ListItem>
                  Inversión total de ${totalCost.toFixed(2)}
                </ListItem>
                <ListItem>
                  Pico de esfuerzo al 40% del proyecto (día {Math.ceil(duration * 0.4)})
                </ListItem>
                <ListItem>
                  Variación de costos entre ${averageDailyCost.toFixed(2)} y ${peakCost.toFixed(2)} por día
                </ListItem>
              </UnorderedList>
            </VStack>
          </Box>
        </Section>
      </VStack>
    </Box>
  );
};

export default CocomoFramework;