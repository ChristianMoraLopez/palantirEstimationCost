'use client'

import { useState } from "react";
import { VStack, Tabs, TabList, Tab, TabPanels, TabPanel, useToast, Card, CardHeader, CardBody, Heading } from "@chakra-ui/react";
import { CostSummary } from "./CostSummary";
import { ProjectForm } from "../forms/ProjectForm";
import { calculateMarginalCost } from "@/lib/calculations/marginalCost";
import { calculateCocomoCost } from "@/lib/calculations/calculateCocomoCost";
import type {  CostResult } from "@/lib/types/cost";
import type { ProjectParams } from "@/lib/types/project";

const ElvishBorder = () => (
  <div className="absolute inset-0 pointer-events-none">
    <div className="w-full h-full border-4 border-amber-600/20 rounded-lg">
      <div className="absolute -top-3 -left-3 w-6 h-6 border-t-4 border-l-4 border-amber-600/40 rounded-tl-lg" />
      <div className="absolute -top-3 -right-3 w-6 h-6 border-t-4 border-r-4 border-amber-600/40 rounded-tr-lg" />
      <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-4 border-l-4 border-amber-600/40 rounded-bl-lg" />
      <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-4 border-r-4 border-amber-600/40 rounded-br-lg" />
    </div>
  </div>
);

export const CostEstimator = () => {
  const toast = useToast();
  const [activeModel, setActiveModel] = useState(0);
  const [projectParams, setProjectParams] = useState<ProjectParams>({
    modules: [],
    developerRate: 45,
    initialCost: 200,
    teamSize: 1,
  });
  const [results, setResults] = useState<{
    marginal: CostResult | null;
    putnam: CostResult | null;
  }>({
    marginal: null,
    putnam: null,
  });

  const handleCalculate = (params: ProjectParams) => {
    try {
      setProjectParams(params);
      
      const result = activeModel === 0
        ? calculateMarginalCost(params)
        : calculateCocomoCost(params);
      
      if (!result?.costBreakdown || !Array.isArray(result.costBreakdown)) {
        throw new Error('Invalid cost breakdown data structure');
      }
      
      setResults(prev => ({
        ...prev,
        [activeModel === 0 ? 'marginal' : 'putnam']: result
      }));

      toast({
        title: "Prophecy Fulfilled",
        description: "The Palantír has revealed new visions of cost",
        status: "success",
        duration: 3000,
        isClosable: true,
        containerStyle: {
          background: "rgb(251, 243, 219)",
          color: "rgb(146, 64, 14)",
          border: "1px solid rgb(217, 119, 6)",
          borderRadius: "0.375rem",
        },
      });
    } catch (error) {
      console.error('Vision error:', error);
      toast({
        title: "The Vision is Clouded",
        description: error instanceof Error ? error.message : "The signs are unclear. Please check your offerings",
        status: "error",
        duration: 3000,
        isClosable: true,
        containerStyle: {
          background: "rgb(254, 242, 242)",
          color: "rgb(153, 27, 27)",
          border: "1px solid rgb(220, 38, 38)",
          borderRadius: "0.375rem",
        },
      });
    }
  };

  const handleTabChange = (index: number) => {
    setActiveModel(index);
    if (projectParams.modules.length > 0) {
      handleCalculate(projectParams);
    }
  };

  const currentResults = activeModel === 0 ? results.marginal : results.putnam;

  return (
    <VStack spacing={8} align="stretch" className="bg-gradient-to-b from-amber-50/50 to-amber-100/30 p-8 rounded-lg">
      <Card className="relative bg-white/80 backdrop-blur-sm rounded-lg shadow-xl">
        <ElvishBorder />
        <CardHeader className="relative z-10">
          <Heading size="lg" className="font-serif text-amber-800 text-center">
            {activeModel === 0 ? "The Marginal Cost Oracle" : "The Cocomo II Seer"}
          </Heading>
        </CardHeader>
        <CardBody className="relative z-10">
          <Tabs 
            onChange={handleTabChange}
            className="font-serif"
          >
            <TabList className="border-b border-amber-200">
              <Tab 
                className="text-amber-700 font-medium hover:bg-amber-50/50 transition-colors duration-200"
                _selected={{
                  color: "rgb(146, 64, 14)",
                  borderColor: "rgb(146, 64, 14)",
                  borderBottom: "2px solid",
                  bg: "rgb(251, 243, 219)",
                }}
              >
                Vision of Marginal Cost
              </Tab>
              <Tab
                className="text-amber-700 font-medium hover:bg-amber-50/50 transition-colors duration-200"
                _selected={{
                  color: "rgb(146, 64, 14)",
                  borderColor: "rgb(146, 64, 14)",
                  borderBottom: "2px solid",
                  bg: "rgb(251, 243, 219)",
                }}
              >
                Prophecy of Cocomo II
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <ProjectForm 
                  onSubmit={handleCalculate}
                  initialValues={projectParams}
                />
              </TabPanel>
              <TabPanel>
                <ProjectForm 
                  onSubmit={handleCalculate}
                  initialValues={projectParams}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>

      {currentResults && (
        <Card className="relative bg-white/80 backdrop-blur-sm rounded-lg shadow-xl transform hover:shadow-2xl transition-all duration-300">
          <ElvishBorder />
          <CardHeader className="relative z-10">
            <Heading size="md" className="font-serif text-amber-800 text-center">
              {activeModel === 0 ? "Revelations of the Oracle" : "Prophecies of the Seer"}
            </Heading>
          </CardHeader>
          <CardBody className="relative z-10">
            <CostSummary
              totalCost={currentResults.totalCost}
              averageDailyCost={currentResults.metrics.averageDailyCost}
              peakCost={currentResults.metrics.peakCost}
              estimatedEffort={currentResults.metrics.estimatedEffort}
              costBreakdown={currentResults.costBreakdown}
              teamSize={projectParams.teamSize}
              activeModel={activeModel}
            />
          </CardBody>
        </Card>
      )}
    </VStack>
  );
};