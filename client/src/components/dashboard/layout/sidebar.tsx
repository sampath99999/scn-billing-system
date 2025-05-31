import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  FaTachometerAlt,
  FaUsers,
  FaDatabase,
  FaChartBar,
} from 'react-icons/fa';

export function AppSidebar() {
  return (
    <Sidebar side="left" collapsible="icon" className="h-full">
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/dashboard" className="flex items-center gap-2">
                  <FaTachometerAlt />
                  <span>Dashboard</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/customers" className="flex items-center gap-2">
                  <FaUsers />
                  <span>Customers</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/master-data" className="flex items-center gap-2">
                  <FaDatabase />
                  <span>Master Data</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/reports" className="flex items-center gap-2">
                  <FaChartBar />
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
