// TheoreticalFrameworkComponent.tsx
import { 
    Box, 
    Text, 
    VStack, 
    UnorderedList, 
    ListItem, 
    Code,
    Divider,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td
   } from '@chakra-ui/react';
   import { CostSummaryProps } from "@/lib/types/cost";
   
   const Formula = ({ formula, description, variables }: {
    formula: string;
    description: string;
    variables?: Array<{ symbol: string; description: string; }>;
   }) => (
    <Box w="full" bg="blue.50" p={4} borderRadius="md">
      <Code p={3} display="block" fontSize="lg" bg="white">
        {formula}
      </Code>
      <Text fontSize="sm" mt={2} color="gray.600">
        {description}
      </Text>
      {variables && (
        <VStack align="start" mt={3} spacing={1}>
          {variables.map(({ symbol, description }) => (
            <Text key={symbol} fontSize="sm">
              <Text as="span" fontWeight="bold">{symbol}</Text>: {description}
            </Text>
          ))}
        </VStack>
      )}
    </Box>
   );
   
   const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Box w="full" mt={6}>
      <Text fontSize="xl" fontWeight="bold" color="blue.700" mb={4}>
        {title}
      </Text>
      {children}
    </Box>
   );
   
   export const TheoreticalFramework = ({ totalCost, averageDailyCost, peakCost, estimatedEffort, teamSize, costBreakdown }: CostSummaryProps) => {
    const exampleData = {
      totalEffort: 480, // horas
      teamSize: 3,
      duration: 25, // días
      developerRate: 50, // USD por hora
      complexity: 1.2
    };
   
    return (
      <Box w="full" p={8} bg="white" borderRadius="lg" shadow="xl">
        <VStack spacing={8} align="stretch">
          <Text 
            fontSize="3xl" 
            fontWeight="bold" 
            color="blue.700"
            borderBottom="4px solid"
            borderColor="blue.500"
            pb={2}
          >
            Marco Teórico: Modelo de Distribución de Rayleigh en Costos de Desarrollo
          </Text>
   
          <Section title="1. Introducción y Fundamentos">
            <Text>
              El modelo de Rayleigh es una herramienta matemática fundamental para la estimación 
              de costos en desarrollo de software. Se basa en la observación empírica de que el 
              esfuerzo en proyectos de software sigue un patrón predecible y modelable matemáticamente.
            </Text>
            
            <Box bg="blue.50" p={4} borderRadius="md" mt={4}>
              <Text fontWeight="bold" mb={2}>Principios Clave:</Text>
              <UnorderedList spacing={2}>
                <ListItem>Distribución no uniforme del esfuerzo</ListItem>
                <ListItem>Existencia de un pico natural de productividad</ListItem>
                <ListItem>Comportamiento predecible del equipo a lo largo del tiempo</ListItem>
              </UnorderedList>
            </Box>
          </Section>
   
          <Section title="2. Fundamento Matemático">
            <Text fontWeight="semibold" mb={4}>La Distribución de Rayleigh</Text>
            
            <Formula 
              formula="f(t) = (t/σ²)e^(-t²/2σ²)"
              description="Función de densidad de probabilidad de Rayleigh"
              variables={[
                { symbol: 't', description: 'tiempo desde el inicio del proyecto' },
                { symbol: 'σ', description: 'parámetro de escala que determina la forma' }
              ]}
            />
   
            <Box mt={6}>
              <Text fontWeight="bold" mb={3}>Propiedades Matemáticas Fundamentales:</Text>
              <VStack align="start" spacing={4}>
                <Formula
                  formula="E[T] = σ√(π/2)"
                  description="Valor esperado (media) de la distribución"
                />
                
                <Formula
                  formula="Var[T] = σ²(4-π)/2"
                  description="Varianza de la distribución"
                />
                
                <Formula
                  formula="F(t) = 1 - e^(-t²/2σ²)"
                  description="Función de distribución acumulada"
                />
              </VStack>
            </Box>
          </Section>
   
          <Section title="3. Aplicación al Desarrollo de Software">
            <Text mb={4}>
              En el contexto del desarrollo de software, adaptamos la distribución de Rayleigh 
              para modelar el esfuerzo y costo a lo largo del tiempo del proyecto.
            </Text>
   
            <Formula
              formula="E(t) = K * (t/td) * e^(-(t/td)²/2)"
              description="Fórmula de esfuerzo en tiempo t"
              variables={[
                { symbol: 'K', description: 'esfuerzo total del proyecto en horas' },
                { symbol: 'td', description: 'tiempo total de desarrollo' },
                { symbol: 't', description: 'punto en el tiempo actual' }
              ]}
            />
   
            <Box bg="gray.50" p={4} borderRadius="md" mt={4}>
              <Text fontWeight="bold" mb={2}>Variables Críticas:</Text>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Variable</Th>
                    <Th>Descripción</Th>
                    <Th>Cálculo</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>K (Esfuerzo Total)</Td>
                    <Td>Horas totales necesarias</Td>
                    <Td>Σ(módulo_horas × complejidad)</Td>
                  </Tr>
                  <Tr>
                    <Td>td (Tiempo Total)</Td>
                    <Td>Duración del proyecto</Td>
                    <Td>K / (horas_día × equipo)</Td>
                  </Tr>
                  <Tr>
                    <Td>Factor de Forma</Td>
                    <Td>Define la "agudeza" de la curva</Td>
                    <Td>4/td²</Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </Section>
   
          <Section title="4. Cálculos Detallados">
            <Text fontWeight="bold" mb={4}>Ejemplo Práctico con Datos Reales:</Text>
            
            <Box bg="blue.50" p={4} borderRadius="md">
              <Text fontWeight="semibold">Datos del Proyecto:</Text>
              <UnorderedList mt={2}>
                <ListItem>Esfuerzo Total (K): {exampleData.totalEffort} horas</ListItem>
                <ListItem>Tamaño del Equipo: {exampleData.teamSize} desarrolladores</ListItem>
                <ListItem>Duración: {exampleData.duration} días</ListItem>
                <ListItem>Tasa por Hora: ${exampleData.developerRate}</ListItem>
              </UnorderedList>
            </Box>
   
            <VStack align="start" spacing={4} mt={4}>
              <Text fontWeight="semibold">Paso 1: Cálculo del Factor de Forma</Text>
              <Formula
                formula="a = 4/td² = 4/(25)² = 0.0064"
                description="Factor de forma para la distribución"
              />
   
              <Text fontWeight="semibold">Paso 2: Cálculo del Esfuerzo en el Día 10</Text>
              <Formula
                formula="E(10) = 480 * (10/25) * e^(-0.0064 * 10² / 2) ≈ 245.3 horas"
                description="Esfuerzo para el día 10 del proyecto"
              />
   
              <Text fontWeight="semibold">Paso 3: Cálculo del Costo Diario</Text>
              <Formula
                formula="Costo(10) = 245.3 * $50 = $12,265"
                description="Costo para el día 10 del proyecto"
              />
            </VStack>
          </Section>
   
          <Section title="5. Interpretación de la Gráfica">
            <Text mb={4}>
              La visualización del modelo muestra dos curvas principales que representan 
              aspectos diferentes pero relacionados del proyecto:
            </Text>
   
            <Box bg="gray.50" p={4} borderRadius="md">
              <VStack align="start" spacing={4}>
                <Box>
                  <Text fontWeight="bold" color="blue.600">Curva de Esfuerzo Diario (Azul)</Text>
                  <UnorderedList>
                    <ListItem>Forma de campana característica</ListItem>
                    <ListItem>Pico aproximadamente al 40% del tiempo total</ListItem>
                    <ListItem>Refleja la intensidad del trabajo día a día</ListItem>
                  </UnorderedList>
                </Box>
   
                <Box>
                  <Text fontWeight="bold" color="green.600">Curva de Costo Acumulado (Verde)</Text>
                  <UnorderedList>
                    <ListItem>Forma de S característica</ListItem>
                    <ListItem>Crecimiento más rápido durante el pico de esfuerzo</ListItem>
                    <ListItem>Tendencia a estabilizarse al final</ListItem>
                  </UnorderedList>
                </Box>
              </VStack>
            </Box>
          </Section>
   
          <Section title="6. Implicaciones Prácticas y Recomendaciones">
            <VStack align="start" spacing={4}>
              <Box>
                <Text fontWeight="bold">Planificación de Recursos</Text>
                <UnorderedList>
                  <ListItem>Anticipar necesidades máximas durante el pico</ListItem>
                  <ListItem>Planificar la distribución del equipo</ListItem>
                  <ListItem>Gestionar la carga de trabajo</ListItem>
                </UnorderedList>
              </Box>
   
              <Box>
                <Text fontWeight="bold">Monitoreo y Control</Text>
                <UnorderedList>
                  <ListItem>Comparar progreso real vs. estimado</ListItem>
                  <ListItem>Identificar desviaciones temprano</ListItem>
                  <ListItem>Ajustar recursos según sea necesario</ListItem>
                </UnorderedList>
              </Box>
   
              <Box>
                <Text fontWeight="bold">Consideraciones Adicionales</Text>
                <UnorderedList>
                  <ListItem>El modelo es una guía, no una regla rígida</ListItem>
                  <ListItem>Adaptar según el contexto específico</ListItem>
                  <ListItem>Considerar factores externos</ListItem>
                </UnorderedList>
              </Box>

 {/* Tu explicación actual simplificada */}
 <Box w="full" p={6} borderWidth={1} borderRadius="md" bg="gray.50">
        <VStack align="start" spacing={4}>
          <Text fontSize="xl" fontWeight="bold">
            Resumen de Costes del Proyecto Actual
          </Text>

          <Text fontWeight="bold">Métricas Clave:</Text>
          <UnorderedList spacing={2}>
            <ListItem>Coste Total: ${totalCost.toFixed(2)}</ListItem>
            <ListItem>Coste Diario Promedio: ${averageDailyCost.toFixed(2)}</ListItem>
            <ListItem>Coste Pico: ${peakCost.toFixed(2)}</ListItem>
            <ListItem>Horas Totales: {estimatedEffort.toFixed(1)}</ListItem>
          </UnorderedList>

          <Text fontWeight="bold">Interpretación de Resultados:</Text>
          <UnorderedList spacing={2}>
            <ListItem>
              Fase Inicial: Menor coste debido al período de familiarización
            </ListItem>
            <ListItem>
              Fase Media: Pico de productividad y coste máximo
            </ListItem>
            <ListItem>
              Fase Final: Reducción gradual del coste diario
            </ListItem>
          </UnorderedList>
        </VStack>
      </Box>


            </VStack>
          </Section>
        </VStack>
      </Box>
    );
   };