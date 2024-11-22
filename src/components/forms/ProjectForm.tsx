"use client";
// src/components/forms/ProjectForm.tsx

import { useState, useEffect } from "react";
import {
  VStack,
  SimpleGrid,
  Button,
  Box,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Select,
  IconButton,
  Text,
  Tooltip,
  Badge,
  HStack,
  Divider,
  Alert,
  Stack,
  AlertIcon,
} from "@chakra-ui/react";
import { Plus, Info, Trash2 } from "lucide-react";
import {
  ModuleSize,
  ModuleConfig,
  ProjectParams,
  MODULE_SIZE_HOURS,
} from "@/lib/types/project";
import { InputField } from "./InputField";

interface ProjectFormProps {
  onSubmit: (params: ProjectParams) => void;
  initialValues?: ProjectParams;
}

const COMPLEXITY_EXPLANATION = {
  title: "Project Complexity Guide:",
  levels: [
    {
      range: "1-3",
      name: "Simple",
      description: "Basic CRUD operations, simple UI, minimal integrations",
      examples: "Static pages, basic forms, simple data display",
    },
    {
      range: "4-6",
      name: "Moderate",
      description: "Multiple integrations, complex UI/UX, basic business logic",
      examples: "User authentication, payment processing, basic analytics",
    },
    {
      range: "7-8",
      name: "Complex",
      description:
        "Complex business logic, multiple external integrations, advanced features",
      examples: "Real-time features, complex calculations, advanced reporting",
    },
    {
      range: "9-10",
      name: "Very Complex",
      description:
        "Highly complex algorithms, advanced security requirements, complex architecture",
      examples:
        "AI/ML features, complex financial calculations, real-time collaboration",
    },
  ],
};

type ModuleField = keyof ModuleConfig;
type ModuleValue = string | number | ModuleSize;

export const ProjectForm = ({ onSubmit, initialValues }: ProjectFormProps) => {
  const toast = useToast();
  const [modules, setModules] = useState<ModuleConfig[]>(
    initialValues?.modules || []
  );
  const [params, setParams] = useState({
    developerRate: initialValues?.developerRate || 45,
    initialCost: initialValues?.initialCost || 200,
    teamSize: initialValues?.teamSize || 1,
  });

  useEffect(() => {
    if (initialValues) {
      setModules(initialValues.modules);
      setParams({
        developerRate: initialValues.developerRate,
        initialCost: initialValues.initialCost,
        teamSize: initialValues.teamSize,
      });
    }
  }, [initialValues]);

  const ComplexityTooltip = () => (
    <VStack
      align="start"
      spacing={2}
      p={4}
      bg="amber.50"
      borderRadius="md"
      border="1px solid"
      borderColor="amber.200"
      className="font-serif"
    >
      <Text fontWeight="bold" color="amber.900">
        {COMPLEXITY_EXPLANATION.title}
      </Text>
      {COMPLEXITY_EXPLANATION.levels.map((level, index) => (
        <Box key={index} className="relative">
          <Text fontWeight="semibold" color="amber.800">
            {level.range} - {level.name}
          </Text>
          <Text fontSize="sm" color="amber.700">
            {level.description}
          </Text>
          <Text fontSize="sm" color="amber.600" fontStyle="italic">
            Examples: {level.examples}
          </Text>
        </Box>
      ))}
    </VStack>
  );

  const addModule = () => {
    const newModules = [
      ...modules,
      {
        name: "",
        size: ModuleSize.SMALL,
        complexity: 1.0,
      },
    ];
    setModules(newModules);
  };

  const removeModule = (index: number) => {
    const newModules = modules.filter((_, i) => i !== index);
    setModules(newModules);
  };

  const updateModule = (
    index: number,
    field: ModuleField,
    value: ModuleValue
  ) => {
    const newModules = [...modules];
    newModules[index] = {
      ...newModules[index],
      [field]: value,
    };
    setModules(newModules);
  };

  const getTotalHours = () => {
    return modules.reduce(
      (total, module) =>
        total + MODULE_SIZE_HOURS[module.size] * module.complexity,
      0
    );
  };

  const handleParamChange = (key: keyof typeof params) => (value: number) => {
    const newParams = {
      ...params,
      [key]: value,
    };
    setParams(newParams);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (modules.length === 0) {
      toast({
        title: "No modules added",
        description: "Please add at least one module to estimate",
        status: "error",
        duration: 3000,
      });
      return;
    }

    if (modules.some((m) => !m.name.trim())) {
      toast({
        title: "Invalid module name",
        description: "All modules must have a name",
        status: "error",
        duration: 3000,
      });
      return;
    }

    const projectParams: ProjectParams = {
      modules,
      ...params,
    };

    onSubmit(projectParams);
  };

  return (
    <Box as="form" onSubmit={handleSubmit} className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <VStack spacing={{ base: 4, md: 8 }} className="relative">
        <Box w="full">
          {/* Header Section */}
          <Stack 
            direction={{ base: "column", sm: "row" }} 
            mb={{ base: 4, md: 6 }} 
            justify="space-between" 
            align={{ base: "stretch", sm: "center" }}
            spacing={4}
          >
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="bold"
              className="font-serif text-amber-800"
            >
              Project Modules
            </Text>
            <Button
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={addModule}
              className="bg-amber-600 hover:bg-amber-700 text-white font-serif w-full sm:w-auto"
              _hover={{ transform: "translateY(-1px)" }}
              transition="all 0.2s"
            >
              Add Module
            </Button>
          </Stack>

          {/* Modules Section */}
          <VStack spacing={{ base: 4, md: 6 }} w="full">
            {modules.map((module, index) => (
              <Box
                key={index}
                w="full"
                p={{ base: 4, md: 6 }}
                className="relative bg-white/80 backdrop-blur-sm rounded-lg border border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Corner decorations remain the same */}
                
                <Stack 
                  direction={{ base: "column", lg: "row" }} 
                  spacing={{ base: 4, lg: 6 }} 
                  alignItems="flex-start"
                  w="full"
                >
                  <FormControl isRequired>
                    <FormLabel className="font-serif text-amber-800">
                      Module Name
                    </FormLabel>
                    <Input
                      value={module.name}
                      onChange={(e) => updateModule(index, "name", e.target.value)}
                      placeholder="e.g., About Us, Products, etc."
                      className="border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                    />
                  </FormControl>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w={{ base: "full", lg: "auto" }}>
                    <FormControl isRequired>
                      <FormLabel className="font-serif text-amber-800">
                        Size
                      </FormLabel>
                      <Select
                        value={module.size}
                        onChange={(e) => updateModule(index, "size", e.target.value)}
                        className="border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                      >
                        {Object.entries(ModuleSize).map(([key, value]) => (
                          <option key={key} value={value}>
                            {key} ({MODULE_SIZE_HOURS[value]}h)
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel className="font-serif text-amber-800">
                        <HStack>
                          <Text>Complexity</Text>
                          <Tooltip
                            label={<ComplexityTooltip />}
                            hasArrow
                            placement="right"
                            openDelay={0}
                            closeDelay={100}
                          >
                            <Box cursor="help">
                              <Info size={16} className="text-amber-600" />
                            </Box>
                          </Tooltip>
                        </HStack>
                      </FormLabel>

                      <Stack 
                        direction={{ base: "column", sm: "row" }} 
                        spacing={4}
                        align={{ base: "stretch", sm: "center" }}
                      >
                        <InputField
                          value={module.complexity}
                          onChange={(value: number) => updateModule(index, "complexity", value)}
                          min={1}
                          max={10}
                          step={1}
                          required
                          width="100px"
                        />

                        {(() => {
                          const getComplexityInfo = (value: number) => {
                            if (value <= 3) return { color: "emerald", text: "Simple" };
                            if (value <= 6) return { color: "amber", text: "Moderate" };
                            if (value <= 8) return { color: "orange", text: "Complex" };
                            return { color: "red", text: "Very Complex" };
                          };

                          const complexityInfo = getComplexityInfo(module.complexity);

                          return (
                            <Badge
                              className={`bg-${complexityInfo.color}-100 text-${complexityInfo.color}-800 border border-${complexityInfo.color}-200`}
                              fontSize="md"
                              p={2}
                              width={{ base: "full", sm: "100px" }}
                              textAlign="center"
                            >
                              {complexityInfo.text}
                            </Badge>
                          );
                        })()}
                      </Stack>
                    </FormControl>
                  </SimpleGrid>

                  <IconButton
                    aria-label="Remove module"
                    icon={<Trash2 className="w-4 h-4" />}
                    onClick={() => removeModule(index)}
                    className="text-red-600 hover:bg-red-50 self-start mt-8"
                    variant="ghost"
                  />
                </Stack>
              </Box>
            ))}
          </VStack>

          {modules.length > 0 && (
            <Alert
              status="info"
              mt={6}
              className="bg-amber-50 border border-amber-200 text-amber-800"
            >
              <AlertIcon className="text-amber-600" />
              <Text className="font-serif">
                Total estimated hours: {getTotalHours()} hours
              </Text>
            </Alert>
          )}
        </Box>

        <Divider className="border-amber-200" />

        {/* Parameters Section */}
        <SimpleGrid 
          columns={{ base: 1, md: 2, lg: 3 }} 
          spacing={{ base: 4, md: 6 }} 
          width="full"
        >
          <InputField
            label="Developer Rate ($/hour)"
            value={params.developerRate}
            onChange={handleParamChange("developerRate")}
            min={0}
            type="currency"
            helperText="Hourly rate per developer"
            required
          />

          <InputField
            label="Initial Cost"
            value={params.initialCost}
            onChange={handleParamChange("initialCost")}
            min={0}
            type="currency"
            helperText="Setup and initial costs"
            required
          />

          <InputField
            label="Team Size"
            value={params.teamSize}
            onChange={handleParamChange("teamSize")}
            min={1}
            helperText="Number of developers"
            required
          />
        </SimpleGrid>

        <Button
          type="submit"
          size="lg"
          width={{ base: "full", md: "auto" }}
          isDisabled={modules.length === 0}
          className="bg-amber-600 hover:bg-amber-700 text-white font-serif px-8 py-4 transform hover:-translate-y-1 transition-all duration-300"
        >
          Calculate Estimate
        </Button>
      </VStack>
    </Box>
  );
};