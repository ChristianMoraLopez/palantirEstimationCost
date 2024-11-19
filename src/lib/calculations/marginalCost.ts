import { ProjectParams, MODULE_SIZE_HOURS } from '@/lib/types/project';
import { CostResult, CostBreakdown } from '@/lib/types/cost';
import { ModuleConfig } from '@/lib/types/project';

const RAYLEIGH_CONSTANTS = {
  SHAPE_PARAMETER: 2,  // Ajustamos para hacer más pronunciada la curva
  HOURS_PER_DAY: 8,
  PRODUCTIVITY_FACTORS: {
    SIMPLE: {
      factor: 2.4,      // Proyectos simples/pequeños
      maxComplexity: 1.2
    },
    MODERATE: {
      factor: 3.0,      // Proyectos medianos
      maxComplexity: 1.6
    },
    COMPLEX: {
      factor: 3.6       // Proyectos grandes/complejos
    }
  }
};

interface TeamProductivity {
  factor: number;
  description: string;
}

const calculateTeamProductivity = (
  modules: ModuleConfig[],
  teamSize: number
): TeamProductivity => {
  const avgComplexity = modules.reduce((sum, mod) => sum + mod.complexity, 0) / modules.length;
  
  if (avgComplexity <= RAYLEIGH_CONSTANTS.PRODUCTIVITY_FACTORS.SIMPLE.maxComplexity && teamSize <= 5) {
    return {
      factor: RAYLEIGH_CONSTANTS.PRODUCTIVITY_FACTORS.SIMPLE.factor,
      description: 'Simple project with small team'
    };
  }
  if (avgComplexity <= RAYLEIGH_CONSTANTS.PRODUCTIVITY_FACTORS.MODERATE.maxComplexity && teamSize <= 15) {
    return {
      factor: RAYLEIGH_CONSTANTS.PRODUCTIVITY_FACTORS.MODERATE.factor,
      description: 'Moderate complexity with medium team'
    };
  }
  return {
    factor: RAYLEIGH_CONSTANTS.PRODUCTIVITY_FACTORS.COMPLEX.factor,
    description: 'Complex project with large team'
  };
};

export const calculateMarginalCost = (params: ProjectParams): CostResult => {
  const { modules, developerRate, initialCost, teamSize } = params;
  const teamProductivity = calculateTeamProductivity(modules, teamSize);
  
  // Total effort in hours (no cambia con el tamaño del equipo)
  const totalEffort = modules.reduce((total, module) =>
    total + (MODULE_SIZE_HOURS[module.size] * module.complexity), 0);
  
  // Los días se reducen por el tamaño del equipo
  const totalDays = Math.ceil(totalEffort / (RAYLEIGH_CONSTANTS.HOURS_PER_DAY * teamSize));
  const peakDay = totalDays * 0.4;
  
  let costBreakdown: CostBreakdown[] = [];
  let totalCost = initialCost;
  const dailyCosts: number[] = [];
  
  for (let day = 1; day <= totalDays; day++) {
    const t = day / peakDay;
    
    // Esfuerzo diario por el equipo completo
    const teamDailyEffort = (2 * totalEffort / (peakDay * Math.E)) * 
                           t * Math.exp(-(t * t));
    
    // Costo diario considerando que cada desarrollador cobra su rate
    const dailyCost = teamDailyEffort * developerRate * teamSize * 
                     (1 + (teamProductivity.factor - 2.4) / 10);
    
    // El máximo costo diario ahora considera a todo el equipo
    const maxDailyTeamCost = developerRate * RAYLEIGH_CONSTANTS.HOURS_PER_DAY * teamSize;
    const adjustedDailyCost = Math.min(dailyCost, maxDailyTeamCost);
    
    totalCost += adjustedDailyCost;
    dailyCosts.push(adjustedDailyCost);
    
    costBreakdown.push({
      day,
      cost: adjustedDailyCost,
      cumulativeCost: totalCost,
      phase: 'Development'
    });
  }

  // Normalizar los costos para que sumen el presupuesto total
  const totalCalculatedCost = dailyCosts.reduce((sum, cost) => sum + cost, 0);
  const expectedTotalCost = totalEffort * developerRate * teamSize;
  const scaleFactor = expectedTotalCost / totalCalculatedCost;
  
  costBreakdown = costBreakdown.map((breakdown, index) => ({
    ...breakdown,
    cost: dailyCosts[index] * scaleFactor,
    cumulativeCost: index === 0 
      ? initialCost + (dailyCosts[index] * scaleFactor)
      : costBreakdown[index-1].cumulativeCost + (dailyCosts[index] * scaleFactor)
  }));

  const adjustedDailyCosts = dailyCosts.map(cost => cost * scaleFactor);
  
  return {
    totalCost: costBreakdown[costBreakdown.length - 1].cumulativeCost,
    costBreakdown,
    metrics: {
      averageDailyCost: adjustedDailyCosts.reduce((a, b) => a + b) / adjustedDailyCosts.length,
      peakCost: Math.max(...adjustedDailyCosts),
      estimatedEffort: totalEffort,
      efficiencyFactor: (totalEffort / (totalDays * teamSize * RAYLEIGH_CONSTANTS.HOURS_PER_DAY)) * 100,
      teamProductivity: teamProductivity.description
    },
    summary: {
      development: totalCost - initialCost,
      overhead: initialCost,
      requirements: 0,
      testing: 0
    }
  };
};