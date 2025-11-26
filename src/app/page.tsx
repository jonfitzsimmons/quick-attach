"use client";

import { Box, Flex, VStack, Heading, Text } from "@/components/design-system";
import { ChatInput } from "@/components/ChatInput";

export default function Home() {
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      bg="bg.primary"
      position="relative"
      overflow="hidden"
    >
      {/* Header */}
      <Box
        width="100%"
        p={4}
        borderBottomWidth="1px"
        borderColor="border.base"
        bg="bg.primary"
        position="relative"
        zIndex={5}
      >
        <Heading size="lg" textAlign="center">
          Sports Bet Chat
        </Heading>
        <Text fontSize="sm" color="text.secondary" textAlign="center" mt={1}>
          Long press + button to attach recent bets
        </Text>
      </Box>

      {/* Content area (scrollable) */}
      <Box
        flex={1}
        overflowY="auto"
        px={4}
        py={8}
        pb={32}
        css={{
          "&::-webkit-scrollbar": {
            width: "0px",
          },
        }}
      >
        <VStack gap={4} align="stretch">
          {/* Example messages */}
          <Box
            p={4}
            bg="bg.secondary"
            borderRadius="lg"
            maxWidth="80%"
            alignSelf="flex-start"
          >
            <Text fontSize="sm" color="text.secondary" mb={1}>
              System
            </Text>
            <Text>
              Welcome! Try long pressing the + button to see your recent bets.
              You can slide up and down to select different bets.
            </Text>
          </Box>

          <Box
            p={4}
            bg="primary.600"
            color="white"
            borderRadius="lg"
            maxWidth="80%"
            alignSelf="flex-end"
          >
            <Text fontSize="sm" color="whiteAlpha.700" mb={1}>
              You
            </Text>
            <Text color="white">
              This is a sports betting chat. Share your bets with friends!
            </Text>
          </Box>

          <Box
            p={4}
            bg="bg.secondary"
            borderRadius="lg"
            maxWidth="80%"
            alignSelf="flex-start"
          >
            <Text fontSize="sm" color="text.secondary" mb={1}>
              System
            </Text>
            <Text>
              Instructions:
              <br />• Long press the + button
              <br />• Release to attach most recent bet
              <br />• Or slide up/down to select and release
              <br />• Tap X to remove attached bet
            </Text>
          </Box>
        </VStack>
      </Box>

      {/* Chat input (fixed at bottom) */}
      <ChatInput />
    </Box>
  );
}
