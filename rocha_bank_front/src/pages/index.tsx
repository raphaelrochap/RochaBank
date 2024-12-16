import Layout from "@/components/Layout";
import useRochaBankStore from "@/store/store";
import { Button, Center, HStack, Spacer, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MdOutlineArrowForwardIos, MdOutlineArrowBackIos } from "react-icons/md";

const Home = () => {
  const router = useRouter()
  const numeroConta = useRochaBankStore((state) => state.numeroConta)

  useEffect(() => {
    if(!numeroConta)
      router.push('login')
  }, [numeroConta])

  return (
    <>
      <Layout>
        <Center mx='200px' mt='50px'>
          <HStack w={'100vw'}>
            <VStack>
              <Button w='150px' size={'lg'} leftIcon={<MdOutlineArrowBackIos />} colorScheme='blue' onClick={() => {
                router.push('/deposito')
              }}>
                Depósito
              </Button>
              <Button w='150px' size={'lg'} leftIcon={<MdOutlineArrowBackIos />} colorScheme='blue' onClick={() => {
                router.push('/saldo')
              }}>
                Saldo
              </Button>
            </VStack>
            <Spacer />
            <Button w='150px' size={'lg'} rightIcon={<MdOutlineArrowForwardIos />} colorScheme='blue' onClick={() => {
              router.push('/saque')
            }}>
              Saque
            </Button>
          </HStack>
        </Center>
      </Layout>
    </>
  );
}

export default Home