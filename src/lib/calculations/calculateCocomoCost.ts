import { ProjectParams, ModuleSize, MODULE_SIZE_HOURS } from '@/lib/types/project';
import { CostResult, CostBreakdown } from '@/lib/types/cost';

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
  HOURS_PER_DAY: 8,
  LOC_PER_HOUR: 50
};

interface ProjectType {
  type: 'ORGANIC' | 'SEMI_DETACHED' | 'EMBEDDED';
  factor: number;
  teamProductivity: string;
}

const determineProjectType = (
  totalHours: number,
  teamSize: number
): ProjectType => {
  const totalKLOC = (totalHours * COCOMO_CONSTANTS.LOC_PER_HOUR) / 1000;

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
  
  const inputHours = modules.reduce(
    (sum, mod) => sum + (MODULE_SIZE_HOURS[mod.size] * mod.complexity),
    0
  );
  
  const projectType = determineProjectType(inputHours, teamSize);
  const totalEffortHours = inputHours * projectType.factor;
  const totalDays = Math.ceil(totalEffortHours / (COCOMO_CONSTANTS.HOURS_PER_DAY * teamSize));
  const peakDay = totalDays * 0.4;
  
  let costBreakdown: CostBreakdown[] = [];
  let currentCost = initialCost;
  const dailyCosts: number[] = [];
  let totalEffortDistributed = 0;
  
  // Factor de eficiencia del equipo: disminuye a medida que el equipo crece
  const teamEfficiencyFactor = 1 / Math.sqrt(teamSize);
  
  for (let day = 1; day <= totalDays; day++) {
    const t = day / peakDay;
    const dailyTeamEffort = (2 * totalEffortHours / (peakDay * Math.E)) * 
                           t * Math.exp(-(t * t));
    totalEffortDistributed += dailyTeamEffort;
    
    // Ajuste del costo considerando la eficiencia del equipo
    const dailyCost = dailyTeamEffort * developerRate * teamSize * teamEfficiencyFactor;
    const maxDailyTeamCost = COCOMO_CONSTANTS.HOURS_PER_DAY * teamSize * developerRate * teamEfficiencyFactor;
    const adjustedDailyCost = Math.min(dailyCost, maxDailyTeamCost);
    
    currentCost += adjustedDailyCost;
    dailyCosts.push(adjustedDailyCost);
    
    costBreakdown.push({
      day,
      cost: adjustedDailyCost,
      cumulativeCost: currentCost,
      phase: 'Development'
    });
  }

  const effortScaleFactor = totalEffortHours / totalEffortDistributed;
  const scaledDailyCosts = dailyCosts.map(cost => cost * effortScaleFactor);
  currentCost = initialCost;
  
  costBreakdown = costBreakdown.map((breakdown, index) => {
    currentCost += scaledDailyCosts[index];
    return {
      ...breakdown,
      cost: scaledDailyCosts[index],
      cumulativeCost: currentCost,
      phase: 'Development'
    };
  });

  return {
    totalCost: currentCost,
    costBreakdown,
    metrics: {
      averageDailyCost: scaledDailyCosts.reduce((a, b) => a + b) / scaledDailyCosts.length,
      peakCost: Math.max(...scaledDailyCosts),
      estimatedEffort: totalEffortHours,
      efficiencyFactor: (totalEffortHours / (totalDays * COCOMO_CONSTANTS.HOURS_PER_DAY)) * 100,
      teamProductivity: projectType.teamProductivity
    },
    summary: {
      development: currentCost - initialCost,
      overhead: initialCost,
      requirements: 0,
      testing: 0
    }
  };
};