import { Card, Text } from '@shopify/polaris'; // Se pone aqui, para implementar principios SOLID en el frontend

export const DashboardActivity = () => {
    return (
        <Card>
            <Text variant="headingMd" as="h3">Recent Activity</Text>
            <p>No recent activity.</p>
        </Card>
    );
};
