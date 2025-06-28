import { ArrowLeft, MapPin, Phone, CreditCard, Calendar, User, FileText } from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { Badge } from '../../../../../components/ui/badge';
import { Separator } from '../../../../../components/ui/separator';
import type { Customer } from '@/types/Customer';

interface CustomerSingleViewProps {
    customer: Customer;
    onBack: () => void;
    onEdit: () => void;
    loading?: boolean;
}

export function CustomerSingleView({
    customer,
    onBack,
    onEdit,
    loading = false,
}: CustomerSingleViewProps) {
    const formatDate = (date: string | Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onBack}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">
                            {customer.first_name} {customer.last_name}
                        </h1>
                        <p className="text-muted-foreground">Customer Details</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Badge
                        variant={customer.is_active ? "default" : "secondary"}
                        className={
                            customer.is_active
                                ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                        }
                    >
                        {customer.is_active ? 'Active' : 'Pending Approval'}
                    </Badge>
                    <Button onClick={onEdit} disabled={loading}>
                        Edit Customer
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Personal Information */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    First Name
                                </label>
                                <p className="text-sm font-medium">{customer.first_name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Last Name
                                </label>
                                <p className="text-sm font-medium">{customer.last_name}</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Care Of
                                </label>
                                <p className="text-sm font-medium">{customer.care_of}</p>
                            </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Phone Number
                                    </label>
                                    <p className="text-sm font-medium">{customer.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Box Number
                                    </label>
                                    <p className="text-sm font-medium">{customer.box_no}</p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <div className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Address
                                    </label>
                                    <p className="text-sm font-medium">{customer.address}</p>
                                </div>
                            </div>
                        </div>

                        {(customer.latitude || customer.longitude) && (
                            <>
                                <Separator />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {customer.latitude && (
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Latitude
                                            </label>
                                            <p className="text-sm font-medium">{customer.latitude}</p>
                                        </div>
                                    )}
                                    {customer.longitude && (
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Longitude
                                            </label>
                                            <p className="text-sm font-medium">{customer.longitude}</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        <Separator />

                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Notes
                            </label>
                            <p className="text-sm font-medium whitespace-pre-wrap">{customer.note}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Stats & Actions */}
                <div className="space-y-6">
                    {/* Financial Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Financial Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Outstanding Due</span>
                                    <span className={`text-sm font-medium ${
                                        customer.old_due > 0 ? 'text-red-600' : 'text-green-600'
                                    }`}>
                                        {formatCurrency(customer.old_due)}
                                    </span>
                                </div>
                                {customer.old_due > 0 && (
                                    <Badge variant="destructive" className="w-full justify-center">
                                        Has Outstanding Due
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Account Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Account Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Status
                                </label>
                                <div className="mt-1">
                                    <Badge
                                        variant={customer.is_active ? "default" : "secondary"}
                                        className={
                                            customer.is_active
                                                ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                                        }
                                    >
                                        {customer.is_active ? 'Active' : 'Pending Approval'}
                                    </Badge>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Created Date
                                </label>
                                <p className="text-sm font-medium">
                                    {formatDate(customer.createdAt)}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Last Updated
                                </label>
                                <p className="text-sm font-medium">
                                    {formatDate(customer.updatedAt)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
