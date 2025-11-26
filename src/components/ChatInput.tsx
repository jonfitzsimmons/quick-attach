"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Flex, Text, IconButton } from "@chakra-ui/react";
import { FiPlus, FiX, FiFile, FiImage, FiPaperclip } from "react-icons/fi";

// Mock file data structure
interface FileItem {
  id: string;
  name: string;
  type: "image" | "document" | "other";
  size: string;
}

// Mock recent files (in a real app, this would come from state/storage)
const MOCK_RECENT_FILES: FileItem[] = [
  { id: "1", name: "photo.jpg", type: "image", size: "2.4 MB" },
  { id: "2", name: "document.pdf", type: "document", size: "1.2 MB" },
  { id: "3", name: "presentation.pptx", type: "document", size: "5.1 MB" },
  { id: "4", name: "screenshot.png", type: "image", size: "800 KB" },
  { id: "5", name: "notes.txt", type: "document", size: "45 KB" },
];

const LONG_PRESS_DURATION = 300; // ms
const FILE_ITEM_HEIGHT = 64; // px
const MENU_WIDTH = 280; // px

export function ChatInput() {
  const [text, setText] = useState("");
  const [attachedFile, setAttachedFile] = useState<FileItem | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);
  
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Get last 5 files (most recent at bottom)
  const recentFiles = MOCK_RECENT_FILES.slice(-5).reverse();

  const handleLongPressStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    touchStartRef.current = { x: clientX, y: clientY, time: Date.now() };
    setIsLongPressing(true);
    
    longPressTimerRef.current = setTimeout(() => {
      setIsMenuOpen(true);
      setHighlightedIndex(recentFiles.length - 1); // Bottom item (most recent)
    }, LONG_PRESS_DURATION);
  }, [recentFiles.length]);

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
      // Calculate which file item based on position
      // File items are displayed from top to bottom (oldest to newest)
      // Index 0 is oldest, index (length-1) is most recent
      let fileIndex = Math.floor(relativeToMenuTop / FILE_ITEM_HEIGHT);
      
      // Clamp index to valid range
      fileIndex = Math.max(0, Math.min(recentFiles.length - 1, fileIndex));
      
      setHighlightedIndex(fileIndex);
    } else if (deltaY > 0 && clientY < menuRect.top) {
      // Above menu, highlight top item (oldest)
      setHighlightedIndex(0);
    } else if (clientY > menuRect.bottom) {
      // Below menu, highlight bottom item (most recent)
      setHighlightedIndex(recentFiles.length - 1);
    }
  }, [isMenuOpen, recentFiles.length]);

  const handleLongPressEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    setIsLongPressing(false);

    if (isMenuOpen && highlightedIndex !== null) {
      // Attach the highlighted file
      const fileToAttach = recentFiles[highlightedIndex];
      if (fileToAttach) {
        setAttachedFile(fileToAttach);
      }
    }

    setIsMenuOpen(false);
    setHighlightedIndex(null);
    touchStartRef.current = null;
  }, [isMenuOpen, highlightedIndex, recentFiles]);

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

  const getFileIcon = (type: FileItem["type"]) => {
    switch (type) {
      case "image":
        return <FiImage />;
      case "document":
        return <FiFile />;
      default:
        return <FiPaperclip />;
    }
  };

  const removeAttachedFile = () => {
    setAttachedFile(null);
  };

  // Get button position for menu placement
  const getMenuPosition = () => {
    if (!buttonRef.current) return { bottom: 0, right: 0 };
    const rect = buttonRef.current.getBoundingClientRect();
    const menuHeight = recentFiles.length * FILE_ITEM_HEIGHT + 80; // Approximate height including padding and hint
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
        {/* Attached file display */}
        <AnimatePresence>
          {attachedFile && (
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
                  {getFileIcon(attachedFile.type)}
                </Box>
                <Flex direction="column" flex={1} minWidth={0}>
                        <Text fontSize="sm" fontWeight="medium" truncate>
                          {attachedFile.name}
                        </Text>
                  <Text fontSize="xs" color="text.secondary">
                    {attachedFile.size}
                  </Text>
                </Flex>
                <IconButton
                  size="sm"
                  variant="ghost"
                  aria-label="Remove file"
                  onClick={removeAttachedFile}
                >
                  <FiX />
                </IconButton>
              </Flex>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input row */}
        <Flex align="flex-end" gap={2}>
          <Box
            flex={1}
            as="textarea"
            value={text}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setText(e.target.value)
            }
            placeholder="Type a message..."
            minH="44px"
            maxH="120px"
            p={3}
            borderRadius="xl"
            borderWidth="1px"
            borderColor="border.base"
            bg="bg.secondary"
            fontSize="md"
            resize="none"
            rows={1}
            onInput={(e: React.FormEvent<HTMLDivElement>) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
            }}
            // @ts-ignore - Box as textarea needs special typing
            __css={{
              fontFamily: "inherit",
              lineHeight: "inherit",
            }}
          />

          <IconButton
            ref={buttonRef}
            size="lg"
            aria-label="Attach file"
            colorPalette="primary"
            isRound
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
                {recentFiles.map((file, index) => {
                  const isHighlighted = highlightedIndex === index;
                  return (
                    <motion.div
                      key={file.id}
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
                        minHeight: FILE_ITEM_HEIGHT + "px",
                      }}
                    >
                      <Box
                        fontSize="xl"
                        color={isHighlighted ? "var(--chakra-colors-primary-600)" : "var(--chakra-colors-text-secondary)"}
                      >
                        {getFileIcon(file.type)}
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
                          truncate
                        >
                          {file.name}
                        </Text>
                        <Text fontSize="xs" color="text.secondary">
                          {file.size}
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
                  Slide up/down to select, release to attach
                </Text>
              </Box>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

