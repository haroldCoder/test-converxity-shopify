import './App.css'
import { AppLayout } from './common/layouts'
import { EmptyState, Loader, MetricCard, PageHeader } from './common/components'

function App() {
  return (
    <AppLayout>
      <PageHeader title="Dashboard" subtitle="Welcome to your Shopify admin panel" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <MetricCard title="Total Orders" value="1,240" />
        <MetricCard title="Total Revenue" value="$32,840" />
        <MetricCard title="Active Products" value="86" />
      </div>

      <div className="bg-white rounded-lg border border-[#e1e3e5] shadow-sm p-4 mb-8">
        <Loader />
      </div>

      <div className="bg-white rounded-lg border border-[#e1e3e5] shadow-sm">
        <EmptyState message="No orders found. Start by creating your first order." />
      </div>
    </AppLayout>
  )
}

export default App
