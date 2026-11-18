import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ThemeMode } from './constants/Colors';

function MainScreen() {
  const { colors, palette, themeMode, setThemeMode, isDark, activeTheme } = useTheme();

  const modes: ThemeMode[] = ['system', 'light', 'dark'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={[styles.logoBadge, { backgroundColor: colors.tint }]}>
          <Text style={[styles.logoText, { color: colors.brandPrimary }]}>AP</Text>
        </View>

        <Text style={[styles.title, { color: colors.textPrimary }]}>MyTempHome</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Find and post rentals with ease.
        </Text>

        {/* Color Palette Indicators */}
        <View style={styles.paletteRow}>
          <View style={[styles.paletteDot, { backgroundColor: palette.primary.base }]} />
          <View style={[styles.paletteDot, { backgroundColor: palette.secondary.base }]} />
          <View style={[styles.paletteDot, { backgroundColor: palette.tertiary.base }]} />
          <View style={[styles.paletteDot, { backgroundColor: palette.quaternary.base }]} />
        </View>

        {/* Theme Mode Selector */}
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
          Theme: {themeMode} ({activeTheme})
        </Text>
        <View style={[styles.modeToggleContainer, { backgroundColor: colors.background, borderColor: colors.borderSubtle }]}>
          {modes.map((mode) => {
            const isSelected = themeMode === mode;
            return (
              <TouchableOpacity
                key={mode}
                onPress={() => setThemeMode(mode)}
                style={[
                  styles.modeButton,
                  isSelected && { backgroundColor: colors.brandPrimary },
                ]}
              >
                <Text
                  style={[
                    styles.modeButtonText,
                    { color: isSelected ? colors.brandPrimaryContent : colors.textSecondary },
                  ]}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: colors.accent }]}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Explore Rentals</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainScreen />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '800',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20,
  },
  paletteRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  paletteDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  modeToggleContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    width: '100%',
    marginBottom: 24,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  modeButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  primaryButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
