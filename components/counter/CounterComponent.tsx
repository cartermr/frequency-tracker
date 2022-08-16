import { Box, Text, Button, Input, Pressable, Icon, IconButton } from "native-base"
import { useState, ReactPropTypes, ComponentPropsWithoutRef, useRef, useEffect } from "react"
import { MaterialIcons } from '@expo/vector-icons'

const Counter = ({ defaultLabel, count, setCount, resetCount }: any) => {
    const [label, setLabel] = useState(defaultLabel)
    const [labelDisabled, setLabelDisabled] = useState<boolean>(true)

    const handleAdd = () => setCount(count + 1)
    const handelSubtract = () => count <= 0 ? setCount(0) : setCount(count - 1)
    const press = () => labelDisabled ? setLabelDisabled(false) : setLabelDisabled(true)
    const handleLabel = (textValue: string) => setLabel(textValue)

    return (
        <Box
            width='50%'
            display='flex'
            flexDirection='column'
            alignItems='center'
            mt='56px'
        >
            <Pressable onLongPress={press}>
                <Input
                    mb='16px'
                    fontSize='2xl'
                    fontWeight='bold'
                    color='black'
                    textAlign='center'
                    width='90%'
                    variant='unstyled'
                    isDisabled={labelDisabled}
                    value={label}
                    onChangeText={handleLabel}
                    onSubmitEditing={press}
                    InputRightElement={
                        <IconButton onPress={press} w='4' p='0' m='0' color='black' _icon={{ as: MaterialIcons, name: 'edit'}} />
                    }
                />
            </Pressable>
            <Text
                textAlign="center"
                fontSize='4xl'
            >
                {count}
            </Text>
            <Button
                onPress={handleAdd}
                width='80px'
                height='80px'
                m='16px'
            >
                <Icon as={MaterialIcons} name='add' color='black' size='xl' />
            </Button>
            <Button
                onPress={handelSubtract}
                width='80px'
                height='80px'
                m='16px'
            >
                <Icon as={MaterialIcons} name='remove' color='black' size='xl' />
            </Button>
        </Box>
    )
}

export default Counter