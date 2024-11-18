// Cost calculator with COCOMO model maintaining original CostMetrics interface
import { ProjectParams, ModuleSize, MODULE_SIZE_HOURS } from '@/lib/types/project';
import { CostResult, CostBreakdown } from '@/lib/types/cost';
import { ModuleConfig } from '@/lib/types/project';

const COCOMO_CONSTANTS = {
  ORGANIC: {
    a: 2.4,
    b: 1.05,
    c: 2.5,
    d: 0.38
  },
  SEMI_DETACHED: {
    a: 3.0,
    b: 1.12,
    c: 2.5,
    d: 0.35
  },
  EMBEDDED: {
    a: 3.6,
    b: 1.20,
    c: 2.5,
    d: 0.32
  },
  HOURS_PER_MONTH: 152,
  HOURS_PER_DAY: 8
};

interface ProjectType {
  type: 'ORGANIC' | 'SEMI_DETACHED' | 'EMBEDDED';
  factor: number;
  teamProductivity: string;
}

const determineProjectType = (
  modules: ModuleConfig[],
  teamSize: number
): ProjectType => {
  const totalKLOC = modules.reduce(
    (sum, mod) => sum + (MODULE_SIZE_HOURS[mod.size] * mod.complexity) / 20, 
    0
  );

  if (totalKLOC <= 50 && teamSize <= 5) {
    return {
      type: 'ORGANIC',
      factor: 1.0,
      teamProductivity: 'Small project with experienced team'
    };
  }
  if (totalKLOC <= 300 && teamSize <= 15) {
    return {
      type: 'SEMI_DETACHED',
      factor: 1.2,
      teamProductivity: 'Medium project with mixed experience'
    };
  }
  return {
    type: 'EMBEDDED',
    factor: 1.4,
    teamProductivity: 'Complex project requiring high expertise'
  };
};

export const calculateCocomoCost = (params: ProjectParams): CostResult => {
  const { modules, developerRate, initialCost, teamSize } = params;
  
  const totalEffort = modules.reduce(
    (sum, mod) => sum + (MODULE_SIZE_HOURS[mod.size] * mod.complexity),
    0
  );
  
  const totalDays = Math.ceil(totalEffort / (COCOMO_CONSTANTS.HOURS_PER_DAY * teamSize));
  const peakDay = totalDays * 0.4; // Peak at 40% of project duration
  
  let costBreakdown: CostBreakdown[] = [];
  let totalCost = initialCost;
  let dailyCosts: number[] = [];
  
  for (let day = 1; day <= totalDays; day++) {
    // Rayleigh distribution formula
    const t = day / peakDay;
    const dailyEffort = (2 * totalEffort / (peakDay * Math.E)) * 
                       t * Math.exp(-(t * t));
    
    const dailyCost = dailyEffort * developerRate;
    const maxDailyTeamCost = developerRate * COCOMO_CONSTANTS.HOURS_PER_DAY * teamSize;
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

  const totalCalculatedEffort = dailyCosts.reduce((sum, cost) => sum + cost/developerRate, 0);
  const scaleFactor = totalEffort / totalCalculatedEffort;
  
  // Normalize costs to match total effort
  costBreakdown = costBreakdown.map((breakdown, index) => {
    const adjustedCost = dailyCosts[index] * scaleFactor;
    return {
      ...breakdown,
      cost: adjustedCost,
      cumulativeCost: index === 0 
        ? initialCost + adjustedCost
        : costBreakdown[index-1].cumulativeCost + adjustedCost
    };
  });

  const adjustedDailyCosts = dailyCosts.map(cost => cost * scaleFactor);
  const averageDailyCost = adjustedDailyCosts.reduce((a, b) => a + b) / adjustedDailyCosts.length;
  const peakCost = Math.max(...adjustedDailyCosts);

  return {
    totalCost: costBreakdown[costBreakdown.length - 1].cumulativeCost,
    costBreakdown,
    metrics: {
      averageDailyCost,
      peakCost,
      estimatedEffort: totalEffort,
      efficiencyFactor: 100,
      teamProductivity: determineProjectType(modules, teamSize).teamProductivity
    },
    summary: {
      development: totalCost - initialCost,
      overhead: initialCost,
      requirements: totalEffort * 0.2 * developerRate,
      testing: totalEffort * 0.3 * developerRate
    }
  };
};