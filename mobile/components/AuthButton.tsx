import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native'
import { useTheme } from '../context/ThemeContext'

export function AuthButton({ label, busy = false, onPress }: { label: string; busy?: boolean; onPress: () => void }) {
  const { colors } = useTheme()

  return (
    <Pressable
      onPress={onPress}
      disabled={busy}
      accessibilityRole="button"
      accessibilityState={{ disabled: busy, busy }}
      style={({ pressed }) => [styles.button, { backgroundColor: colors.brandPrimary, opacity: busy ? 0.65 : pressed ? 0.86 : 1 }]}
    >
      {busy
        ? <ActivityIndicator color={colors.brandPrimaryContent} />
        : <Text style={[styles.text, { color: colors.brandPrimaryContent }]}>{label}</Text>}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: { minHeight: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  text: { fontSize: 15, fontWeight: '800' },
})
