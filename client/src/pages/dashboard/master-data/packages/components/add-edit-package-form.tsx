import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createPackageSchema, type CreatePackageData } from '@/schemas/package.schema';
import { PACKAGE_TYPES } from '@/types/Package';
import type { Package } from '@/types/Package';
import PackageService from '@/services/packages.service';

interface AddEditPackageFormProps {
  packageData: Package | null;
  onSave: () => void;
  onCancel: () => void;
}

export function AddEditPackageForm({ packageData, onSave, onCancel }: AddEditPackageFormProps) {
  const isEditing = !!packageData;

  const form = useForm<CreatePackageData>({
    resolver: zodResolver(createPackageSchema),
    defaultValues: {
      name: '',
      package_type: PACKAGE_TYPES.PACKAGE,
      price_per_month: 0,
    },
  });

  // Set form values when editing an existing package
  useEffect(() => {
    if (packageData) {
      form.reset({
        name: packageData.name,
        package_type: packageData.package_type,
        price_per_month: packageData.price_per_month,
      });
    } else {
      form.reset({
        name: '',
        package_type: PACKAGE_TYPES.PACKAGE,
        price_per_month: 0,
      });
    }
  }, [packageData, form]);

  const onSubmit = async (data: CreatePackageData) => {
    try {
      if (isEditing && packageData) {
        await PackageService.updatePackage(packageData._id, data);
        toast.success('Package updated successfully');
      } else {
        await PackageService.createPackage(data);
        toast.success('Package created successfully');
      }
      onSave();
    } catch (error) {
      console.error('Failed to save package:', error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} package. Please try again.`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Package Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter package name" {...field} />
              </FormControl>
              <FormDescription>
                The name of the package as it will appear to customers.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="package_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Package Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select package type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={PACKAGE_TYPES.PACKAGE}>Package</SelectItem>
                  <SelectItem value={PACKAGE_TYPES.ADD_ON}>Add On</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Packages are standalone offerings, while Add-ons can only be purchased with a package.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price_per_month"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price per Month (₹)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                The monthly price of the package in Indian Rupees.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? 'Update' : 'Create'} Package
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
