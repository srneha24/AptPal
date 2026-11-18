import { useState } from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { useTheme } from '../context/ThemeContext'
import type { ThemeMode } from '../constants/Colors'
import { useAuth } from '../context/AuthContext'

export function HomeScreen() {
  const { colors, palette, themeMode, setThemeMode, activeTheme, isDark } = useTheme()
  const { user, logout } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const modes: ThemeMode[] = ['system', 'light', 'dark']

  async function handleSignOut() {
    setIsSigningOut(true)
    try {
      await logout()
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.cardShadow }]}>
        <Image source={require('../assets/logo.png')} accessibilityLabel="MyTempHome" style={styles.logo} resizeMode="contain" />
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Find and post rentals with ease.</Text>
        {user ? (
          <View style={styles.accountRow}>
            <Text style={[styles.accountText, { color: colors.textSecondary }]}>Signed in as {user.first_name}</Text>
            <Pressable onPress={() => { void handleSignOut() }} disabled={isSigningOut} accessibilityRole="button">
              <Text style={[styles.signOut, { color: colors.brandPrimary }]}>{isSigningOut ? 'Signing out…' : 'Sign out'}</Text>
            </Pressable>
          </View>
        ) : null}

        <View style={styles.paletteRow}>
          <View style={[styles.paletteDot, { backgroundColor: palette.primary.base }]} />
          <View style={[styles.paletteDot, { backgroundColor: palette.secondary.base }]} />
          <View style={[styles.paletteDot, { backgroundColor: palette.tertiary.base }]} />
          <View style={[styles.paletteDot, { backgroundColor: palette.quaternary.base }]} />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
          Theme: {themeMode} ({activeTheme})
        </Text>
        <View style={[styles.modeToggleContainer, { backgroundColor: colors.background, borderColor: colors.borderSubtle }]}>
          {modes.map((mode) => {
            const isSelected = themeMode === mode
            return (
              <Pressable
                key={mode}
                onPress={() => setThemeMode(mode)}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                style={[styles.modeButton, isSelected && { backgroundColor: colors.brandPrimary }]}
              >
                <Text style={[styles.modeButtonText, { color: isSelected ? colors.brandPrimaryContent : colors.textSecondary }]}>
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Text>
              </Pressable>
            )
          })}
        </View>

        <Pressable style={[styles.primaryButton, { backgroundColor: colors.accent }]} accessibilityRole="button">
          <Text style={styles.primaryButtonText}>Explore Rentals</Text>
        </Pressable>
      </View>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: {
    width: '100%',
    maxWidth: 390,
    borderRadius: 24,
    padding: 26,
    alignItems: 'center',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 3,
  },
  logo: { width: 116, height: 116, borderRadius: 20, marginBottom: 14 },
  subtitle: { fontSize: 15, textAlign: 'center', marginBottom: 8 },
  accountRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 18 },
  accountText: { fontSize: 13 },
  signOut: { fontSize: 13, fontWeight: '800', textDecorationLine: 'underline' },
  paletteRow: { flexDirection: 'row', gap: 8, marginTop: 12, marginBottom: 24 },
  paletteDot: { width: 18, height: 18, borderRadius: 9 },
  sectionTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  modeToggleContainer: { flexDirection: 'row', borderRadius: 12, borderWidth: 1, padding: 4, width: '100%', marginBottom: 24 },
  modeButton: { flex: 1, paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  modeButtonText: { fontSize: 13, fontWeight: '700' },
  primaryButton: { width: '100%', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
})
