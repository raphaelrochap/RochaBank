import { api } from "@/api/api";
import Layout from "@/components/Layout";
import useRochaBankStore from "@/store/store";
import { Button, Center, FormControl, FormLabel, Heading, HStack, InputGroup, InputLeftAddon, NumberInput, NumberInputField, Spacer, useToast, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdOutlineArrowForwardIos } from "react-icons/md";

const Deposito = () => {
  const router = useRouter()
  const toast = useToast()
  const [valor, setValor] = useState(0)
  const bearerToken = useRochaBankStore((state) => state.bearerToken)
  const numeroConta = useRochaBankStore((state) => state.numeroConta)

  const Depositar = async () => {
    const payload = { numeroConta, valor }
    const response = await api(bearerToken).patch('/ContaBancaria/deposito', payload)

    if (response.status == 200) {
      toast({
        title: 'Depósito realizado com sucesso!',
        status: 'success',
        duration: 4000,
        position: 'top',
        isClosable: true,
      })
      router.push('/')
    }

  }

  const handleAlteraValor = (newValue: number) => {
    setValor(newValue)
  }

  useEffect(() => {
    if (numeroConta == "")
      router.push('login')
  }, [numeroConta])

  return (
    <>
      <Layout>
        <Center>
          <Button size={'lg'} rightIcon={<MdOutlineArrowForwardIos />} colorScheme='blue' onClick={() => {
            router.push('/')
          }}>
            Voltar
          </Button>
        </Center>
        <Center mt='10px'>
          <Heading>Quanto você quer depositar?</Heading>
        </Center>
        <Center mx='200px' mt='50px'>
          <HStack gap={'150px'} >
            <VStack>
              <Button w='135px' size={'lg'} colorScheme='blue' onClick={() => setValor(10)}>
                R$ 10
              </Button>
              <Button w='135px' size={'lg'} colorScheme='blue' onClick={() => handleAlteraValor(20)}>
                R$ 20
              </Button>
              <Button w='135px' size={'lg'} colorScheme='blue' onClick={() => handleAlteraValor(50)}>
                R$ 50
              </Button>
              <Button w='135px' size={'lg'} colorScheme='blue' onClick={() => handleAlteraValor(100)}>
                R$ 100
              </Button>
              <Button w='135px' size={'lg'} colorScheme='blue' onClick={() => handleAlteraValor(200)}>
                R$ 200
              </Button>
            </VStack>
            <Spacer />
            <VStack textAlign={'end'}>
              <FormControl>
                <FormLabel textAlign={'center'}>Valor</FormLabel>
                <InputGroup>
                  <InputLeftAddon>R$</InputLeftAddon>
                  <NumberInput defaultValue={15} precision={0} step={1} value={valor}>
                    <NumberInputField borderTopLeftRadius={'0px'} borderBottomLeftRadius={'0px'}
                      onChange={(e) => {
                        if (e.target.value != '.')
                          setValor(Number(e.target.value))
                      }} />
                  </NumberInput>
                </InputGroup>
              </FormControl>
              <Button mt='60px' size='lg' colorScheme="blue" onClick={Depositar}>Depositar valor</Button>
              <Spacer />
            </VStack>
          </HStack>
        </Center>
      </Layout>
    </>
  );
}

export default Deposito