import { Page, Layout, Card, Text } from '@shopify/polaris';

export const DashboardError = () => {
    return (
        <Page title="Dashboard">
            <Layout>
                <Layout.Section>
                    <Card>
                        <Text as="p" variant="bodyMd" tone="critical">
                            Error loading metrics
                        </Text>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
};
