import { Button } from '@/components/ui/button';
import { DrawerClose } from '@/components/ui/drawer';
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
import { createPackageSchema, type CreatePackageData } from '@/schemas/package.schema';
import PackageService from '@/services/packages.service';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export default function CreatePackageForm() {
    const form = useForm<z.infer<typeof createPackageSchema>>({
        resolver: zodResolver(createPackageSchema),
        defaultValues: {
            name: '',
            package_type: '',
            price_per_month: 0,
        },
    });

    const onSubmitHandler = async (data: CreatePackageData) => {
        try {
            await PackageService.createPackage(data);
            toast.success('Package created successfully!');
            form.reset();
        } catch (error) {
            toast.error(
                (error as AxiosError<{message: string}>).response?.data?.message || 'Failed to create package. Please try again later.'
            );
        }

    };

    return (
        <div className="">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmitHandler)}
                    className="space-y-8"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Package Name" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Enter Package name.
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
                                <FormControl>
                                    <Input
                                        placeholder="Add On or Package"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Enter the package type.
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
                                <FormLabel>Price Per Month</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Enter the price per month.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button className='w-full mb-2' type="submit">Create Package</Button>
                    <DrawerClose asChild>
                        <Button className='w-full' variant="outline">Cancel</Button>
                    </DrawerClose>
                </form>
            </Form>
        </div>
    );
}
