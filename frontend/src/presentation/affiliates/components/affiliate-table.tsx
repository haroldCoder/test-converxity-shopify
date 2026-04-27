import { Card, DataTable, Button, Text } from '@shopify/polaris';
import type { Affiliate } from '@/common/hooks';

interface AffiliateTableProps {
    affiliates: Affiliate[];
    onDelete: (id: string) => void;
    isDeleting: boolean;
}

export const AffiliateTable = ({ affiliates, onDelete, isDeleting }: AffiliateTableProps) => {
    const rows = (affiliates || []).map(affiliate => [
        affiliate.code,
        `${affiliate.commissionPercent}%`,
        <div className={`flex justify-center items-center px-4 py-2 rounded-lg text-white gap-2 ${affiliate.totalToPay > 0 ? 'bg-green-600' : 'bg-red-600'}`}>
            <Text as="p" variant="bodyMd">$</Text>
            <Text as="p" variant="bodyMd">{affiliate.totalToPay.toLocaleString()}</Text>
        </div>,
        <div key={affiliate.id}>
            <Button
                onClick={() => onDelete(affiliate.id)}
                loading={isDeleting}
            >
                Delete
            </Button>
        </div>
    ]);

    return (
        <Card>
            <DataTable
                columnContentTypes={['text', 'text', 'text', 'text']}
                headings={['Code', 'Commission', 'Total to pay', 'Actions']}
                rows={rows}
            />
        </Card>
    );
};
