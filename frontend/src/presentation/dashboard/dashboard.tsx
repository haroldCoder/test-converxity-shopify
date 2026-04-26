import { Page, Layout, Card, Text, Spinner } from '@shopify/polaris'
import { useDashboardMetrics } from '../../common/hooks'

export const Dashboard = () => {
  const shopId = 'test-shop' // TODO: Get from context or URL
  const { data: metrics, isLoading, error } = useDashboardMetrics(shopId)

  if (isLoading) {
    return (
      <Page title="Dashboard">
        <Layout>
          <Layout.Section>
            <Card>
              <div className="flex justify-center">
                <Spinner accessibilityLabel="Loading metrics" />
              </div>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    )
  }

  if (error) {
    return (
      <Page title="Dashboard">
        <Layout>
          <Layout.Section>
            <Card>
              <Text as="p" variant="bodyMd" tone="critical">Error loading metrics</Text>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    )
  }

  return (
    <Page title="Dashboard" subtitle="Welcome to your Shopify admin panel">
      <Layout>
        <Layout.Section>
          <Card>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Text variant="headingMd" as="h3">Total Referred Sales</Text>
                <Text variant="headingXl" as="p">${metrics?.totalReferredSales.toLocaleString() || 0}</Text>
              </div>
              <div>
                <Text variant="headingMd" as="h3">Total Commissions Generated</Text>
                <Text variant="headingXl" as="p">${metrics?.totalCommissionsGenerated.toLocaleString() || 0}</Text>
              </div>
              <div>
                <Text variant="headingMd" as="h3">Commissions to Pay Affiliates</Text>
                <Text variant="headingXl" as="p">${metrics?.commissionsToPayAffiliates.toLocaleString() || 0}</Text>
              </div>
            </div>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <Text variant="headingMd" as="h3">Recent Activity</Text>
            <p>No recent activity.</p>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  )
}