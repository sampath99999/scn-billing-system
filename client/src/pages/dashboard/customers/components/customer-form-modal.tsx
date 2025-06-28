import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../../components/ui/dialog';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { Textarea } from '../../../../../components/ui/textarea';
import { Label } from '../../../../../components/ui/label';
import type { Customer } from '@/types/Customer';

interface CustomerFormData {
    first_name: string;
    last_name: string;
    care_of: string;
    phone: string;
    address: string;
    box_no: string;
    note: string;
    latitude?: number;
    longitude?: number;
    old_due: number;
}

interface CustomerFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CustomerFormData) => void;
    customer?: Customer | null;
    loading?: boolean;
}

export function CustomerFormModal({
    open,
    onClose,
    onSubmit,
    customer,
    loading = false,
}: CustomerFormModalProps) {
    const [formData, setFormData] = useState<CustomerFormData>({
        first_name: '',
        last_name: '',
        care_of: '',
        phone: '',
        address: '',
        box_no: '',
        note: '',
        latitude: undefined,
        longitude: undefined,
        old_due: 0,
    });

    const [errors, setErrors] = useState<Partial<Record<keyof CustomerFormData, string>>>({});

    // Update form data when customer prop changes
    useEffect(() => {
        if (customer) {
            setFormData({
                first_name: customer.first_name || '',
                last_name: customer.last_name || '',
                care_of: customer.care_of || '',
                phone: customer.phone || '',
                address: customer.address || '',
                box_no: customer.box_no || '',
                note: customer.note || '',
                latitude: customer.latitude,
                longitude: customer.longitude,
                old_due: customer.old_due || 0,
            });
        } else {
            setFormData({
                first_name: '',
                last_name: '',
                care_of: '',
                phone: '',
                address: '',
                box_no: '',
                note: '',
                latitude: undefined,
                longitude: undefined,
                old_due: 0,
            });
        }
        setErrors({});
    }, [customer, open]);

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof CustomerFormData, string>> = {};

        if (!formData.first_name.trim()) {
            newErrors.first_name = 'First name is required';
        }
        if (!formData.last_name.trim()) {
            newErrors.last_name = 'Last name is required';
        }
        if (!formData.care_of.trim()) {
            newErrors.care_of = 'Care of is required';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        }
        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }
        if (!formData.box_no.trim()) {
            newErrors.box_no = 'Box number is required';
        }
        if (!formData.note.trim()) {
            newErrors.note = 'Note is required';
        }
        if (formData.old_due < 0) {
            newErrors.old_due = 'Old due cannot be negative';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const handleInputChange = (field: keyof CustomerFormData, value: string | number | undefined) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleClose = () => {
        setFormData({
            first_name: '',
            last_name: '',
            care_of: '',
            phone: '',
            address: '',
            box_no: '',
            note: '',
            latitude: undefined,
            longitude: undefined,
            old_due: 0,
        });
        setErrors({});
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {customer ? 'Edit Customer' : 'Create New Customer'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first_name">First Name *</Label>
                                <Input
                                    id="first_name"
                                    placeholder="Enter first name"
                                    value={formData.first_name}
                                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                                    className={errors.first_name ? 'border-red-500' : ''}
                                />
                                {errors.first_name && (
                                    <p className="text-sm text-red-500">{errors.first_name}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last_name">Last Name *</Label>
                                <Input
                                    id="last_name"
                                    placeholder="Enter last name"
                                    value={formData.last_name}
                                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                                    className={errors.last_name ? 'border-red-500' : ''}
                                />
                                {errors.last_name && (
                                    <p className="text-sm text-red-500">{errors.last_name}</p>
                                )}
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="care_of">Care Of *</Label>
                                <Input
                                    id="care_of"
                                    placeholder="Enter care of (e.g., S/O, D/O, W/O)"
                                    value={formData.care_of}
                                    onChange={(e) => handleInputChange('care_of', e.target.value)}
                                    className={errors.care_of ? 'border-red-500' : ''}
                                />
                                {errors.care_of && (
                                    <p className="text-sm text-red-500">{errors.care_of}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number *</Label>
                                <Input
                                    id="phone"
                                    placeholder="Enter phone number"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className={errors.phone ? 'border-red-500' : ''}
                                />
                                {errors.phone && (
                                    <p className="text-sm text-red-500">{errors.phone}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="box_no">Box Number *</Label>
                                <Input
                                    id="box_no"
                                    placeholder="Enter box number"
                                    value={formData.box_no}
                                    onChange={(e) => handleInputChange('box_no', e.target.value)}
                                    className={errors.box_no ? 'border-red-500' : ''}
                                />
                                {errors.box_no && (
                                    <p className="text-sm text-red-500">{errors.box_no}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Address Information</h3>
                        <div className="space-y-2">
                            <Label htmlFor="address">Address *</Label>
                            <Textarea
                                id="address"
                                placeholder="Enter complete address"
                                className={`min-h-[80px] ${errors.address ? 'border-red-500' : ''}`}
                                value={formData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                            />
                            {errors.address && (
                                <p className="text-sm text-red-500">{errors.address}</p>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="latitude">Latitude (Optional)</Label>
                                <Input
                                    id="latitude"
                                    type="number"
                                    step="any"
                                    placeholder="Enter latitude"
                                    value={formData.latitude || ''}
                                    onChange={(e) => handleInputChange('latitude', e.target.value ? parseFloat(e.target.value) : undefined)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="longitude">Longitude (Optional)</Label>
                                <Input
                                    id="longitude"
                                    type="number"
                                    step="any"
                                    placeholder="Enter longitude"
                                    value={formData.longitude || ''}
                                    onChange={(e) => handleInputChange('longitude', e.target.value ? parseFloat(e.target.value) : undefined)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Additional Information</h3>
                        <div className="space-y-2">
                            <Label htmlFor="note">Notes *</Label>
                            <Textarea
                                id="note"
                                placeholder="Enter any additional notes or comments"
                                className={`min-h-[80px] ${errors.note ? 'border-red-500' : ''}`}
                                value={formData.note}
                                onChange={(e) => handleInputChange('note', e.target.value)}
                            />
                            {errors.note && (
                                <p className="text-sm text-red-500">{errors.note}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="old_due">Old Due Amount</Label>
                            <Input
                                id="old_due"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Enter old due amount (if any)"
                                value={formData.old_due}
                                onChange={(e) => handleInputChange('old_due', e.target.value ? parseFloat(e.target.value) : 0)}
                                className={errors.old_due ? 'border-red-500' : ''}
                            />
                            {errors.old_due && (
                                <p className="text-sm text-red-500">{errors.old_due}</p>
                            )}
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? customer
                                    ? 'Updating...'
                                    : 'Creating...'
                                : customer
                                    ? 'Update Customer'
                                    : 'Create Customer'
                            }
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
