import { use, useMemo } from "react";
import PackagesBreadcrumb from "./components/breadcrumb";
import PackagesFilters from "./components/filters";
import {
  createColumnHelper,
} from "@tanstack/react-table";
import type { Package } from "@/types/Package";
import PackageService from "@/services/packages.service";

export default function PackagesPage() {
    const columnHelper = createColumnHelper<Package>()
    const columns = useMemo(() => [
        columnHelper.accessor('name', {
            header: 'Package Name',
        }),
        columnHelper.accessor('package_type', {
            header: 'Package Type',
        }),
        columnHelper.accessor('price_per_month', {
            header: 'Price per Month',
            cell: info => `$${info.getValue().toFixed(2)}`,
        }),
        columnHelper.accessor('createdAt', {
            header: 'Created At',
            cell: info => new Date(info.getValue()).toLocaleDateString(),
        }),
        columnHelper.accessor('updatedAt', {
            header: 'Updated At',
            cell: info => new Date(info.getValue()).toLocaleDateString(),
        }),
    ], [columnHelper]);
    const packages = use(PackageService.getPackages());
    return (
        <div className="bg-white p-3">
            <PackagesBreadcrumb />
            <PackagesFilters />
        </div>
    );
}
