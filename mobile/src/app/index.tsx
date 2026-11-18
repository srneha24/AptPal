import { Redirect } from 'expo-router'
import { LoadingScreen } from '../../components/LoadingScreen'
import { useAuth } from '../../context/AuthContext'
import { HomeScreen } from '../../screens/HomeScreen'

export default function IndexRoute() {
  const { isLoading, user } = useAuth()

  if (isLoading) return <LoadingScreen />
  if (!user) return <Redirect href="/login" />
  return <HomeScreen />
}
