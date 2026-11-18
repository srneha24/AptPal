import { StyleSheet, Text, View } from 'react-native'
import { useTheme } from '../context/ThemeContext'

export function AuthNotice({ message, tone = 'error' }: { message: string; tone?: 'error' | 'success' }) {
  const { colors } = useTheme()
  const success = tone === 'success'

  return (
    <View
      accessibilityRole="alert"
      style={[
        styles.container,
        success
          ? { backgroundColor: '#EAF6EF', borderColor: '#A8D5B5' }
          : { backgroundColor: colors.tint, borderColor: colors.brandTertiary },
      ]}
    >
      <Text style={[styles.message, { color: success ? '#185B31' : colors.textPrimary }]}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 13, paddingVertical: 11 },
  message: { fontSize: 13, lineHeight: 19 },
})
