import { api } from "@/api/api";
import Layout from "@/components/Layout";
import useRochaBankStore from "@/store/store";
import { Button, Center, Heading } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdOutlineArrowForwardIos } from "react-icons/md";

const Saldo = () => {
  const router = useRouter()
  const [saldo, setSaldo] = useState(0)
  const bearerToken = useRochaBankStore((state) => state.bearerToken)
  const numeroConta = useRochaBankStore((state) => state.numeroConta)

  const getSaldo = async () => {
    const response = await api(bearerToken).get(`ContaBancaria/verificarSaldo/${numeroConta}`, { params: { valor: 0 } })

    if (response.status == 200)
      setSaldo(response.data.conta.saldo)
  }

  useEffect(() => {
    if (numeroConta == "")
      router.push('login')
    else
      getSaldo()
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
          <Heading>Seu saldo é de: R$ {saldo}</Heading>
        </Center>
      </Layout>
    </>
  );
}

export default Saldo