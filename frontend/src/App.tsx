import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from '@shopify/polaris'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Dashboard } from './presentation/dashboard/dashboard'
import { Affiliates } from './presentation/affiliates/affiliates'
import { Nav } from '@common/components/nav'
import { ROUTES } from '@common/constants/routes'
import { useAffiliateTracking } from '@common/hooks'
import '@shopify/polaris/build/esm/styles.css'

const AffiliateTracker = () => {
  useAffiliateTracking()
  return null
}

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider i18n={{}}>
        <Router>
          <AffiliateTracker />
          <Nav />
          <Routes>
            <Route path={ROUTES.dashboard} element={<Dashboard />} />
            <Route path={ROUTES.affiliates} element={<Affiliates />} />
          </Routes>
        </Router>
      </AppProvider>
    </QueryClientProvider>
  )
}

export default App
