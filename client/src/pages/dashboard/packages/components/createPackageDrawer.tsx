import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import CreatePackageForm from './createPackageForm';
import { Button } from '@/components/ui/button';

export default function CreatePackageDrawer() {
    return (
        <div>
            <Drawer direction="right">
                <DrawerTrigger>
                    <Button>+ Add New</Button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Create New Package</DrawerTitle>
                        <DrawerDescription>
                            Fill in the details below to create a new package.
                        </DrawerDescription>
                        <CreatePackageForm />
                    </DrawerHeader>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
