import { Page, Layout, Card, Spinner } from '@shopify/polaris';

export const DashboardLoading = () => {
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
    );
};
