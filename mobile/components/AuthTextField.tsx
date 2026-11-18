import { useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import type { TextInputProps } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../context/ThemeContext'

interface AuthTextFieldProps extends Omit<TextInputProps, 'style'> {
  label: string
  error?: string
  hint?: string
}

export function AuthTextField({ label, error, hint, secureTextEntry = false, ...inputProps }: AuthTextFieldProps) {
  const { colors } = useTheme()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <View style={styles.group}>
      <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text>
      <View style={[styles.inputShell, { backgroundColor: colors.background, borderColor: error ? colors.brandTertiary : colors.border }]}>
        <TextInput
          {...inputProps}
          secureTextEntry={secureTextEntry && !showPassword}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.brandPrimary}
          accessibilityLabel={label}
          style={[styles.input, { color: colors.textPrimary }, secureTextEntry && styles.passwordInput]}
        />
        {secureTextEntry && (
          <Pressable
            onPress={() => setShowPassword((visible) => !visible)}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
            accessibilityState={{ selected: showPassword }}
            hitSlop={10}
            style={styles.eyeButton}
          >
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
          </Pressable>
        )}
      </View>
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      {hint ? <Text style={[styles.hint, { color: colors.textMuted }]}>{hint}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  group: { gap: 7 },
  label: { fontSize: 13, fontWeight: '700' },
  inputShell: { minHeight: 50, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 13 },
  input: { flex: 1, minHeight: 50, paddingHorizontal: 14, fontSize: 15 },
  passwordInput: { paddingRight: 4 },
  eyeButton: { width: 44, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  error: { color: '#C62828', fontSize: 12, lineHeight: 17 },
  hint: { fontSize: 12, lineHeight: 17 },
})
