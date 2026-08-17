# Project Architecture Rules

## Stack

This application uses:

- Laravel
- React
- TypeScript
- Inertia.js
- Tailwind CSS
- shadcn/ui

Follow Laravel, React, and Inertia best practices.

---

# General Rules

## Reuse Before Creating

Before creating a new React component:

1. Search the existing components.
2. Check whether an existing component can be reused.
3. Check whether an existing component can be extended with props.
4. Only create a new component when there is no appropriate reusable component.

Never duplicate JSX/UI structures across multiple pages.

If the same UI pattern appears in multiple locations, extract it into a reusable component.

Do not copy and paste components and rename them.

Prefer configurable components using props.

Example:

Bad:

CustomerSaveButton.tsx
ProductSaveButton.tsx
SupplierSaveButton.tsx

Good:

SaveButton.tsx

with configurable props.

---

# React Architecture

Use this structure:

resources/js/

components/
    ui/
    shared/

features/

hooks/

layouts/

lib/

pages/

types/

## components/ui

Contains generic UI primitives such as:

Button
Input
Dialog
Select
Table
Badge
Card
Dropdown
Modal

Prefer existing shadcn/ui components whenever appropriate.

Do not recreate functionality already provided by an existing UI component.

## components/shared

Contains application-wide reusable components.

Examples:

DataTable
PageHeader
SearchInput
ConfirmDialog
EmptyState
Pagination
StatusBadge
FormField
LoadingState

Components here must not contain feature-specific business logic.

---

# Feature Components

Feature-specific components should live under:

resources/js/features/{feature}/

Example:

features/customers/
    components/
    hooks/
    types.ts
    utils.ts

Example:

features/customers/components/
    CustomerForm.tsx
    CustomerCard.tsx
    CustomerFilters.tsx

Do not put customer-specific components inside shared components.

---

# Pages

Inertia pages live inside:

resources/js/pages/

Pages should remain small.

Pages should primarily:

- compose components
- receive Inertia props
- configure layouts
- coordinate feature components

Pages should NOT contain large amounts of reusable JSX.

If a page becomes large, extract sections into components.

Example:

pages/customers/index.tsx

should use:

<CustomerFilters />
<CustomerTable />
<Pagination />

instead of implementing all of those directly inside the page.

---

# Layouts

Shared application structures belong in:

resources/js/layouts/

Examples:

AppLayout
AuthLayout
DashboardLayout

Never duplicate:

navigation
sidebar
header
footer

inside individual pages.

Use layouts instead.

Inertia supports reusable/persistent layouts and they should be used for shared application UI.

---

# Hooks

Reusable React logic belongs in:

resources/js/hooks/

Feature-specific hooks belong inside:

resources/js/features/{feature}/hooks/

Example:

hooks/useDebounce.ts

features/customers/hooks/useCustomerFilters.ts

Do not duplicate state management logic between components.

Extract reusable logic into custom hooks when appropriate.

---

# TypeScript

Use TypeScript everywhere.

Avoid `any`.

Create reusable interfaces/types.

Global/shared types:

resources/js/types/

Feature types:

resources/js/features/{feature}/types.ts

---

# Laravel Backend Architecture

Keep controllers thin.

Controllers should mainly:

1. authorize
2. validate/request data
3. call application logic
4. return Inertia responses or redirects

Use:

app/Http/Controllers/
app/Http/Requests/
app/Http/Resources/
app/Models/
app/Policies/

For larger business operations, use:

app/Actions/

Example:

app/Actions/Customers/CreateCustomer.php
app/Actions/Customers/UpdateCustomer.php
app/Actions/Customers/DeleteCustomer.php

Do not put complex business logic directly inside controllers.

Do not duplicate queries or business logic between controllers.

---

# Forms

Use Laravel Form Requests for server-side validation.

Use Inertia's form utilities for frontend form handling.

Create reusable form components when fields or structures repeat.

For example:

CustomerForm.tsx

should be shared between:

customers/create
customers/edit

with props controlling create/edit behavior.

Do NOT create:

CreateCustomerForm.tsx
EditCustomerForm.tsx

when one reusable CustomerForm can handle both cases.

---

# Modals

Create shared reusable modal components.

Examples:

ConfirmDialog
DeleteDialog
FormDialog

Do not implement custom modal markup repeatedly inside pages.

---

# Tables

Use a reusable DataTable component when multiple screens contain similar tables.

Feature pages should configure:

columns
actions
data
filters

instead of recreating table markup.

---

# Code Quality

Before implementing a feature:

1. inspect the existing architecture
2. inspect existing reusable components
3. identify components that can be reused
4. identify backend logic that can be reused
5. then implement the feature

After implementing:

1. check for duplicated code
2. refactor duplicated JSX
3. refactor duplicated Laravel logic
4. verify TypeScript types
5. run formatting/linting/tests

Prefer simple reusable abstractions.

Do not over-engineer components that are only used once unless there is a clear architectural reason.

---

# Important Codex Behavior

When I request a feature, do not immediately start coding.

First inspect relevant:

- pages
- components
- features
- models
- controllers
- routes
- requests

Then reuse the existing architecture.

Maintain consistency with existing code.

When you discover a reusable pattern, prefer extending the existing abstraction rather than creating a parallel implementation.