'use client'
// app/providers.tsx

import dynamic from 'next/dynamic'
import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      }
    }
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  }
})

// Envuelve el ChakraProvider en un componente dinamico
const ChakraProviderClient = dynamic(
  () => Promise.resolve(ChakraProvider),
  { ssr: false }
)

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProviderClient theme={theme}>
        {children}
      </ChakraProviderClient>
    </CacheProvider>
  )
}