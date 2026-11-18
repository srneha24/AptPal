import { Redirect, router } from 'expo-router'
import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { AuthButton } from '../../../components/AuthButton'
import { AuthNotice } from '../../../components/AuthNotice'
import { AuthScreen } from '../../../components/AuthScreen'
import { AuthTextField } from '../../../components/AuthTextField'
import { LoadingScreen } from '../../../components/LoadingScreen'
import { useAuth } from '../../../context/AuthContext'
import { ApiError } from '../../../services/api'
import { useTheme } from '../../../context/ThemeContext'

export default function LoginRoute() {
  const { colors } = useTheme()
  const { isLoading, user, login, loginNotice, clearLoginNotice } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isLoading) return <LoadingScreen />
  if (user) return <Redirect href="/" />

  async function handleLogin() {
    setError('')
    setFieldErrors({})
    clearLoginNotice()

    if (!email.trim() || !password) {
      setFieldErrors({
        ...(!email.trim() ? { email: 'Enter your email address.' } : {}),
        ...(!password ? { password: 'Enter your password.' } : {}),
      })
      return
    }

    setIsSubmitting(true)
    try {
      await login(email.trim(), password)
      router.replace('/')
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        setError(requestError.status === 403 && requestError.message.toLowerCase().includes('verify')
          ? `${requestError.message} Open the verification link in your email using a web browser, then return here.`
          : requestError.message)
        setFieldErrors(requestError.fieldErrors)
      } else {
        setError('We could not log you in. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthScreen
      title="Log in to AptPal"
      subtitle="Find your next place and keep your rental plans in one spot."
      footer={(
        <View style={styles.footerRow}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>New to AptPal?</Text>
          <Pressable onPress={() => router.push('/signup')} accessibilityRole="link">
            <Text style={[styles.link, { color: colors.brandPrimary }]}>Create an account</Text>
          </Pressable>
        </View>
      )}
    >
      <View style={styles.form}>
        {loginNotice ? <AuthNotice message={loginNotice} tone="success" /> : null}
        {error ? <AuthNotice message={error} /> : null}
        <AuthTextField
          label="Email address"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          error={fieldErrors.email}
        />
        <AuthTextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={() => { void handleLogin() }}
          error={fieldErrors.password}
        />
        <AuthButton label="Log in" busy={isSubmitting} onPress={() => { void handleLogin() }} />
      </View>
    </AuthScreen>
  )
}

const styles = StyleSheet.create({
  form: { gap: 17 },
  footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  footerText: { fontSize: 14 },
  link: { fontSize: 14, fontWeight: '800' },
})
