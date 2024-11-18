 import exp from 'constants';
import { ProjectParams } from './project';
  // src/lib/types/cost.ts
  export interface CostBreakdown {
    day: number;
    cost: number;
    cumulativeCost: number;
    phase?: string;

    
  }

  export interface CostSummaryProps {
    totalCost: number;
    averageDailyCost: number;
    peakCost: number;
    estimatedEffort: number;
    costBreakdown: CostBreakdown[];
    teamSize: number;
  }
  
  export interface CostMetrics {
    averageDailyCost: number;
    peakCost: number;
    estimatedEffort: number;
    efficiencyFactor: number;
    teamProductivity: string;
    
  }

  
  
  export interface CostResult {
    totalCost: number;
    costBreakdown: CostBreakdown[];
    metrics: CostMetrics;
    summary: {
      requirements: number;
      development: number;
      testing: number;
      overhead: number;
    };
  }
  
  export interface ModelParameters {
    type: 'marginal' | 'putnam';
    options: {
      riskFactor?: number;        // Factor de riesgo adicional
      contingencyPercentage?: number; // Porcentaje de contingencia
      overheadRate?: number;      // Tasa de gastos generales
      profitMargin?: number;      // Margen de beneficio deseado
    };
  }
  
  // Tipos para el modelo de Putnam
  export interface PutnamModelParams extends ProjectParams {
    manpower: number;           // Esfuerzo total en personas-mes
    timeToDelivery: number;     // Tiempo hasta la entrega en meses
    b0: number;                 // Parámetro de tamaño del proyecto
    productivityParameter: number; // Parámetro de productividad
  }
  
  // Tipos para análisis de riesgo
  export interface RiskAssessment {
    level: 'low' | 'medium' | 'high';
    factors: {
      technical: number;
      schedule: number;
      cost: number;
      resource: number;
    };
    impact: number;
    mitigation: string[];
  }
  
  // Tipos para histórico de estimaciones
  export interface EstimationHistory {
    id: string;
    date: Date;
    params: ProjectParams;
    result: CostResult;
    actualCost?: number;
    variance?: number;
    notes?: string;
  }
  
  // Tipos para comparación de modelos
  export interface ModelComparison {
    marginalCost: CostResult;
    putnamModel: CostResult;
    difference: {
      totalCost: number;
      averageDailyCost: number;
      estimatedEffort: number;
      percentageVariance: number;
    };
    recommendation: {
      preferredModel: 'marginal' | 'putnam';
      reason: string;
      confidenceLevel: number;
    };
  }
  
  // Tipos para reportes
  export interface CostReport {
    projectId: string;
    generatedAt: Date;
    estimations: CostResult;
    riskAssessment: RiskAssessment;
    comparison?: ModelComparison;
    recommendations: string[];
    charts: {
      costOverTime: CostBreakdown[];
      resourceUtilization: {
        day: number;
        utilization: number;
      }[];
      riskMatrix: {
        category: string;
        probability: number;
        impact: number;
      }[];
    };
  }