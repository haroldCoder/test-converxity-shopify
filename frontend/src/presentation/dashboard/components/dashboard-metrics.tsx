import { Card, Text } from '@shopify/polaris';

interface DashboardMetricsProps {
    totalReferredSales: number;
    totalCommissionsGenerated: number;
    commissionsToPayAffiliates: number;
}

export const DashboardMetrics = ({
    totalReferredSales,
    totalCommissionsGenerated,
    commissionsToPayAffiliates,
}: DashboardMetricsProps) => {
    return (
        <Card>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <Text variant="headingMd" as="h3">Total Referred Sales</Text>
                    <Text variant="headingXl" as="p">${totalReferredSales.toLocaleString()}</Text>
                </div>
                <div>
                    <Text variant="headingMd" as="h3">Total Commissions Generated</Text>
                    <Text variant="headingXl" as="p">${totalCommissionsGenerated.toLocaleString()}</Text>
                </div>
                <div>
                    <Text variant="headingMd" as="h3">Commissions to Pay Affiliates</Text>
                    <Text variant="headingXl" as="p">${commissionsToPayAffiliates.toLocaleString()}</Text>
                </div>
            </div>
        </Card>
    );
};
