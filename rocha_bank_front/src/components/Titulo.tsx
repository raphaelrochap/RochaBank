import { Flex, Heading } from '@chakra-ui/react'

export const Titulo = ({ title }: { title: string }) => (
  <Flex
    justifyContent="left"
    alignItems="center"
    bgGradient="linear(to-l, white, white)"
    bgClip="text"
    ml='15px'
  >
    <Heading fontSize="6xl" fontWeight={'black'}>{title}</Heading>
  </Flex>
)

Titulo.default = {
  title: 'with-typescript-chakra-ui',
}