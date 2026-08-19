import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    announcementBar?: {
        enabled: boolean;
        texts: string[];
        backgroundColor: string;
        textColor: string;
    };
    deliverySettings?: {
        pricingMode: string;
        requiresZoneChoice: boolean;
        samePrice: {
            label: string;
            priceCents: number;
            price: string;
        };
        zones: Record<
            string,
            {
                label: string;
                priceCents: number;
                price: string;
            }
        >;
    };
    policyPages?: Array<{
        title: string;
        href: string;
    }>;
    flash?: {
        success?: string;
        order?: {
            number: string;
            created_at: string;
            subtotal: string;
            discount: string;
            discount_cents: number;
            delivery: string;
            delivery_zone: string;
            delivery_label: string;
            total: string;
            payment_method: string;
            payment_label: string;
            customer: {
                name: string;
                email: string | null;
                phone: string;
            };
            shipping_address: {
                lines: string[];
            };
            billing_same_as_shipping: boolean;
            billing_address: {
                lines: string[];
            } | null;
            items: Array<{
                title: string;
                quantity: number;
                unit_price: string;
                original_total: string;
                discount: string;
                discount_cents: number;
                total: string;
            }>;
            notes?: string | null;
        };
    };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
