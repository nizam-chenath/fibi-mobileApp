// components/ChatbotWidget.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
  PanResponder,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LetoIllustration from '../assets/leto/leto-white.svg';
import LetoIllustrationColor from '../assets/leto/Leto.svg';
import LinearGradient from 'react-native-linear-gradient';
import useTheme from '../hooks/useTheme.jsx';
import useTenant from '../hooks/useTenant.jsx';
import useAuth from '../hooks/useAuth.jsx';
import { chatbotService } from '../services/chatbotService.jsx';

const HEADER_GRADIENT = ['#18C391', '#338AAA'];
const DEFAULT_WELCOME_MESSAGE =
  "Hi, I'm Leto, your AI assistant. How can I help you today?";

const ChatbotWidget = () => {
  const theme = useTheme();
  const { tenantConfig } = useTenant();
  const { user } = useAuth();
  const { width, height } = useWindowDimensions();
  const maxWidgetHeight = Math.min(height * 0.75, 640);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: DEFAULT_WELCOME_MESSAGE,
    },
  ]);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef(null);
  
  // Typing animation refs
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  const fabSize = 68;
  const defaultX = width - fabSize - 24;
  const defaultY = height - fabSize - 48;
  const pan = useRef(new Animated.ValueXY({ x: defaultX, y: defaultY })).current;
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          pan.setOffset({
            x: pan.x.__getValue(),
            y: pan.y.__getValue(),
          });
          pan.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: () => {
          pan.flattenOffset();
        },
      }),
    [pan],
  );

  const userFullName = [user?.firstName, user?.lastName].filter(Boolean).join(', ') || 'there';
  const suggestedPrompts = useMemo(
    () => [
      'How do I submit a proposal in FIBI?',
      'Where can I find the user manual?',
      'What are the steps to revise a budget?',
    ],
    [],
  );
  const computedMaxHeight = useMemo(
    () => (isExpanded ? Math.min(height * 0.9, 720) : maxWidgetHeight),
    [height, isExpanded, maxWidgetHeight],
  );

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const appendMessage = useCallback((newMessage) => {
    setMessages((prev) => [...prev, newMessage]);
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  const resolvedPersonId = user?.personId || user?.id || '10000000001';

  // WhatsApp-style typing animation
  useEffect(() => {
    if (!loading) {
      Animated.parallel([
        Animated.timing(dot1Anim, { toValue: 0, duration: 0, useNativeDriver: true }),
        Animated.timing(dot2Anim, { toValue: 0, duration: 0, useNativeDriver: true }),
        Animated.timing(dot3Anim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]).start();
      return;
    }

    const animateDot = (dotAnim, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dotAnim, {
            toValue: -8,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dotAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
    };

    Animated.parallel([
      animateDot(dot1Anim, 0),
      animateDot(dot2Anim, 150),
      animateDot(dot3Anim, 300),
    ]).start();
  }, [loading, dot1Anim, dot2Anim, dot3Anim]);

  const sendPrompt = useCallback(
    async (promptText) => {
      const trimmed = promptText.trim();
      if (!trimmed || loading) {
        return;
      }

      appendMessage({
        id: `user-${Date.now()}`,
        sender: 'user',
        text: trimmed,
      });

      try {
        setLoading(true);
        const response = await chatbotService.sendMessage({
          prompt: trimmed,
          sessionId,
          personId: resolvedPersonId,
        });
        if (response?.sessionId) {
          setSessionId(response.sessionId);
        }

        const aiText = response?.aiOutput?.trim() || 'No response received.';
        appendMessage({
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiText,
        });
      } catch (error) {
        appendMessage({
          id: `error-${Date.now()}`,
          sender: 'ai',
          text: 'Sorry, I was unable to reach the chatbot service. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    },
    [appendMessage, loading, resolvedPersonId, sessionId],
  );

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) {
      return;
    }

    setInput('');
    sendPrompt(trimmed);
  }, [input, loading, sendPrompt]);

  useEffect(() => {
    if (!showGuide) {
      return;
    }
    setMessages((prev) => {
      if (!prev.some((msg) => msg.id === 'welcome')) {
        return prev;
      }
      return prev.filter((msg) => msg.id !== 'welcome');
    });
  }, [showGuide]);

  const handleSuggestionPress = useCallback(
    async (promptText) => {
      if (loading) {
        return;
      }
      setShowGuide(false);
      await sendPrompt(promptText);
    },
    [loading, sendPrompt],
  );

  const styles = useMemo(() => createStyles(theme), [theme]);
  const universityName = tenantConfig?.branding?.universityName || 'your university';

  if (!isOpen) {
    return (
      <Animated.View
        style={[styles.fabWrapper, { transform: [{ translateX: pan.x }, { translateY: pan.y }] }]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity activeOpacity={0.9} onPress={handleToggle}>
          <LinearGradient
            colors={['#18C391', '#338AAA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fabGradient}
          >
            <LetoIllustration width={40} height={40} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <>
      <View style={styles.overlay} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.widgetContainer}
      >
        <View style={[styles.widget, { maxHeight: computedMaxHeight }]}>
          <LinearGradient colors={HEADER_GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
            <View style={styles.headerLeft}>
              <LetoIllustration width={46} height={46} />
              <View style={styles.headerTextWrapper}>
                <Text style={styles.headerTitle}>Ask Leto</Text>
              </View>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity
                style={styles.headerIconButton}
                onPress={() => setShowGuide((prev) => !prev)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Icon name="chatbubble-ellipses-outline" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerIconButton}
                onPress={handleToggle}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Icon name="close-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
          {showGuide && (
            <>
              <View style={styles.heroSection}>
                <LetoIllustrationColor width={58} height={58} />
                <Text style={styles.heroGreeting}>Hi, {userFullName}!</Text>
                <Text style={styles.heroSubtitle}>How can I help you today?</Text>
              </View>
              <View style={styles.suggestionList}>
                {suggestedPrompts.map((prompt) => (
                  <TouchableOpacity
                    key={prompt}
                    style={styles.suggestionButton}
                    activeOpacity={0.9}
                    onPress={() => handleSuggestionPress(prompt)}
                  >
                    <Text style={styles.suggestionText}>{prompt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          <ScrollView
            style={styles.messages}
            contentContainerStyle={styles.messageContent}
            ref={scrollRef}
          >
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageBubble,
                  msg.sender === 'user' ? styles.userBubble : styles.aiBubble,
                ]}
              >
                {msg.sender === 'ai' && (
                  <View style={styles.aiMetaRow}>
                    <LetoIllustrationColor width={18} height={18} />
                    <Text style={styles.aiBadge}>AI Generated</Text>
                  </View>
                )}
                <Text
                  style={[
                    styles.messageText,
                    msg.sender === 'user' ? styles.userText : styles.aiText,
                  ]}
                >
                  {msg.text}
                </Text>
              </View>
            ))}
            {loading && (
              <View style={[styles.messageBubble, styles.aiBubble, styles.typingBubble]}>
                <View style={styles.typingContainer}>
                  <Animated.View
                    style={[
                      styles.typingDot,
                      { transform: [{ translateY: dot1Anim }] },
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.typingDot,
                      { transform: [{ translateY: dot2Anim }] },
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.typingDot,
                      { transform: [{ translateY: dot3Anim }] },
                    ]}
                  />
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.inputWrapper}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Ask me anything"
                placeholderTextColor={theme.colors.textSecondary}
                value={input}
                onChangeText={setInput}
                editable={!loading}
                multiline
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!input.trim() || loading) && styles.sendButtonDisabled,
                ]}
                onPress={handleSend}
                disabled={!input.trim() || loading}
              >
                <Icon name="send" size={16} color={theme.colors.secondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.footerRow}>
              <Text style={styles.footerCount}>1000 characters remaining</Text>
              <Text style={styles.footerDisclaimer}>
                Generated with AI assistance. Always check for accuracy and completeness.
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
    fabWrapper: {
      position: 'absolute',
      top: -14,
      left: 28,
      zIndex: 1000,
    },
    fabGradient: {
      width: 50,
      height: 50,
      borderRadius: 34,
      justifyContent: 'center',
      alignItems: 'center',
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.35)',
      zIndex: 999,
    },
    widgetContainer: {
      position: 'absolute',
      bottom: 24,
      left: 16,
      right: 16,
      zIndex: 1000,
    },
    widget: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      borderWidth: 1.5,
      borderColor: HEADER_GRADIENT[0],
      overflow: 'hidden',
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      flex: 1,
    },
    headerTextWrapper: {
      flexShrink: 1,
    },
    headerTitle: {
      color: 'white',
      fontSize: 18,
      fontWeight: '800',
    },
    headerIcons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      marginLeft: theme.spacing.md,
    },
    headerIconButton: {
      padding: theme.spacing.sm,
      justifyContent: 'center',
      alignItems: 'center',
    },
    heroSection: {
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xl,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    heroGreeting: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
    },
    heroSubtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    suggestionList: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    suggestionButton: {
      backgroundColor: theme.colors.surface,
      borderRadius: 999,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
    },
    suggestionText: {
      color: theme.colors.text,
      fontSize: 13,
      fontWeight: '600',
      textAlign: 'center',
    },
    messageContent: {
      padding: theme.spacing.lg,
      gap: theme.spacing.sm,
      flexGrow: 1,
    },
    messageBubble: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      maxWidth: '85%',
    },
    userBubble: {
      alignSelf: 'flex-end',
      backgroundColor: theme.colors.primary,
    },
    aiBubble: {
      alignSelf: 'flex-start',
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    typingBubble: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    aiMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginBottom: 8,
    },
    aiBadge: {
      fontSize: 10,
      color: theme.colors.textSecondary,
      fontWeight: '600',
    },
    userText: {
      color: theme.colors.secondary,
    },
    aiText: {
      color: theme.colors.text,
    },
    messageText: {
      fontSize: 14,
      lineHeight: 20,
    },
    typingContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'center',
      gap: 6,
      height: 15,
    },
    typingDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: theme.colors.primary,
    },
    inputWrapper: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.lg,
      paddingTop: theme.spacing.sm,
      gap: theme.spacing.sm,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.surface,
    },
    input: {
      flex: 1,
      minHeight: 40,
      maxHeight: 100,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      color: theme.colors.text,
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#1f2329',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: theme.spacing.sm,
    },
    sendButtonDisabled: {
      opacity: 0.4,
    },
    footerRow: {
      alignItems: 'center',
      gap: theme.spacing.xs / 2,
    },
    footerCount: {
      fontSize: 11,
      color: theme.colors.textSecondary,
      alignSelf: 'flex-end',
      marginRight: theme.spacing.sm,
    },
    footerDisclaimer: {
      fontSize: 11,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

export default ChatbotWidget;