import { Page, Layout, Card, Text } from '@shopify/polaris';

export const AffiliateError = () => {
    return (
        <Page title="Affiliate Management">
            <Layout>
                <Layout.Section>
                    <Card>
                        <Text as="p" variant="bodyMd" tone="critical">
                            Error loading affiliates
                        </Text>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
};
