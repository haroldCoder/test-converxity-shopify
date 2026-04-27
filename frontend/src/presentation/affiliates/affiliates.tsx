import { useMemo, useState } from 'react'
import { Page, Layout, Button } from '@shopify/polaris'
import { useAffiliates, useCreateAffiliate, useDeleteAffiliate, type Affiliate } from '../../common/hooks'
import { affiliatesDataLocal } from './data/affiliates.data'
import { LoadingAffiliates, AffiliateTable, AffiliateModal, AffiliateError } from './components'

export const Affiliates = () => {
  const shopId = 'test-shop'
  const { data: affiliates, isLoading, error } = useAffiliates(shopId)
  const createMutation = useCreateAffiliate()
  const deleteMutation = useDeleteAffiliate()

  const [modalActive, setModalActive] = useState(false)

  const affiliatesData: Affiliate[] = useMemo(() => affiliates ?? affiliatesDataLocal, [affiliates])

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  const handleSave = ({ name, code, commissionPercent }: { name: string; code: string; commissionPercent: string }) => {
    createMutation.mutate({
      shopId,
      name,
      code,
      commissionPercent: parseFloat(commissionPercent),
    })
    setModalActive(false)
  }

  if (isLoading) {
    return <LoadingAffiliates />
  }

  if (error) {
    return <AffiliateError />
  }

  return (
    <Page
      title="Affiliate Management"
      subtitle="Manage your affiliates and their commission rates"
      primaryAction={
        <Button onClick={() => setModalActive(true)} loading={createMutation.isPending}>
          Add Affiliate
        </Button>
      }
    >
      <Layout>
        <Layout.Section>
          <AffiliateTable
            affiliates={affiliatesData}
            onDelete={handleDelete}
            isDeleting={deleteMutation.isPending}
          />
        </Layout.Section>
      </Layout>

      <AffiliateModal
        isOpen={modalActive}
        onClose={() => setModalActive(false)}
        onSave={handleSave}
        isSaving={createMutation.isPending}
      />
    </Page>
  )
}