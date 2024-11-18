"use client";
// src/components/cost/CostSummary.tsx
import { CostChart } from "./CostChart";
import { CocomoFramework } from "@components/theoreticalFrameworkCocomoII";
import { TheoreticalFramework } from "@components/theoreticalFramework";
import { CostSummaryProps } from "@/lib/types/cost";
import {
  Alert,
  Box,
  Grid,
  GridItem,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";


interface ExtendedCostSummaryProps extends CostSummaryProps {
  activeModel: number;
}

export const CostSummary = ({
  totalCost,
  averageDailyCost,
  peakCost,
  estimatedEffort,
  costBreakdown,
  teamSize = 1,
  activeModel
}: ExtendedCostSummaryProps) => {
  const workDays = Math.ceil(estimatedEffort / 8);
  const teamWorkDays = Math.ceil(workDays / teamSize);

  return (
    <VStack spacing={6} w="full">
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
        gap={4}
        w="full"
      >
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <Alert status="info" borderRadius="md" p={4}>
            <Box w="full">
              <StatGroup>
                <Stat>
                  <StatLabel>Total Cost</StatLabel>
                  <StatNumber>${totalCost.toFixed(2)}</StatNumber>
                  <Text fontSize="sm" color="gray.600">
                    Total investment
                  </Text>
                </Stat>
                <Stat>
                  <StatLabel>Daily Average</StatLabel>
                  <StatNumber>${averageDailyCost.toFixed(2)}</StatNumber>
                  <Text fontSize="sm" color="gray.600">
                    Per day cost
                  </Text>
                </Stat>
                <Stat>
                  <StatLabel>Peak Cost</StatLabel>
                  <StatNumber>${peakCost.toFixed(2)}</StatNumber>
                  <Text fontSize="sm" color="gray.600">
                    Maximum daily cost
                  </Text>
                </Stat>
              </StatGroup>
            </Box>
          </Alert>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <Alert status="success" borderRadius="md" p={4}>
            <Box w="full">
              <StatGroup>
                <Stat>
                  <StatLabel>Total Effort</StatLabel>
                  <StatNumber>{estimatedEffort.toFixed(1)}</StatNumber>
                  <Text fontSize="sm" color="gray.600">
                    Hours
                  </Text>
                </Stat>
                <Stat>
                  <StatLabel>Individual Duration</StatLabel>
                  <StatNumber>{workDays}</StatNumber>
                  <Text fontSize="sm" color="gray.600">
                    Single dev (8h/day)
                  </Text>
                </Stat>
                <Stat>
                  <StatLabel>Team Duration</StatLabel>
                  <StatNumber>{teamWorkDays}</StatNumber>
                  <Text fontSize="sm" color="gray.600">
                    {teamSize} dev{teamSize > 1 ? 's' : ''} (8h/day)
                  </Text>
                </Stat>
              </StatGroup>
            </Box>
          </Alert>
        </GridItem>
      </Grid>

      <Box w="full" p={4} borderWidth={1} borderRadius="md">
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Cost Distribution Over Time
        </Text>
        <CostChart data={costBreakdown} activeModel={activeModel}/>
      </Box>
      
      {activeModel === 0 ? (
        <TheoreticalFramework
          totalCost={totalCost}
          averageDailyCost={averageDailyCost}
          peakCost={peakCost}
          estimatedEffort={estimatedEffort}
          teamSize={teamSize}
          costBreakdown={costBreakdown}
        />
      ) : (
        <CocomoFramework
          totalCost={totalCost}
          averageDailyCost={averageDailyCost}
          peakCost={peakCost}
          estimatedEffort={estimatedEffort}
          teamSize={teamSize}
          costBreakdown={costBreakdown}
        />
      )}
    </VStack>
  );
};