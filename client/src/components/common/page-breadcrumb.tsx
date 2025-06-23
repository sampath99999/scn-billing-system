import React from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Link } from 'react-router';

interface BreadcrumbItemType {
    label: string;
    href?: string;
    isCurrentPage?: boolean;
}

interface PageBreadcrumbProps {
    items: BreadcrumbItemType[];
}

export default function PageBreadcrumb({ items }: PageBreadcrumbProps) {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {items.map((item, index) => (
                    <React.Fragment key={`${item.label}-${index}`}>
                        <BreadcrumbItem>
                            {item.isCurrentPage ? (
                                <BreadcrumbPage>{item.label}</BreadcrumbPage>
                            ) : item.href ? (
                                <BreadcrumbLink asChild>
                                    <Link to={item.href}>{item.label}</Link>
                                </BreadcrumbLink>
                            ) : (
                                <BreadcrumbPage>{item.label}</BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                        {index < items.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
