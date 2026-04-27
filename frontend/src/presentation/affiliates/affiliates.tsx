import { useMemo, useState } from 'react'
import { Page, Layout, Card, Button, DataTable, Modal, TextField, Form, FormLayout, Spinner, Text } from '@shopify/polaris'
import { useAffiliates, useCreateAffiliate, useDeleteAffiliate, type Affiliate } from '../../common/hooks'
import { affiliatesDataLocal } from './data/affiliates.data'

export const Affiliates = () => {
  const shopId = 'test-shop'
  const { data: affiliates, isLoading, error } = useAffiliates(shopId)
  const createMutation = useCreateAffiliate()
  const deleteMutation = useDeleteAffiliate()

  const [modalActive, setModalActive] = useState(false)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [commissionPercent, setCommissionPercent] = useState('')

  const affiliatesData: Affiliate[] = useMemo(() => affiliates ?? affiliatesDataLocal, [affiliates])

  const handleAdd = () => {
    setName('')
    setCode('')
    setCommissionPercent('')
    setModalActive(true)
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  const handleSave = () => {
    createMutation.mutate({
      shopId,
      name,
      code,
      commissionPercent: parseFloat(commissionPercent),
    })
    setModalActive(false)
  }

  if (isLoading) {
    return (
      <Page title="Affiliate Management"> {/* Estos componentes los podemos mover a esta presentacion/components */}
        <Layout>
          <Layout.Section>
            <Card>
              <div className="flex justify-center">
                <Spinner accessibilityLabel="Loading affiliates" />
              </div>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    )
  }

  if (error) {
    return (
      <Page title="Affiliate Management">
        <Layout>
          <Layout.Section>
            <Card>
              <Text as="p" variant="bodyMd" tone="critical">Error loading affiliates</Text>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    )
  }

  const rows = (affiliatesData || []).map(affiliate => [
    affiliate.code,
    `${affiliate.commissionPercent}%`,
    <div className={`flex justify-center items-center px-4 py-2 rounded-lg text-white gap-2 ${affiliate.totalToPay > 0 ? 'bg-green-600' : 'bg-red-600'}`}>
      <Text as="p" variant="bodyMd">$</Text>
      <Text as="p" variant="bodyMd">{affiliate.totalToPay.toLocaleString()}</Text>
    </div>,
    <div key={affiliate.id}>
      <Button onClick={() => handleDelete(affiliate.id)} loading={deleteMutation.isPending}>Delete</Button>
    </div>
  ])

  return (
    <Page
      title="Affiliate Management"
      subtitle="Manage your affiliates and their commission rates"
      primaryAction={<Button onClick={handleAdd} loading={createMutation.isPending}>Add Affiliate</Button>}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <DataTable
              columnContentTypes={['text', 'text', 'text', 'text']}
              headings={['Code', 'Commission', 'Total to pay', 'Actions']}
              rows={rows}
            />
          </Card>
        </Layout.Section>
      </Layout>

      <Modal
        open={modalActive}
        onClose={() => setModalActive(false)}
        title="Add Affiliate"
        primaryAction={{
          content: 'Save',
          onAction: handleSave,
          loading: createMutation.isPending,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: () => setModalActive(false),
          },
        ]}
      >
        <Modal.Section>
          <Form onSubmit={handleSave}>
            <FormLayout>
              <TextField
                label="Name"
                value={name}
                onChange={setName}
                autoComplete="off"
              />
              <TextField
                label="Code"
                value={code}
                onChange={setCode}
                autoComplete="off"
              />
              <TextField
                label="Commission (%)"
                type="number"
                value={commissionPercent}
                onChange={setCommissionPercent}
                autoComplete="off"
              />
            </FormLayout>
          </Form>
        </Modal.Section>
      </Modal>
    </Page>
  )
}