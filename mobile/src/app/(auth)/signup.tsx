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

export default function SignupRoute() {
  const { colors } = useTheme()
  const { isLoading, user, signup, setLoginNotice } = useAuth()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isLoading) return <LoadingScreen />
  if (user) return <Redirect href="/" />

  async function handleSignup() {
    setError('')
    setFieldErrors({})
    const localErrors: Record<string, string> = {}
    if (!firstName.trim()) localErrors.first_name = 'Enter your first name.'
    if (!lastName.trim()) localErrors.last_name = 'Enter your last name.'
    if (!email.trim()) localErrors.email = 'Enter your email address.'
    if ([...password].length < 8) localErrors.password = 'Password must be at least 8 characters.'
    if (password !== passwordConfirmation) localErrors.password_confirmation = 'Passwords do not match.'
    if (Object.keys(localErrors).length) {
      setFieldErrors(localErrors)
      return
    }

    setIsSubmitting(true)
    try {
      await signup(firstName.trim(), lastName.trim(), email.trim(), password)
      setLoginNotice('Your account has been created. Check your email and open the verification link in a web browser, then return here to log in.')
      router.replace('/login')
    } catch (requestError) {
      if (requestError instanceof ApiError) {
        setError(requestError.message)
        setFieldErrors(requestError.fieldErrors)
      } else {
        setError('We could not create your account. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthScreen
      title="Create your account"
      subtitle="One account for finding a place or sharing a listing."
      footer={(
        <View style={styles.footerRow}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>Already have an account?</Text>
          <Pressable onPress={() => router.replace('/login')} accessibilityRole="link">
            <Text style={[styles.link, { color: colors.brandPrimary }]}>Log in</Text>
          </Pressable>
        </View>
      )}
    >
      <View style={styles.form}>
        {error ? <AuthNotice message={error} /> : null}
        <AuthTextField
          label="First name"
          value={firstName}
          onChangeText={setFirstName}
          placeholder="First name"
          autoCapitalize="words"
          autoComplete="given-name"
          textContentType="givenName"
          error={fieldErrors.first_name}
        />
        <AuthTextField
          label="Last name"
          value={lastName}
          onChangeText={setLastName}
          placeholder="Last name"
          autoCapitalize="words"
          autoComplete="family-name"
          textContentType="familyName"
          error={fieldErrors.last_name}
        />
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
          error={fieldErrors.email}
        />
        <AuthTextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Create a password"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
          hint="Use at least 8 characters."
          error={fieldErrors.password}
        />
        <AuthTextField
          label="Confirm password"
          value={passwordConfirmation}
          onChangeText={setPasswordConfirmation}
          placeholder="Enter your password again"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
          error={fieldErrors.password_confirmation}
          onSubmitEditing={() => { void handleSignup() }}
        />
        <Text style={[styles.helper, { color: colors.textMuted }]}>
          We’ll send a verification link to your email. You’ll verify it on the web before logging in here.
        </Text>
        <AuthButton label="Create account" busy={isSubmitting} onPress={() => { void handleSignup() }} />
      </View>
    </AuthScreen>
  )
}

const styles = StyleSheet.create({
  form: { gap: 15 },
  helper: { fontSize: 12, lineHeight: 18 },
  footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  footerText: { fontSize: 14 },
  link: { fontSize: 14, fontWeight: '800' },
})
