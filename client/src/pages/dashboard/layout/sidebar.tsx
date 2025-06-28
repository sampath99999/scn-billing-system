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
import type { LucideIcon } from 'lucide-react';

interface MenuItem {
    id: string;
    label: string;
    icon: LucideIcon;
    type: 'link' | 'collapsible';
    href?: string;
    children?: React.ReactNode;
    useReactRouter?: boolean;
}

const menuItems: MenuItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        type: 'link',
        href: '/dashboard',
        useReactRouter: true,
    },
    {
        id: 'customers',
        label: 'Customers',
        icon: Users,
        type: 'link',
        href: '/dashboard/customers',
        useReactRouter: false,
    },
    {
        id: 'master-data',
        label: 'Master Data',
        icon: Database,
        type: 'collapsible',
        children: <MasterDataSidebarGroup />,
    },
    {
        id: 'reports',
        label: 'Reports',
        icon: ChartBarIcon,
        type: 'link',
        href: '/reports',
        useReactRouter: false,
    },
];

export function AppSidebar() {
    const renderMenuItem = (item: MenuItem) => {
        const IconComponent = item.icon;

        if (item.type === 'collapsible') {
            return (
                <Collapsible key={item.id} className="group/collapsible">
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton>
                                <IconComponent />
                                <span>{item.label}</span>
                                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            {item.children}
                        </CollapsibleContent>
                    </SidebarMenuItem>
                </Collapsible>
            );
        }

        return (
            <SidebarMenuItem key={item.id}>
                <SidebarMenuButton asChild>
                    {item.useReactRouter ? (
                        <Link
                            to={item.href!}
                            className="flex items-center gap-2"
                        >
                            <IconComponent />
                            <span>{item.label}</span>
                        </Link>
                    ) : (
                        <a
                            href={item.href!}
                            className="flex items-center gap-2"
                        >
                            <IconComponent />
                            <span>{item.label}</span>
                        </a>
                    )}
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    };

    return (
        <Sidebar side="left" collapsible="icon" className="relative h-full">
            <SidebarContent className="bg-white">
                <SidebarGroup>
                    <SidebarMenu>
                        {menuItems.map(renderMenuItem)}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
