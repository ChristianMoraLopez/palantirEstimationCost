'use client'

import { useState } from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputGroup,
  InputLeftAddon,
  Tooltip,
  Box,
} from '@chakra-ui/react';
import { Info } from 'lucide-react';

interface InputFieldProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  helperText?: string;
  error?: string;
  type?: 'number' | 'currency' | 'percentage';
  required?: boolean;
  width?: string;
}

export const InputField = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  helperText,
  error,
  type = 'number',
  required = false,
  width,
}: InputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());

  const handleChange = (valueString: string) => {
    // Eliminar cualquier caracter que no sea número o punto decimal
    const cleanValue = valueString.replace(/[^\d.-]/g, '');
    setInputValue(cleanValue);

    const numValue = parseFloat(cleanValue);
    if (!isNaN(numValue)) {
      // Aplicar límites solo cuando el input pierde el foco
      let finalValue = numValue;
      if (min !== undefined) finalValue = Math.max(min, finalValue);
      if (max !== undefined) finalValue = Math.min(max, finalValue);
      onChange(finalValue);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Formatear el valor cuando el input pierde el foco
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      let finalValue = numValue;
      if (min !== undefined) finalValue = Math.max(min, finalValue);
      if (max !== undefined) finalValue = Math.min(max, finalValue);
      
      switch (type) {
        case 'currency':
          setInputValue(finalValue.toFixed(2));
          break;
        case 'percentage':
          setInputValue(finalValue.toString());
          break;
        default:
          setInputValue(finalValue.toString());
      }
      onChange(finalValue);
    }
  };

  return (
    <FormControl
      isInvalid={!!error}
      isRequired={required}
      width={width}
      position="relative"
    >
      {label && (
        <FormLabel 
          display="flex" 
          alignItems="center" 
          gap={2}
          className="font-serif"
          color="amber.800"
        >
          {label}
          {helperText && (
            <Tooltip 
              label={helperText} 
              hasArrow 
              bg="amber.50"
              color="amber.900"
              fontSize="sm"
              p={2}
              borderRadius="md"
              boxShadow="lg"
            >
              <Box as="span" cursor="help">
                <Info size={16} className="text-amber-600" />
              </Box>
            </Tooltip>
          )}
        </FormLabel>
      )}

      <InputGroup
        position="relative"
        transition="all 0.2s"
        className={`
          ${isFocused ? 'shadow-md' : 'shadow-sm'}
          rounded-md
          overflow-hidden
        `}
      >
        {type === 'currency' && (
          <InputLeftAddon 
            className="bg-amber-50 border-amber-200 text-amber-800"
          >
            $
          </InputLeftAddon>
        )}
        
        <NumberInput
          value={inputValue}
          onChange={handleChange}
          w="full"
          keepWithinRange={false}
        >
          <NumberInputField 
            className={`
              border-amber-200
              bg-white
              focus:border-amber-400
              focus:ring-2
              focus:ring-amber-200
              text-amber-900
              placeholder-amber-300
              ${error ? 'border-red-300' : ''}
            `}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
          />
          <NumberInputStepper>
            <NumberIncrementStepper 
              className="text-amber-600 hover:bg-amber-50"
              borderColor="amber.200"
              onClick={() => {
                const newValue = parseFloat(inputValue) + (step || 1);
                handleChange(newValue.toString());
                handleBlur();
              }}
            />
            <NumberDecrementStepper 
              className="text-amber-600 hover:bg-amber-50"
              borderColor="amber.200"
              onClick={() => {
                const newValue = parseFloat(inputValue) - (step || 1);
                handleChange(newValue.toString());
                handleBlur();
              }}
            />
          </NumberInputStepper>
        </NumberInput>

        {type === 'percentage' && (
          <InputLeftAddon 
            className="bg-amber-50 border-amber-200 text-amber-800"
          >
            %
          </InputLeftAddon>
        )}
      </InputGroup>

      {error && (
        <FormErrorMessage className="text-red-500">
          {error}
        </FormErrorMessage>
      )}
      
      {helperText && !error && (
        <FormHelperText className="text-amber-600/70 font-serif italic">
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};