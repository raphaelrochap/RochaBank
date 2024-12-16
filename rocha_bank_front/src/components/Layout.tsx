import { Titulo } from "@/components/Titulo"
import useRochaBankStore from "@/store/store"
import { Box, Button, Container, HStack, Spacer, useToast, VStack } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import { ReactNode } from "react"
import { FaPowerOff } from "react-icons/fa6"

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter()
  const toast = useToast()
  const bearerToken = useRochaBankStore((state) => state.bearerToken)
  const setBearerToken = useRochaBankStore((state) => state.setBearerToken)
  
  const handleSairClick = () => {
    setBearerToken("")

    toast({
      title: 'Sessão encerrada com sucesso.',
      description: 'Não se esqueça de retirar o seu cartão.',
      status: 'success',
      duration: 4000,
      position: 'top',
      isClosable: true,
    })
    
    router.push('login')
  }

  return (
    <>
      <Container minHeight="100vh" w="100vw">
        <VStack w="full" >
          <HStack justifyContent={'space-between'} bgColor={'blue.600'} w='100vw' h={'100px'}>
              <Titulo title="RochaBank" />
            {bearerToken && <Button mr='40px' leftIcon={<FaPowerOff  />} onClick={handleSairClick}>Sair</Button>}
          </HStack>
          <Spacer />
          <Box w='100vw'>
            {children}
          </Box>
        </VStack>
      </Container>
    </>
  )
}

export default Layout
