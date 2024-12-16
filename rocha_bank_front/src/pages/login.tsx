import Layout from "@/components/Layout"
import { Button, Center, FormControl, FormLabel, Input, useToast } from "@chakra-ui/react"
import { useRouter } from 'next/navigation'
import { SyntheticEvent, useState } from 'react';
import { api } from './../api/api'
import useRochaBankStore from "@/store/store";

const Login = () => {
  const router = useRouter()
  const toast = useToast()
  const [numeroConta, setNumeroConta] = useState('')
  const [senha, setSenha] = useState('')
  const setBearerToken = useRochaBankStore((state) => state.setBearerToken)
  const setNumeroContaState = useRochaBankStore((state) => state.setNumeroConta)

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()

    const response = await postLogin(numeroConta, senha)

    if (response && response.status == 200) {
      setBearerToken(response.data.token)
      setNumeroContaState(response.data.user.numeroConta)
      toast({
        title: 'Seja bem vindo ao RochaBank :D',
        status: 'success',
        duration: 4000,
        position: 'top',
        isClosable: true,
      })

      router.push('/')
    }
  }

  const postLogin = async (numeroConta: string, senha: string) => {
    const payload = { numeroConta, senha }

    try {
      return await api('').post('/Auth/login', payload)
    }
    catch (err: any) {
      toast({
        title: 'Ops... :/',
        description: err?.response?.data.message,
        status: 'error',
        duration: 4000,
        position: 'top',
        isClosable: true,
      })
    }
  }

  return (
    <>
      <Layout>
        <Center>
          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel textAlign={'center'}>Número da conta</FormLabel>
              <Input value={numeroConta} onChange={(e) => { setNumeroConta(e.target.value) }} size={'lg'} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel textAlign={'center'}>Senha</FormLabel>
              <Input value={senha} onChange={(e) => { setSenha(e.target.value) }} type="password" size={'lg'} />
            </FormControl>

            <Center pt='15px'>
              <Button type="submit">Entrar</Button>
            </Center>
          </form>
        </Center>
      </Layout>
    </>
  )
}

export default Login
