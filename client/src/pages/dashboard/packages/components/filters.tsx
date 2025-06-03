import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

export default function PackagesFilters() {
    return (
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between my-3">
            <div className="w-full sm:w-1/3 flex items-center gap-2">
                <div className="relative w-full sm:w-auto">
                    <Input
                        type="search"
                        placeholder="Filter packages..."
                        className="sm:w-[200px]"
                    />
                </div>
            </div>
            <div className="flex w-full sm:w-auto gap-2">
                <Button size={'sm'}>
                    <Plus />
                    Add New
                </Button>
            </div>
        </div>
    );
}
