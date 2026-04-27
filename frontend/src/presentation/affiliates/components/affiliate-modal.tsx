import { Modal, Form, FormLayout, TextField } from '@shopify/polaris';
import { useState, useEffect } from 'react';

interface AffiliateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { name: string; code: string; commissionPercent: string }) => void;
    isSaving: boolean;
}

export const AffiliateModal = ({ isOpen, onClose, onSave, isSaving }: AffiliateModalProps) => {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [commissionPercent, setCommissionPercent] = useState('');

    // Reset fields when opening
    useEffect(() => {
        if (isOpen) {
            setName('');
            setCode('');
            setCommissionPercent('');
        }
    }, [isOpen]);

    const handleSave = () => {
        onSave({ name, code, commissionPercent });
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title="Add Affiliate"
            primaryAction={{
                content: 'Save',
                onAction: handleSave,
                loading: isSaving,
            }}
            secondaryActions={[
                {
                    content: 'Cancel',
                    onAction: onClose,
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
    );
};
