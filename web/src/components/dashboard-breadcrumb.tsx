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
import { useRecipeTitle } from '~/contexts/recipe-title-context';

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
  const recipeTitle = useRecipeTitle();
  const segments = pathname.split('/').filter(Boolean);

  const lastSegment = segments.at(-1) ?? '';
  const prevSegment = segments.at(-2) ?? '';
  const isRecipeViewPage = /^\d+$/.test(lastSegment) && prevSegment === 'recipes';
  const isRecipeEditPage =
    lastSegment === 'edit' && /^\d+$/.test(prevSegment) && segments.at(-3) === 'recipes';

  const breadcrumbs: { href: string; isRecipeLink?: true; label: string }[] = [];
  let path = '';

  for (const segment of segments) {
    path += `/${segment}`;
    if (/^\d+$/.test(segment)) continue;
    const label = segmentLabels[segment];

    if (label) {
      if (isRecipeEditPage && segment === 'edit') {
        breadcrumbs.push({
          href: pathname.slice(0, -'/edit'.length),
          isRecipeLink: true,
          label: recipeTitle ?? '...',
        });
      }

      breadcrumbs.push({ href: path, label });
    }
  }

  if (isRecipeViewPage) {
    breadcrumbs.push({ href: pathname, label: recipeTitle ?? '...' });
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const isLink = !isLast && (sidebarHrefs.has(crumb.href) || crumb.isRecipeLink);

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
