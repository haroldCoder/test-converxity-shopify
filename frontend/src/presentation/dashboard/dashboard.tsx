import { Page, Layout } from '@shopify/polaris'
import { useDashboardMetrics } from '@/common/hooks'
import { DashboardMetrics, DashboardActivity, DashboardLoading, DashboardError } from './components'

export const Dashboard = () => {
  const shopId = 'test-shop' // TODO: Get from context or URL
  const { data: metrics, isLoading, error } = useDashboardMetrics(shopId)

  if (isLoading) {
    return <DashboardLoading />
  }

  if (error) {
    return <DashboardError />
  }

  return (
    <Page title="Dashboard" subtitle="Welcome to your Shopify admin panel">
      <Layout>
        <Layout.Section>
          <DashboardMetrics
            totalReferredSales={metrics?.totalReferredSales || 0}
            totalCommissionsGenerated={metrics?.totalCommissionsGenerated || 0}
            commissionsToPayAffiliates={metrics?.commissionsToPayAffiliates || 0}
          />
        </Layout.Section>
        <Layout.Section>
          <DashboardActivity />
        </Layout.Section>
      </Layout>
    </Page>
  )
}