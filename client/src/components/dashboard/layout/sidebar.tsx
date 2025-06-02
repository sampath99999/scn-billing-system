import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@radix-ui/react-collapsible';
import { Link } from 'react-router';
import MasterDataSidebarGroup from './masterDataSidebarGroup';
import {
    ChartBarIcon,
    ChevronDown,
    Database,
    LayoutDashboard,
    Users,
} from 'lucide-react';

export function AppSidebar() {
    return (
        <Sidebar side="left" collapsible="icon" className="relative h-full">
            <SidebarContent className="bg-white">
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link
                                    to={'/dashboard'}
                                    className="flex items-center gap-2"
                                >
                                    <LayoutDashboard />
                                    <span>Dashboard</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <a
                                    href="/customers"
                                    className="flex items-center gap-2"
                                >
                                    <Users />
                                    <span>Customers</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <Collapsible className="group/collapsible">
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton>
                                            <Database />
                                            <span>Master Data</span>
                                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <MasterDataSidebarGroup />
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <a
                                    href="/reports"
                                    className="flex items-center gap-2"
                                >
                                    <ChartBarIcon />
                                    <span>Reports</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
