import { Box, Text } from "native-base"

const AppBar = () => {
    return (
        <Box p='6' bgColor='#0891b2' height='80px'>
            <Text
            fontSize={'xl'}
            fontWeight={'bold'}
            >
                Frequency Tracker
            </Text>
        </Box>
    )
}

export default AppBar