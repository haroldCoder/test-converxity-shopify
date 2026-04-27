import { Page, Layout, Card, Spinner } from "@shopify/polaris";

export const LoadingAffiliates = () => {
    return (
        <Page title="Affiliate Management">
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
