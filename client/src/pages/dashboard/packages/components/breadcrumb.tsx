import PageBreadcrumb from '@/components/common/page-breadcrumb';

export default function PackagesBreadcrumb() {
    const breadcrumbItems = [
        {
            label: 'Dashboard',
            href: '/dashboard',
        },
        {
            label: 'Master Data',
        },
        {
            label: 'Packages',
            isCurrentPage: true,
        },
    ];

    return <PageBreadcrumb items={breadcrumbItems} />;
}
