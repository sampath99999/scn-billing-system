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
import { createAccessorySchema, type CreateAccessoryData } from '@/schemas/accessory.schema';
import type { Accessory } from '@/types/Accessory';
import AccessoryService from '@/services/accessory.service';

interface AddEditAccessoryFormProps {
  accessoryData: Accessory | null;
  onSave: () => void;
  onCancel: () => void;
}

export function AddEditAccessoryForm({ accessoryData, onSave, onCancel }: AddEditAccessoryFormProps) {
  const isEditing = !!accessoryData;

  const form = useForm<CreateAccessoryData>({
    resolver: zodResolver(createAccessorySchema),
    defaultValues: {
      name: '',
      cost: 0,
    },
  });

  // Set form values when editing an existing accessory
  useEffect(() => {
    if (accessoryData) {
      form.reset({
        name: accessoryData.name,
        cost: accessoryData.cost,
      });
    } else {
      form.reset({
        name: '',
        cost: 0,
      });
    }
  }, [accessoryData, form]);

  const onSubmit = async (data: CreateAccessoryData) => {
    try {
      if (isEditing && accessoryData) {
        await AccessoryService.updateAccessory(accessoryData._id, data);
        toast.success('Accessory updated successfully');
      } else {
        await AccessoryService.createAccessory(data);
        toast.success('Accessory created successfully');
      }
      onSave();
    } catch (error: unknown) {
      console.error('Failed to save accessory:', error);
      const message = (error as Error)?.message ?? `Failed to ${isEditing ? 'update' : 'create'} accessory. Please try again.`;
      toast.error(message);
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
              <FormLabel>Accessory Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter accessory name" {...field} />
              </FormControl>
              <FormDescription>
                The name of the accessory as it will appear to customers.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cost (₹)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                The cost of the accessory in Indian Rupees.
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
            {isEditing ? 'Update' : 'Create'} Accessory
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
