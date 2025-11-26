"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Flex, Text } from "@/components/design-system";
import { IconButton, Textarea } from "@chakra-ui/react";
import { FiPlus, FiX, FiTrendingUp } from "react-icons/fi";

// Bet data structure
interface BetItem {
  id: string;
  name: string;
  legs: string[];
  odds: string;
}

// Mock recent bets (in a real app, this would come from state/storage)
const MOCK_RECENT_BETS: BetItem[] = [
  { id: "1", name: "2-leg parlay", legs: ["BOS", "TOR"], odds: "+150" },
  { id: "2", name: "3-leg parlay", legs: ["LAL", "GSW", "MIA"], odds: "+280" },
  { id: "3", name: "2-leg parlay", legs: ["NYK", "PHI"], odds: "+120" },
  { id: "4", name: "4-leg parlay", legs: ["DAL", "DEN", "MEM", "PHX"], odds: "+450" },
  { id: "5", name: "2-leg parlay", legs: ["CHI", "MIL"], odds: "+135" },
];

const LONG_PRESS_DURATION = 300; // ms
const BET_ITEM_HEIGHT = 72; // px
const MENU_WIDTH = 320; // px

export function ChatInput() {
  const [text, setText] = useState("");
  const [attachedBet, setAttachedBet] = useState<BetItem | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);
  
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Get last 5 bets (most recent at bottom)
  const recentBets = MOCK_RECENT_BETS.slice(-5).reverse();

  const handleLongPressStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    touchStartRef.current = { x: clientX, y: clientY, time: Date.now() };
    setIsLongPressing(true);
    
    longPressTimerRef.current = setTimeout(() => {
      setIsMenuOpen(true);
      setHighlightedIndex(recentBets.length - 1); // Bottom item (most recent)
    }, LONG_PRESS_DURATION);
  }, [recentBets.length]);

  const handleLongPressMove = useCallback((e: TouchEvent | MouseEvent) => {
    if (!isMenuOpen || !touchStartRef.current || !menuRef.current) return;

    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const startY = touchStartRef.current.y;
    const menuRect = menuRef.current.getBoundingClientRect();
    
    // Calculate relative position within menu
    const relativeToMenuTop = clientY - menuRect.top;
    const deltaY = startY - clientY; // Positive = moved up

    // Check if touch is within menu bounds
    const isWithinMenu = clientY >= menuRect.top && clientY <= menuRect.bottom;

    if (isWithinMenu) {
      // Calculate which bet item based on position
      // Bet items are displayed from top to bottom (oldest to newest)
      // Index 0 is oldest, index (length-1) is most recent
      let betIndex = Math.floor(relativeToMenuTop / BET_ITEM_HEIGHT);
      
      // Clamp index to valid range
      betIndex = Math.max(0, Math.min(recentBets.length - 1, betIndex));
      
      setHighlightedIndex(betIndex);
    } else if (deltaY > 0 && clientY < menuRect.top) {
      // Above menu, highlight top item (oldest)
      setHighlightedIndex(0);
    } else if (clientY > menuRect.bottom) {
      // Below menu, highlight bottom item (most recent)
      setHighlightedIndex(recentBets.length - 1);
    }
  }, [isMenuOpen, recentBets.length]);

  const handleLongPressEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    setIsLongPressing(false);

    if (isMenuOpen && highlightedIndex !== null) {
      // Attach the highlighted bet
      const betToAttach = recentBets[highlightedIndex];
      if (betToAttach) {
        setAttachedBet(betToAttach);
      }
    }

    setIsMenuOpen(false);
    setHighlightedIndex(null);
    touchStartRef.current = null;
  }, [isMenuOpen, highlightedIndex, recentBets]);

  // Handle touch events
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      handleLongPressMove(e);
    };

    const handleTouchEnd = () => {
      handleLongPressEnd();
    };

    if (isLongPressing || isMenuOpen) {
      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      document.addEventListener("touchend", handleTouchEnd);
      document.addEventListener("touchcancel", handleTouchEnd);
      
      // Disable body scrolling during gesture
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    }

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", handleTouchEnd);
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isLongPressing, isMenuOpen, handleLongPressMove, handleLongPressEnd]);

  // Handle mouse events for desktop testing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isLongPressing || isMenuOpen) {
        handleLongPressMove(e);
      }
    };

    const handleMouseUp = () => {
      handleLongPressEnd();
    };

    if (isLongPressing || isMenuOpen) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isLongPressing, isMenuOpen, handleLongPressMove, handleLongPressEnd]);

  const removeAttachedBet = () => {
    setAttachedBet(null);
  };

  // Get button position for menu placement
  const getMenuPosition = () => {
    if (!buttonRef.current) return { bottom: 0, right: 0 };
    const rect = buttonRef.current.getBoundingClientRect();
    const menuHeight = recentBets.length * BET_ITEM_HEIGHT + 80; // Approximate height including padding and hint
    return {
      bottom: window.innerHeight - rect.top + 12, // Above the button with gap
      right: Math.max(16, window.innerWidth - rect.right), // Align with button, min 16px from edge
    };
  };

  const menuPosition = isMenuOpen ? getMenuPosition() : null;

  return (
    <>
      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        bg="bg.primary"
        borderTopWidth="1px"
        borderColor="border.base"
        p={4}
        boxShadow="lg"
        zIndex={10}
      >
        {/* Attached bet display */}
        <AnimatePresence>
          {attachedBet && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              <Flex
                align="center"
                gap={3}
                p={3}
                bg="bg.secondary"
                borderRadius="md"
                mb={3}
              >
                <Box fontSize="xl" color="primary.500">
                  <FiTrendingUp />
                </Box>
                <Flex direction="column" flex={1} minWidth={0}>
                  <Text fontSize="sm" fontWeight="medium" truncate>
                    {attachedBet.name} ({attachedBet.legs.join(", ")})
                  </Text>
                  <Text fontSize="xs" color="text.secondary">
                    {attachedBet.odds}
                  </Text>
                </Flex>
                <IconButton
                  size="sm"
                  variant="ghost"
                  aria-label="Remove bet"
                  onClick={removeAttachedBet}
                >
                  <FiX />
                </IconButton>
              </Flex>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input row */}
        <Flex align="flex-end" gap={2}>
          <Textarea
            flex={1}
            value={text}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setText(e.target.value)
            }
            placeholder="Type a message..."
            minH="44px"
            maxH="120px"
            borderRadius="xl"
            borderColor="border.base"
            bg="bg.secondary"
            resize="none"
            rows={1}
            onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
            }}
            _focus={{
              outline: "none",
              borderColor: "primary.500",
            }}
          />

          <IconButton
            ref={buttonRef}
            size="lg"
            aria-label="Attach bet"
            colorPalette="primary"
            borderRadius="full"
            onTouchStart={handleLongPressStart}
            onMouseDown={handleLongPressStart}
            style={{
              touchAction: "none",
              cursor: "pointer",
            }}
          >
            <FiPlus />
          </IconButton>
        </Flex>
      </Box>

      {/* Contextual menu */}
      <AnimatePresence>
        {isMenuOpen && menuPosition && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                zIndex: 20,
              }}
            />

            {/* Menu */}
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              style={{
                position: "fixed",
                bottom: menuPosition.bottom + "px",
                right: menuPosition.right + "px",
                width: MENU_WIDTH + "px",
                maxWidth: "calc(100vw - 32px)",
                backgroundColor: "var(--chakra-colors-bg-primary)",
                borderRadius: "16px",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                zIndex: 21,
                overflow: "hidden",
              }}
            >
              <Box p={2}>
                {recentBets.map((bet, index) => {
                  const isHighlighted = highlightedIndex === index;
                  return (
                    <motion.div
                      key={bet.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        backgroundColor: isHighlighted
                          ? "var(--chakra-colors-primary-100)"
                          : "transparent",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                        delay: index * 0.03,
                      }}
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        minHeight: BET_ITEM_HEIGHT + "px",
                      }}
                    >
                      <Box
                        fontSize="xl"
                        color={isHighlighted ? "var(--chakra-colors-primary-600)" : "var(--chakra-colors-text-secondary)"}
                      >
                        <FiTrendingUp />
                      </Box>
                      <Flex direction="column" flex={1} minWidth={0}>
                        <Text
                          fontSize="sm"
                          fontWeight={isHighlighted ? "semibold" : "medium"}
                          color={
                            isHighlighted
                              ? "var(--chakra-colors-primary-900)"
                              : "var(--chakra-colors-text-primary)"
                          }
                        >
                          {bet.name} ({bet.legs.join(", ")})
                        </Text>
                        <Text fontSize="xs" color="text.secondary">
                          {bet.odds}
                        </Text>
                      </Flex>
                    </motion.div>
                  );
                })}
              </Box>

              {/* Hint text */}
              <Box
                px={3}
                py={2}
                borderTopWidth="1px"
                borderColor="border.base"
                bg="bg.secondary"
              >
                <Text fontSize="xs" color="text.secondary" textAlign="center">
                  Slide up/down to select bet, release to attach
                </Text>
              </Box>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

