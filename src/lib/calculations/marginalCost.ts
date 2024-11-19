import { ProjectParams, MODULE_SIZE_HOURS } from '@/lib/types/project';
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
  modules: ModuleConfig[]
): TeamProductivity => {
  const avgComplexity = modules.reduce((sum, mod) => sum + mod.complexity, 0) / modules.length;
  
  // Reglas especiales para exactamente 2 módulos
  if (modules.length === 2) {
    const dualModuleBonus = 1.1; // 10% más flexible
    
    if (avgComplexity <= RAYLEIGH_CONSTANTS.PRODUCTIVITY_FACTORS.SIMPLE.maxComplexity) {
      return {
        factor: RAYLEIGH_CONSTANTS.PRODUCTIVITY_FACTORS.SIMPLE.factor * dualModuleBonus,
        description: 'Simple dual-module project'
      };
    }
    if (avgComplexity <= RAYLEIGH_CONSTANTS.PRODUCTIVITY_FACTORS.MODERATE.maxComplexity) {
      return {
        factor: RAYLEIGH_CONSTANTS.PRODUCTIVITY_FACTORS.MODERATE.factor * dualModuleBonus,
        description: 'Moderate dual-module project'
      };
    }
    return {
      factor: RAYLEIGH_CONSTANTS.PRODUCTIVITY_FACTORS.COMPLEX.factor * dualModuleBonus,
      description: 'Complex dual-module project'
    };
  }
  
  // Lógica para otros casos
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

const calculateTotalEffort = (modules: ModuleConfig[]): number => {
  if (modules.length === 2) {
    return modules.reduce((total, module, index) => {
      const baseEffort = MODULE_SIZE_HOURS[module.size] * module.complexity;
      return total + (index === 1 
        ? baseEffort * RAYLEIGH_CONSTANTS.DUAL_MODULE.SECOND_MODULE_MULTIPLIER 
        : baseEffort);
    }, 0);
  }
  
  return modules.reduce((total, module) => 
    total + (MODULE_SIZE_HOURS[module.size] * module.complexity), 0);
};

const calculatePeakDay = (totalDays: number, avgComplexity: number, moduleCount: number): number => {
  return moduleCount === 2
    ? totalDays * (0.35 + (avgComplexity / RAYLEIGH_CONSTANTS.DUAL_MODULE.COMPLEXITY_RANGE))
    : totalDays * (0.35 + (avgComplexity / 40));
};

export const calculateMarginalCost = (params: ProjectParams): CostResult => {
  const { modules, developerRate, initialCost, teamSize } = params;
  const teamProductivity = calculateTeamProductivity(modules);
  const avgComplexity = modules.reduce((sum, mod) => sum + mod.complexity, 0) / modules.length;
  
  const totalEffort = calculateTotalEffort(modules);
  const baseCost = totalEffort * developerRate;
  const productivityMultiplier = Math.pow(teamProductivity.factor, Math.log(teamSize) / Math.log(4));
  const developmentCost = baseCost * productivityMultiplier;
  
  const totalDays = Math.ceil(totalEffort / (RAYLEIGH_CONSTANTS.HOURS_PER_DAY * teamSize));
  const peakDay = calculatePeakDay(totalDays, avgComplexity, modules.length);
  const K = 2 / (peakDay * peakDay);
  
  const costBreakdown: CostBreakdown[] = [];
  const dailyCosts: number[] = [];
  let currentCumulativeCost = initialCost;
  
  // Calcular costos diarios
  for (let day = 1; day <= totalDays; day++) {
    const effort = K * day * Math.exp(-K * day * day / 2);
    const dailyCost = developmentCost * effort;
    
    dailyCosts.push(dailyCost);
    currentCumulativeCost += dailyCost;
    
    costBreakdown.push({
      day,
      cost: dailyCost,
      cumulativeCost: currentCumulativeCost,
      phase: 'Development'
    });
  }

  // Ajustar los costos con factor de suavizado
  const totalCalculatedCost = dailyCosts.reduce((sum, cost) => sum + cost, 0);
  const smoothingFactor = 0.95;
  const scaleFactor = (developmentCost / totalCalculatedCost) * smoothingFactor;
  
  let adjustedCumulativeCost = initialCost;
  for (let i = 0; i < costBreakdown.length; i++) {
    const adjustedDailyCost = dailyCosts[i] * scaleFactor;
    adjustedCumulativeCost += adjustedDailyCost;
    
    costBreakdown[i] = {
      ...costBreakdown[i],
      cost: adjustedDailyCost,
      cumulativeCost: adjustedCumulativeCost
    };
  }

  return {
    totalCost: adjustedCumulativeCost,
    costBreakdown,
    metrics: {
      averageDailyCost: developmentCost / totalDays,
      peakCost: Math.max(...dailyCosts) * scaleFactor,
      estimatedEffort: totalEffort,
      efficiencyFactor: modules.length === 2 ? 110 : 100,
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