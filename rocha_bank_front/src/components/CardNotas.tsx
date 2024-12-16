import { Box, Center, HStack, Text, VStack } from "@chakra-ui/react"
import dois from './../assets/dois.jpg'
import cinco from './../assets/cinco.jpg'
import dez from './../assets/dez.jpg'
import vinte from './../assets/vinte.jpg'
import cinquenta from './../assets/cinquenta.jpg'
import cem from './../assets/cem.jpg'
import duzentos from './../assets/duzentos.jpg'
import Image from "next/image"

interface NotasDisponiveisProps {
  dois: number,
  cinco: number,
  dez: number,
  vinte: number,
  cinquenta: number,
  cem: number,
  duzentos: number,
}

interface CardNotasProps {
  nota: NotasDisponiveisProps
}

const CardNotas = ({ nota }: CardNotasProps) => {
  return (
    <>
      <Box m={'10px'} w='300px' bgColor={'blue.100'} borderRadius={'10px'} p='10px'>
        <Center>
          <VStack align={'end'}>
            {nota.duzentos > 0 && <HStack><Image width={110} alt="dois" src={duzentos} /> <Text>{nota.duzentos}x</Text></HStack>}
            {nota.cem > 0 && <HStack><Image width={100} alt="dois" src={cem} /> <Text>{nota.cem}x</Text></HStack>}
            {nota.cinquenta > 0 && <HStack><Image width={90} alt="dois" src={cinquenta} /> <Text>{nota.cinquenta}x</Text></HStack>}
            {nota.vinte > 0 && <HStack><Image width={80} alt="dois" src={vinte} /> <Text>{nota.vinte}x</Text></HStack>}
            {nota.dez > 0 && <HStack><Image width={75} alt="dois" src={dez} /> <Text>{nota.dez}x</Text></HStack>}
            {nota.cinco > 0 && <HStack><Image width={70} alt="dois" src={cinco} /> <Text>{nota.cinco}x</Text></HStack>}
            {nota.dois > 0 && <HStack><Image width={60} alt="dois" src={dois} /> <Text>{nota.dois}x</Text></HStack>}
          </VStack></Center>
      </Box>
    </>
  )
}

export default CardNotas
export type { NotasDisponiveisProps }