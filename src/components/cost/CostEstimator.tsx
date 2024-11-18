"use client";

import { useState } from "react";
import {
  Box,
  VStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useToast,
  Card,
  CardHeader,
  CardBody,
  Heading,
} from "@chakra-ui/react";
import { CostSummary } from "./CostSummary";
import { ProjectForm } from "../forms/ProjectForm";
import { calculateMarginalCost } from "@/lib/calculations/marginalCost";
import { calculateCocomoCost } from "@/lib/calculations/calculateCocomoCost";
import type { ProjectParams, ModuleConfig } from "@/lib/types/project";

export const CostEstimator = () => {
  const toast = useToast();
  const [activeModel, setActiveModel] = useState(0);
  
  // Lift project state up to be shared between tabs
  const [projectParams, setProjectParams] = useState<ProjectParams>({
    modules: [],
    developerRate: 45,
    initialCost: 200,
    teamSize: 1,
  });
  
  // Separate state for results from each model
  const [results, setResults] = useState<{
    marginal: any | null;
    putnam: any | null;
  }>({
    marginal: null,
    putnam: null,
  });

  const handleCalculate = (params: ProjectParams) => {
    try {
      // Update shared project params
      setProjectParams(params);
      
      // Calculate based on active model
      const result = activeModel === 0
        ? calculateMarginalCost(params)
        : calculateCocomoCost(params);
      
      if (!result?.costBreakdown || !Array.isArray(result.costBreakdown)) {
        throw new Error('Invalid cost breakdown data structure');
      }
      
      // Store results in the appropriate model's state
      setResults(prev => ({
        ...prev,
        [activeModel === 0 ? 'marginal' : 'putnam']: result
      }));

      toast({
        title: "Calculation completed",
        description: "Cost estimation has been updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Calculation error:', error);
      toast({
        title: "Error in calculation",
        description: String(error) || "Please check your input parameters",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleTabChange = (index: number) => {
    setActiveModel(index);
    
    // If we already have params, calculate with the new model
    if (projectParams.modules.length > 0) {
      handleCalculate(projectParams);
    }
  };

  // Get current results based on active model
  const currentResults = activeModel === 0 ? results.marginal : results.putnam;

  return (
    <VStack spacing={8} align="stretch">
      <Card>
        <CardHeader>
          <Heading size="md">Cost Estimation Model</Heading>
        </CardHeader>
        <CardBody>
          <Tabs onChange={handleTabChange}>
            <TabList>
              <Tab>Marginal Cost Model</Tab>
              <Tab>Cocomo II</Tab>
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
        <Card>
          <CardHeader>
            <Heading size="md">
              {activeModel === 0 ? "Marginal Cost" : "Cocomo II"} Results
            </Heading>
          </CardHeader>
          <CardBody>
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