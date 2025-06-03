import { Header } from '@/components/dashboard/layout/header';
import { AppSidebar } from '@/components/dashboard/layout/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { UserDetailsContext } from '@/contexts/UserDetailsContext';
import { useUserDetails } from '@/hooks/userDetails.hook';
import { Outlet } from 'react-router'; // Make sure it's 'react-router-dom'
import { Toaster } from 'sonner';

export default function DashboardPage() {
  const userDetails = useUserDetails();

  return (
    <>
      <UserDetailsContext.Provider value={userDetails}>
        <SidebarProvider>
          <div className="flex flex-col h-screen w-full overflow-hidden">
            <Header />
            <div className="flex flex-1 overflow-hidden dashboard-sidebar">
              <AppSidebar />
              <main className="flex-1 overflow-auto p-4 bg-muted">
                <Outlet />
              </main>
            </div>
          </div>
        </SidebarProvider>
      </UserDetailsContext.Provider>
      <Toaster />
    </>
  );
}
