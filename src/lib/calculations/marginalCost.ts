import { ProjectParams, ModuleSize, MODULE_SIZE_HOURS } from '@/lib/types/project';
import { CostResult, CostBreakdown } from '@/lib/types/cost';
import { ModuleConfig } from '@/lib/types/project';

const RAYLEIGH_CONSTANTS = {
  SHAPE_PARAMETER: 2,
  HOURS_PER_DAY: 8,
  PRODUCTIVITY_FACTORS: {
    SIMPLE: {
      factor: 1.4,
      maxComplexity: 3
    },
    MODERATE: {
      factor: 3.0,
      maxComplexity: 6
    },
    COMPLEX: {
      factor: 3.6
    }
  },
  // Nuevas constantes para proyectos de 2 módulos
  DUAL_MODULE: {
    COMPLEXITY_RANGE: 449,
    SECOND_MODULE_MULTIPLIER: 1.25
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
  
  // Reglas especiales para exactamente 2 módulos
  if (modules.length === 2) {
    if (avgComplexity <= RAYLEIGH_CONSTANTS.PRODUCTIVITY_FACTORS.SIMPLE.maxComplexity) {
      return {
        factor: RAYLEIGH_CONSTANTS.PRODUCTIVITY_FACTORS.SIMPLE.factor * 1.1, // 10% más flexible
        description: 'Simple dual-module project'
      };
    }
    if (avgComplexity <= RAYLEIGH_CONSTANTS.PRODUCTIVITY_FACTORS.MODERATE.maxComplexity) {
      return {
        factor: RAYLEIGH_CONSTANTS.PRODUCTIVITY_FACTORS.MODERATE.factor * 1.1,
        description: 'Moderate dual-module project'
      };
    }
    return {
      factor: RAYLEIGH_CONSTANTS.PRODUCTIVITY_FACTORS.COMPLEX.factor * 1.1,
      description: 'Complex dual-module project'
    };
  }
  
  // Lógica original para otros casos
  if (avgComplexity <= RAYLEIGH_CONSTANTS.PRODUCTIVITY_FACTORS.SIMPLE.maxComplexity) {
    return {
      factor: RAYLEIGH_CONSTANTS.PRODUCTIVITY_FACTORS.SIMPLE.factor,
      description: 'Simple project with experienced team'
    };
  }
  if (avgComplexity <= RAYLEIGH_CONSTANTS.PRODUCTIVITY_FACTORS.MODERATE.maxComplexity) {
    return {
      factor: RAYLEIGH_CONSTANTS.PRODUCTIVITY_FACTORS.MODERATE.factor,
      description: 'Moderate complexity with mixed experience'
    };
  }
  return {
    factor: RAYLEIGH_CONSTANTS.PRODUCTIVITY_FACTORS.COMPLEX.factor,
    description: 'Complex project requiring high expertise'
  };
};

export const calculateMarginalCost = (params: ProjectParams): CostResult => {
  const { modules, developerRate, initialCost, teamSize } = params;
  const teamProductivity = calculateTeamProductivity(modules, teamSize);
  const avgComplexity = modules.reduce((sum, mod) => sum + mod.complexity, 0) / modules.length;
  
  // Cálculo especial del esfuerzo total para 2 módulos
  const totalEffort = modules.length === 2 
    ? modules.reduce((total, module, index) => {
        const baseEffort = MODULE_SIZE_HOURS[module.size] * module.complexity;
        // Aplicar multiplicador al segundo módulo
        return total + (index === 1 
          ? baseEffort * RAYLEIGH_CONSTANTS.DUAL_MODULE.SECOND_MODULE_MULTIPLIER 
          : baseEffort);
      }, 0)
    : modules.reduce((total, module) =>
        total + (MODULE_SIZE_HOURS[module.size] * module.complexity), 0);
    
  const baseCost = totalEffort * developerRate;
  const productivityMultiplier = Math.pow(teamProductivity.factor, 
    Math.log(teamSize) / Math.log(4)) // Ley de Brooks
  const developmentCost = baseCost * productivityMultiplier;
  
  const totalDays = Math.ceil(totalEffort / (RAYLEIGH_CONSTANTS.HOURS_PER_DAY * teamSize));
  
  let costBreakdown: CostBreakdown[] = [];
  let dailyCosts: number[] = [];
  
  // Ajuste del día pico según el número de módulos
  const peakDay = modules.length === 2
    ? totalDays * (0.35 + (avgComplexity / RAYLEIGH_CONSTANTS.DUAL_MODULE.COMPLEXITY_RANGE))
    : totalDays * (0.35 + (avgComplexity / 40));
  
  const K = 2 / (peakDay * peakDay);
  
  for (let day = 1; day <= totalDays; day++) {
    const effort = K * day * Math.exp(-K * day * day / 2);
    const dailyCost = developmentCost * effort;
    
    dailyCosts.push(dailyCost);
    
    costBreakdown.push({
      day,
      cost: dailyCost,
      cumulativeCost: initialCost + dailyCosts.reduce((sum, cost) => sum + cost, 0),
      phase: 'Development'
    });
  }

  const totalCalculatedCost = dailyCosts.reduce((sum, cost) => sum + cost, 0);
  const smoothingFactor = 0.95;
  const scaleFactor = (developmentCost / totalCalculatedCost) * smoothingFactor;
  
  costBreakdown = costBreakdown.map((breakdown, index) => ({
    ...breakdown,
    cost: dailyCosts[index] * scaleFactor,
    cumulativeCost: index === 0 
      ? initialCost + (dailyCosts[index] * scaleFactor)
      : costBreakdown[index-1].cumulativeCost + (dailyCosts[index] * scaleFactor)
  }));

  return {
    totalCost: costBreakdown[costBreakdown.length - 1].cumulativeCost,
    costBreakdown,
    metrics: {
      averageDailyCost: developmentCost / totalDays,
      peakCost: Math.max(...dailyCosts.map(cost => cost * scaleFactor)),
      estimatedEffort: totalEffort,
      efficiencyFactor: modules.length === 2 ? 110 : 100, // 10% más eficiente para 2 módulos
      teamProductivity: teamProductivity.description
    },
    summary: {
      development: developmentCost,
      overhead: initialCost,
      requirements: 0,
      testing: 0
    }
  };
};