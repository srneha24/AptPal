import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import type { ReactNode } from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../context/ThemeContext'

interface AuthScreenProps {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthScreen({ title, subtitle, children, footer }: AuthScreenProps) {
  const { colors, isDark } = useTheme()

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Image source={require('../assets/logo.png')} accessibilityLabel="AptPal" style={styles.logo} resizeMode="contain" />
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.cardShadow }]}>
              <Text style={[styles.eyebrow, { color: colors.brandPrimary }]}>APTPAL</Text>
              <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
              {children}
            </View>
            {footer && <View style={styles.footer}>{footer}</View>}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 22, paddingVertical: 26 },
  content: { width: '100%', maxWidth: 440, alignSelf: 'center' },
  logo: { width: 92, height: 92, alignSelf: 'center', marginBottom: 18, borderRadius: 18 },
  card: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 24,
    padding: 24,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 3,
  },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 2, marginBottom: 7 },
  title: { fontSize: 27, lineHeight: 33, fontWeight: '800', letterSpacing: -0.4 },
  subtitle: { fontSize: 14, lineHeight: 21, marginTop: 8, marginBottom: 24 },
  footer: { marginTop: 20, alignItems: 'center' },
})
