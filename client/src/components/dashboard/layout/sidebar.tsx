import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  RxDashboard,
} from 'react-icons/rx';
import { FiUsers, FiDatabase, FiPieChart } from "react-icons/fi";
import { Link } from 'react-router';

export function AppSidebar() {
  return (
    <Sidebar side="left" collapsible="icon" className="relative h-full">
      <SidebarContent className='bg-white'>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/dashboard" className="flex items-center gap-2">
                  <RxDashboard />
                  <span>Dashboard</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/customers" className="flex items-center gap-2">
                  <FiUsers />
                  <span>Customers</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to={'master-data'} className="flex items-center gap-2">
                  <FiDatabase />
                  <span>Master Data</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/reports" className="flex items-center gap-2">
                  <FiPieChart />
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
