import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Link } from 'react-router';
import { Cable, MapIcon, Tv, Users2 } from 'lucide-react';

export default function MasterDataSidebarGroup() {
    return (
        <SidebarGroup>
        <SidebarMenu>
            <SidebarMenuItem>
            <SidebarMenuButton asChild>
                <Link to="/dashboard/master-data/packages" className="flex items-center gap-2">
                <Tv />
                <span>Packages</span>
                </Link>
            </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
            <SidebarMenuButton asChild>
                <Link to="/dashboard/master-data/streets" className="flex items-center gap-2">
                <MapIcon />
                <span>Streets</span>
                </Link>
            </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
            <SidebarMenuButton asChild>
                <Link to="/dashboard/master-data/accessories" className="flex items-center gap-2">
                <Cable />
                <span>Accessories</span>
                </Link>
            </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
            <SidebarMenuButton asChild>
                <Link to="/dashboard/master-data/users" className="flex items-center gap-2">
                <Users2 />
                <span>Users</span>
                </Link>
            </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
        </SidebarGroup>
    );
}
