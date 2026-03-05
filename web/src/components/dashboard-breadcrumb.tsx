'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';

const segmentLabels: Record<string, string> = {
  admin: 'Admin',
  categories: 'Kategóriák',
  create: 'Létrehozás',
  dashboard: 'Irányítópult',
  edit: 'Szerkesztés',
  ingredients: 'Hozzávalók',
  recipes: 'Receptek',
  saved: 'Mentett receptek',
  units: 'Mértékegységek',
};

const sidebarHrefs = new Set([
  '/dashboard',
  '/dashboard/admin/categories',
  '/dashboard/admin/ingredients',
  '/dashboard/admin/recipes',
  '/dashboard/admin/units',
  '/dashboard/recipes',
  '/dashboard/recipes/create',
  '/dashboard/recipes/saved',
]);

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const breadcrumbs: { href: string; label: string }[] = [];
  let path = '';

  for (const segment of segments) {
    path += `/${segment}`;
    if (/^\d+$/.test(segment)) continue;
    const label = segmentLabels[segment];
    if (label) breadcrumbs.push({ href: path, label });
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const isLink = !isLast && sidebarHrefs.has(crumb.href);

          return (
            <Fragment key={crumb.href}>
              {index > 0 && <BreadcrumbSeparator />}

              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : isLink ? (
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <span>{crumb.label}</span>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
