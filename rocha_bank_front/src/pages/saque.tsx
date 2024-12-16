import { api } from "@/api/api";
import Layout from "@/components/Layout";
import useRochaBankStore from "@/store/store";
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Center, Divider, FormControl, FormLabel, Heading, HStack, InputGroup, InputLeftAddon, NumberInput, NumberInputField, Spacer, Step, StepDescription, StepIcon, StepIndicator, StepNumber, Stepper, StepSeparator, StepStatus, StepTitle, Text, useSteps, useToast, VStack } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdOutlineArrowForwardIos, MdOutlineArrowBackIos } from "react-icons/md";
import dois from './../assets/dois.jpg'
import cinco from './../assets/cinco.jpg'
import dez from './../assets/dez.jpg'
import vinte from './../assets/vinte.jpg'
import cinquenta from './../assets/cinquenta.jpg'
import cem from './../assets/cem.jpg'
import duzentos from './../assets/duzentos.jpg'
import CardNotas, { NotasDisponiveisProps } from "@/components/CardNotas";

const Saque = () => {
  const router = useRouter()
  const toast = useToast()
  const [valor, setValor] = useState(0)
  const passos = [
    { title: 'Valor', description: 'Escolha o valor do saque' },
    { title: 'Notas', description: 'Escolha as notas para saque' },
    { title: 'Saque', description: 'Saque seu dinheiro' },
  ]
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: passos.length,
  })
  const [notasDisponiveisParaSaque, setNotasDisponiveisParaSaque] = useState<NotasDisponiveisProps[]>([])
  const [notasDisponiveisNoCaixa, setNotasDisponiveisNoCaixa] = useState<NotasDisponiveisProps>({
    dois: 0,
    cinco: 0,
    dez: 0,
    vinte: 0,
    cinquenta: 0,
    cem: 0,
    duzentos: 0,
  })

  const bearerToken = useRochaBankStore((state) => state.bearerToken)
  const numeroConta = useRochaBankStore((state) => state.numeroConta)

  const getNotasDisponiveis = async () => {
    const response = await api(bearerToken).get('/Notas/verificarNotasDoCaixa');

    setNotasDisponiveisNoCaixa(response.data.notasAtuais)
  }

  const VerificarNotasDisponiveisParaSaque = async () => {
    try {
      const response = await api(bearerToken).get('/Notas/notasDisponiveis', { params: { valor } })

      if (response.data.length == 0) {
        toast({
          title: 'Valor indisponível.',
          description: 'Quantidade indisponível no caixa ou não temos nota para suprir o valor desejado.',
          status: 'error',
          duration: 4000,
          position: 'top',
          isClosable: true,
        })
      }
      else {
        await api(bearerToken).get(`/ContaBancaria/verificarSaldo/${numeroConta}`, { params: { valor } })
        setNotasDisponiveisParaSaque(response.data)
        setActiveStep(1)
      }
    }
    catch (err: any) {
      toast({
        title: 'Não foi possível efetuar o saque.',
        description: err?.response?.data.message,
        status: 'error',
        duration: 4000,
        position: 'top',
        isClosable: true,
      })
    }
  }

  const RealizarSaque = async (notas: NotasDisponiveisProps) => {
    const payload = { numeroConta, valor }

    try {
      const response = await api(bearerToken).patch('/ContaBancaria/saque', payload)
      await api(bearerToken).patch('/Notas/removerNotas', notas)

      if (response.status == 200)
        setActiveStep(2)
    }
    catch (err: any) {
      toast({
        title: 'Não foi possível efetuar o saque.',
        description: err?.response?.data.message,
        status: 'error',
        duration: 4000,
        position: 'top',
        isClosable: true,
      })
    }
  }

  const handleAlteraValor = (newValue: number) => {
    setValor(newValue)
  }

  useEffect(() => {
    if (numeroConta == "")
      router.push('login')
    else
      getNotasDisponiveis()
  }, [numeroConta])

  return (
    <>
      <Layout>
        <Center>
          <Button size={'lg'} leftIcon={<MdOutlineArrowBackIos />} colorScheme='blue' onClick={() => {
            router.push('/')
          }}>
            Voltar
          </Button>
        </Center>
        <Center mt='10px'>
          <Heading>Quanto você quer sacar?</Heading>
        </Center>

        <Stepper index={activeStep} mx='200px' mt='20px'>
          {passos.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>

              <Box flexShrink='0'>
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>
                  {step.description}
                </StepDescription>
              </Box>

              <StepSeparator />
            </Step>
          ))}

        </Stepper>
        <Center mx='200px' mt='50px'>
          {activeStep == 0 ?
            <Box mb='50px'>
              <Center mx='200px' mt='50px'>
                <HStack gap={'150px'} >
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
                    <Button mt='60px' size='lg' colorScheme="blue" onClick={VerificarNotasDisponiveisParaSaque} rightIcon={<MdOutlineArrowForwardIos />}>Prosseguir</Button>
                    <Spacer />

                  </VStack>
                  <Spacer />
                  <VStack>
                    <Button disabled={!notasDisponiveisNoCaixa.dez} w='135px' size={'lg'} colorScheme='blue' onClick={() => setValor(10)}>
                      R$ 10
                    </Button>
                    <Button disabled={!notasDisponiveisNoCaixa.vinte} w='135px' size={'lg'} colorScheme='blue' onClick={() => handleAlteraValor(20)}>
                      R$ 20
                    </Button>
                    <Button disabled={!notasDisponiveisNoCaixa.cinquenta} w='135px' size={'lg'} colorScheme='blue' onClick={() => handleAlteraValor(50)}>
                      R$ 50
                    </Button>
                    <Button disabled={!notasDisponiveisNoCaixa.cem} w='135px' size={'lg'} colorScheme='blue' onClick={() => handleAlteraValor(100)}>
                      R$ 100
                    </Button>
                    <Button disabled={!notasDisponiveisNoCaixa.duzentos} w='135px' size={'lg'} colorScheme='blue' onClick={() => handleAlteraValor(200)}>
                      R$ 200
                    </Button>
                  </VStack>
                </HStack>
              </Center>
              <Divider my='5px' />
              <Box textAlign={'center'}>
                <Box>
                  <Text>Notas disponíveis neste caixa:</Text>
                </Box>


                <Box>
                  <HStack justify={'center'}>
                    {notasDisponiveisNoCaixa.duzentos > 0 && <Image width={100} alt="dois" src={duzentos} />}
                    {notasDisponiveisNoCaixa.cem > 0 && <Image width={100} alt="dois" src={cem} />}
                    {notasDisponiveisNoCaixa.cinquenta > 0 && <Image width={100} alt="dois" src={cinquenta} />}
                    {notasDisponiveisNoCaixa.vinte > 0 && <Image width={100} alt="dois" src={vinte} />}
                    {notasDisponiveisNoCaixa.dez > 0 && <Image width={100} alt="dois" src={dez} />}
                    {notasDisponiveisNoCaixa.cinco > 0 && <Image width={100} alt="dois" src={cinco} />}
                    {notasDisponiveisNoCaixa.dois > 0 && <Image width={100} alt="dois" src={dois} />}
                  </HStack>
                </Box>
              </Box>
            </Box>
            :
            activeStep == 1 ?
              <Box>
                <Center>
                  <Button variant={'outline'} size={'lg'} leftIcon={<MdOutlineArrowBackIos />} colorScheme='blue' onClick={() => {
                    setActiveStep(0)
                  }}>
                    Alterar o valor do saque
                  </Button></Center>

                <Center my='20px'>
                  <Heading textColor={'blue.600'} size={'md'}>Valor solicitado: R$ {valor}</Heading>
                </Center>
                <Center my='20px'>
                  <Heading textColor={'blue.600'} size={'sm'}>Escolha a oção de notas de sua preferência</Heading>
                </Center>
                <HStack>
                  {notasDisponiveisParaSaque.map((nota, index) =>
                    <Box key={index}>
                      <CardNotas nota={nota} />
                      <Center><Button colorScheme="blue" rightIcon={<MdOutlineArrowForwardIos />} onClick={() => { RealizarSaque(nota) }}>Quero estas notas</Button></Center>
                    </Box>
                  )}
                </HStack>
              </Box>

              :

              <Alert
                status='success'
                variant='subtle'
                flexDirection='column'
                alignItems='center'
                justifyContent='center'
                textAlign='center'
                height='200px'
              >
                <AlertIcon boxSize='40px' mr={0} />
                <AlertTitle mt={4} mb={1} fontSize='lg'>
                  Saque realizado com sucesso!
                </AlertTitle>
                <AlertDescription maxWidth='sm'>
                  Certifique-se de pegar a impressão do comprovante e retirar o seu cartão!
                </AlertDescription>
                <Button variant={'outline'} colorScheme="blue" onClick={() => { router.push('/') }}>Voltar para tela principal</Button>
              </Alert>
          }
        </Center>
        {notasDisponiveisParaSaque.map((nota) => nota.cem)}
      </Layout>
    </>
  );
}

export default Saque