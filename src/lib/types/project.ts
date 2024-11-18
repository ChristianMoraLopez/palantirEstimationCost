
export type ScaleFactorLevel = 'VERY_LOW' | 'LOW' | 'NOMINAL' | 'HIGH' | 'VERY_HIGH' | 'EXTRA_HIGH';

export interface CocomoScaleFactors {
  precedence: ScaleFactorLevel;
  flexibility: ScaleFactorLevel;
  riskResolution: ScaleFactorLevel;
  teamCohesion: ScaleFactorLevel;
  processMaturiry: ScaleFactorLevel;
}

export interface CocomoEffortMultipliers {
  reliability: Exclude<ScaleFactorLevel, 'EXTRA_HIGH'>;
  dataSize: Exclude<ScaleFactorLevel, 'EXTRA_HIGH' | 'VERY_LOW'>;
  complexity: ScaleFactorLevel;
  requiredReusability: Exclude<ScaleFactorLevel, 'VERY_LOW'>;
  teamCapability: Exclude<ScaleFactorLevel, 'EXTRA_HIGH'>;
}

// Interfaz base para ProjectParams (sin cambios)
export interface ProjectParams {
  modules: ModuleConfig[];
  developerRate: number;
  initialCost: number;
  teamSize: number;
}

// Interfaz para parámetros de COCOMO II que extiende ProjectParams
export interface CocomoParams extends ProjectParams {
  scaleFactors?: Partial<CocomoScaleFactors>;
  effortMultipliers?: Partial<CocomoEffortMultipliers>;
}
  
  export interface ModuleConfig {
    name: string;
    size: ModuleSize;
    complexity: number;
  }
  
  export interface ProjectPhase {
    start: number;             // Día de inicio de la fase
    end: number;              // Día final de la fase
    costMultiplier: number;   // Multiplicador de costo para la fase
    name: string;             // Nombre de la fase
  }
  
  export interface ProjectValidation {
    isValid: boolean;
    errors: {
      [key in keyof ProjectParams]?: string;
    };
  }
  
  // src/lib/types/project.ts
export enum ModuleSize {
    SMALL = 'SMALL',     // 8 horas
    MEDIUM = 'MEDIUM',   // 16 horas
    LARGE = 'LARGE',     // 24 horas
    EXTRA_LARGE = 'EXTRA_LARGE' // 40 horas
  }
  


 
  
  export const MODULE_SIZE_HOURS = {
    [ModuleSize.SMALL]: 8,
    [ModuleSize.MEDIUM]: 16,
    [ModuleSize.LARGE]: 24,
    [ModuleSize.EXTRA_LARGE]: 40
  };
  
  export const MODULE_EXAMPLES = {
    [ModuleSize.SMALL]: [
      'About Us page',
      'Contact Form',
      'Simple FAQ page',
      'Footer component'
    ],
    [ModuleSize.MEDIUM]: [
      'User Authentication',
      'Blog listing',
      'Simple Dashboard',
      'Search functionality'
    ],
    [ModuleSize.LARGE]: [
      'Product Catalog with filters',
      'User Profile with editing',
      'Admin Dashboard',
      'Payment Integration'
    ],
    [ModuleSize.EXTRA_LARGE]: [
      'Complex E-commerce functionality',
      'Real-time Chat system',
      'Advanced Analytics Dashboard',
      'Custom CMS'
    ]
  };