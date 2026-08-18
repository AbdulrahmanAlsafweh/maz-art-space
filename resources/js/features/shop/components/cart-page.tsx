import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, CreditCard, LoaderCircle, PackageCheck, Printer, Trash2 } from 'lucide-react';
import { type FormEventHandler, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { lineDiscountCents, lineOriginalTotalCents, lineTotalCents, singleKitSlug } from '../pricing';
import { formatMoney } from '../product-data';
import { type CartItem, useCart } from './cart-context';
import { QuantityControl } from './quantity-control';
import { ShopLayout } from './shop-layout';

type CheckoutStep = 'items' | 'customer' | 'review';
type PaymentMethod = 'cash_on_delivery' | 'which_gateway';
type DeliveryZone = 'inside_tripoli' | 'outside_tripoli';

interface CheckoutAddress {
    full_name: string;
    line_one: string;
    line_two: string;
    city: string;
    region: string;
    country: string;
}

interface CheckoutForm {
    order_number: string;
    items: Array<{
        product_slug: string;
        quantity: number;
    }>;
    delivery_zone: DeliveryZone;
    customer: {
        name: string;
        email: string;
        phone: string;
    };
    shipping_address: CheckoutAddress;
    billing_same_as_shipping: boolean;
    billing_address: CheckoutAddress;
    payment_method: PaymentMethod;
    notes: string;
}

interface InvoiceItem {
    title: string;
    quantity: number;
    unitPrice: string;
    originalTotal: string;
    discount: string;
    discountCents: number;
    total: string;
}

interface InvoiceDetails {
    number: string;
    createdAt: string;
    customerName: string;
    customerEmail: string | null;
    customerPhone: string;
    shippingAddress: string[];
    billingAddress: string[];
    billingSameAsShipping: boolean;
    paymentLabel: string;
    items: InvoiceItem[];
    subtotal: string;
    discount: string;
    discountCents: number;
    delivery: string;
    deliveryLabel: string;
    total: string;
    notes?: string;
}

const defaultDeliveryZones: Record<DeliveryZone, { label: string; priceCents: number; price: string }> = {
    inside_tripoli: {
        label: 'Inside Tripoli',
        priceCents: 0,
        price: '$0.00',
    },
    outside_tripoli: {
        label: 'Outside Tripoli',
        priceCents: 0,
        price: '$0.00',
    },
};

const deliveryZoneOptions: Array<{ value: DeliveryZone; description: string }> = [
    {
        value: 'inside_tripoli',
        description: 'Delivery address is within Tripoli city.',
    },
    {
        value: 'outside_tripoli',
        description: 'Delivery address is outside Tripoli.',
    },
];

const checkoutSteps: Array<{ step: CheckoutStep; title: string; description: string }> = [
    {
        step: 'items',
        title: 'Cart',
        description: 'Review items and prices',
    },
    {
        step: 'customer',
        title: 'Details',
        description: 'Customer, address, payment',
    },
    {
        step: 'review',
        title: 'Review',
        description: 'Confirm and submit',
    },
];

const paymentOptions: Array<{ value: PaymentMethod; title: string; description: string }> = [
    {
        value: 'cash_on_delivery',
        title: 'Cash on delivery',
        description: 'Pay in cash when your order is delivered.',
    },
    {
        value: 'which_gateway',
        title: 'Which gateway',
        description: 'Frontend placeholder until the Lebanon payment gateway access is connected.',
    },
];

const emptyAddress: CheckoutAddress = {
    full_name: '',
    line_one: '',
    line_two: '',
    city: '',
    region: '',
    country: 'Lebanon',
};

const initialCheckoutForm: CheckoutForm = {
    order_number: '',
    items: [],
    delivery_zone: 'inside_tripoli',
    customer: {
        name: '',
        email: '',
        phone: '',
    },
    shipping_address: { ...emptyAddress },
    billing_same_as_shipping: true,
    billing_address: { ...emptyAddress },
    payment_method: 'cash_on_delivery',
    notes: '',
};

function createOrderNumber() {
    const now = new Date();
    const year = String(now.getFullYear()).slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const randomValues = new Uint8Array(6);

    if (globalThis.crypto?.getRandomValues) {
        globalThis.crypto.getRandomValues(randomValues);
    } else {
        for (let index = 0; index < randomValues.length; index += 1) {
            randomValues[index] = Math.floor(Math.random() * 256);
        }
    }

    const suffix = Array.from(randomValues, (value) => alphabet[value % alphabet.length]).join('');

    return `MAZ-${year}${month}${day}-${suffix}`;
}

function RequiredMark() {
    return (
        <>
            <span aria-hidden="true" className="ml-1 text-[#a0432f]">
                *
            </span>
            <span className="sr-only"> required</span>
        </>
    );
}

function Field({
    id,
    label,
    value,
    onChange,
    error,
    type = 'text',
    required = false,
    autoComplete,
    readOnly = false,
}: {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    type?: string;
    required?: boolean;
    autoComplete?: string;
    readOnly?: boolean;
}) {
    return (
        <div className="grid gap-3">
            <Label htmlFor={id} className="text-[14px] font-medium tracking-[0.12em] text-[#123b6d] uppercase">
                {label}
                {required ? <RequiredMark /> : null}
            </Label>
            <Input
                id={id}
                type={type}
                required={required}
                autoComplete={autoComplete}
                value={value}
                readOnly={readOnly}
                onChange={(event) => onChange(event.target.value)}
                className="h-[54px] rounded-none border-[#c9ced6] bg-white px-4 text-[16px] text-[#404651] read-only:bg-[#f8f8f8] read-only:text-[#5c626d] focus-visible:ring-[#123b6d]"
            />
            <InputError message={error} />
        </div>
    );
}

function PhoneField({ value, onChange, error }: { value: string; onChange: (value: string) => void; error?: string }) {
    return (
        <div className="grid gap-3">
            <Label htmlFor="customer-phone" className="text-[14px] font-medium tracking-[0.12em] text-[#123b6d] uppercase">
                Phone
                <RequiredMark />
            </Label>
            <div className="flex h-[54px] border border-[#c9ced6] bg-white focus-within:border-[#123b6d]">
                <span className="flex items-center border-r border-[#c9ced6] bg-[#f8f8f8] px-4 text-[16px] font-medium text-[#123b6d]">+961</span>
                <input
                    id="customer-phone"
                    type="tel"
                    required
                    inputMode="numeric"
                    pattern="[0-9]{8}"
                    maxLength={8}
                    autoComplete="tel-national"
                    value={value}
                    onChange={(event) => onChange(event.target.value.replace(/\D/g, '').slice(0, 8))}
                    className="h-full min-w-0 flex-1 px-4 text-[16px] text-[#404651] outline-none"
                    aria-describedby={error ? 'customer-phone-error' : undefined}
                />
            </div>
            <p className="text-[13px] leading-5 text-[#5c626d]">Enter 8 digits without the country code.</p>
            <InputError message={error} />
        </div>
    );
}

function AddressFields({
    idPrefix,
    address,
    errors,
    onChange,
}: {
    idPrefix: string;
    address: CheckoutAddress;
    errors: Record<string, string | undefined>;
    onChange: (field: keyof CheckoutAddress, value: string) => void;
}) {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Field
                id={`${idPrefix}-full-name`}
                label="Full name"
                value={address.full_name}
                onChange={(value) => onChange('full_name', value)}
                error={errors[`${idPrefix}.full_name`]}
                required
                autoComplete="name"
            />
            <Field
                id={`${idPrefix}-country`}
                label="Country"
                value={address.country}
                onChange={() => onChange('country', 'Lebanon')}
                error={errors[`${idPrefix}.country`]}
                required
                autoComplete="country-name"
                readOnly
            />
            <div className="md:col-span-2">
                <Field
                    id={`${idPrefix}-line-one`}
                    label="Address"
                    value={address.line_one}
                    onChange={(value) => onChange('line_one', value)}
                    error={errors[`${idPrefix}.line_one`]}
                    required
                    autoComplete="address-line1"
                />
            </div>
            <div className="md:col-span-2">
                <Field
                    id={`${idPrefix}-line-two`}
                    label="Apartment, floor"
                    value={address.line_two}
                    onChange={(value) => onChange('line_two', value)}
                    error={errors[`${idPrefix}.line_two`]}
                    autoComplete="address-line2"
                />
            </div>
            <Field
                id={`${idPrefix}-city`}
                label="City"
                value={address.city}
                onChange={(value) => onChange('city', value)}
                error={errors[`${idPrefix}.city`]}
                required
                autoComplete="address-level2"
            />
            <Field
                id={`${idPrefix}-region`}
                label="Area / region"
                value={address.region}
                onChange={(value) => onChange('region', value)}
                error={errors[`${idPrefix}.region`]}
                required
                autoComplete="address-level1"
            />
        </div>
    );
}

function DeliveryZoneSelector({
    value,
    zones,
    error,
    onChange,
}: {
    value: DeliveryZone;
    zones: Record<DeliveryZone, { label: string; priceCents: number; price: string }>;
    error?: string;
    onChange: (value: DeliveryZone) => void;
}) {
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-[14px] font-medium tracking-[0.12em] text-[#123b6d] uppercase">
                    Delivery area
                    <RequiredMark />
                </h3>
                <p className="mt-2 text-[15px] leading-6 text-[#5c626d]">
                    Choose where the order will be delivered. The delivery cost updates automatically.
                </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                {deliveryZoneOptions.map((option) => {
                    const zone = zones[option.value];
                    const isSelected = value === option.value;

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onChange(option.value)}
                            className={[
                                'flex min-h-[118px] flex-col items-start border p-5 text-left transition-colors',
                                isSelected ? 'border-[#123b6d] bg-[#f8fbff]' : 'border-[#d9dde2] bg-white hover:border-[#123b6d]',
                            ].join(' ')}
                            aria-pressed={isSelected}
                        >
                            <span className="flex w-full items-start justify-between gap-4">
                                <span className="text-[18px] font-medium text-[#123b6d]">{zone.label}</span>
                                <span className="text-[18px] font-medium text-[#a0432f]">{zone.price}</span>
                            </span>
                            <span className="mt-4 text-[15px] leading-6 text-[#5c626d]">{option.description}</span>
                        </button>
                    );
                })}
            </div>
            <InputError message={error} />
        </div>
    );
}

function paymentLabel(method: PaymentMethod | string) {
    return paymentOptions.find((option) => option.value === method)?.title ?? method;
}

function lebanonPhoneDisplay(phone: string) {
    const digits = phone.replace(/\D/g, '');

    if (digits.length === 8) {
        return `+961 ${digits}`;
    }

    if (digits.startsWith('961') && digits.length === 11) {
        return `+${digits.slice(0, 3)} ${digits.slice(3)}`;
    }

    return phone;
}

function lineDisplayTitle(item: Pick<CartItem, 'productSlug' | 'quantity' | 'title'>) {
    if (item.productSlug === singleKitSlug && item.quantity > 1) {
        return `${item.quantity} Single Kits`;
    }

    return item.title;
}

function printFileTitle(invoice: InvoiceDetails) {
    const customerName = invoice.customerName
        .replace(/[\\/:*?"<>|]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    return `${customerName || 'Customer'} - MAZ order`;
}

function printInvoice(invoice: InvoiceDetails) {
    const originalTitle = document.title;
    const restoreState: { timer?: number } = {};
    let restored = false;

    const restoreTitle = () => {
        if (restored) {
            return;
        }

        restored = true;
        document.title = originalTitle;
        window.removeEventListener('afterprint', restoreTitle);

        if (restoreState.timer) {
            window.clearTimeout(restoreState.timer);
        }
    };

    document.title = printFileTitle(invoice);
    window.addEventListener('afterprint', restoreTitle, { once: true });
    window.print();
    restoreState.timer = window.setTimeout(restoreTitle, 1500);
}

function addressLines(address: CheckoutAddress) {
    return [address.full_name, address.line_one, address.line_two, [address.city, address.region].filter(Boolean).join(', '), address.country].filter(
        Boolean,
    );
}

function isAddressComplete(address: CheckoutAddress) {
    return Boolean(address.full_name.trim() && address.line_one.trim() && address.city.trim() && address.region.trim() && address.country.trim());
}

function isCustomerStepComplete(data: CheckoutForm) {
    const billingIsComplete = data.billing_same_as_shipping || isAddressComplete(data.billing_address);

    return Boolean(
        data.customer.name.trim() &&
            /^\d{8}$/.test(data.customer.phone.trim()) &&
            data.delivery_zone &&
            isAddressComplete(data.shipping_address) &&
            data.payment_method &&
            billingIsComplete,
    );
}

function StepIndicator({ activeStep }: { activeStep: CheckoutStep }) {
    const activeIndex = checkoutSteps.findIndex((step) => step.step === activeStep);

    return (
        <ol className="mx-auto mt-14 grid max-w-[980px] gap-4 md:grid-cols-3">
            {checkoutSteps.map((step, index) => {
                const isCurrent = step.step === activeStep;
                const isComplete = index < activeIndex;

                return (
                    <li
                        key={step.step}
                        className={[
                            'border px-5 py-4',
                            isCurrent ? 'border-[#123b6d] bg-[#f8fbff]' : 'border-[#d9dde2] bg-white',
                            isComplete ? 'border-[#c9ded2] bg-[#f4fbf6]' : '',
                        ].join(' ')}
                    >
                        <div className="flex items-center gap-4">
                            <span
                                className={[
                                    'flex size-9 shrink-0 items-center justify-center border text-[14px] font-medium',
                                    isCurrent || isComplete ? 'border-[#123b6d] bg-[#123b6d] text-white' : 'border-[#c9ced6] text-[#123b6d]',
                                ].join(' ')}
                            >
                                {isComplete ? <CheckCircle2 className="size-5" aria-hidden="true" /> : index + 1}
                            </span>
                            <span>
                                <span className="block text-[14px] font-medium tracking-[0.16em] text-[#123b6d] uppercase">{step.title}</span>
                                <span className="mt-1 block text-[14px] text-[#5c626d]">{step.description}</span>
                            </span>
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}

function InvoicePanel({ invoice }: { invoice: InvoiceDetails }) {
    return (
        <section className="maz-print-invoice border border-[#d9dde2] bg-white p-8 text-[#404651]">
            <div className="maz-invoice-header flex flex-col gap-8 border-b border-[#d9dde2] pb-8 md:flex-row md:items-start md:justify-between">
                <div>
                    <div className="maz-invoice-logo font-['Cormorant_Garamond'] text-[58px] leading-none font-medium text-black">MAZ</div>
                    <p className="maz-invoice-kicker mt-4 text-[14px] tracking-[0.18em] text-[#123b6d] uppercase">Order invoice</p>
                    <p className="maz-invoice-number mt-3 text-[15px] font-medium text-[#123b6d]">Order number: {invoice.number}</p>
                </div>
                <div className="text-left text-[15px] leading-7 md:text-right">
                    <p>
                        <span className="font-medium text-[#123b6d]">Date:</span> {invoice.createdAt}
                    </p>
                </div>
            </div>

            <div className="maz-invoice-address-grid grid gap-8 border-b border-[#d9dde2] py-8 md:grid-cols-3">
                <div>
                    <h3 className="text-[13px] font-medium tracking-[0.16em] text-[#123b6d] uppercase">Customer</h3>
                    <div className="mt-4 space-y-1 text-[15px] leading-7">
                        <p>{invoice.customerName}</p>
                        {invoice.customerEmail ? <p>{invoice.customerEmail}</p> : null}
                        <p>{invoice.customerPhone}</p>
                    </div>
                </div>
                <div>
                    <h3 className="text-[13px] font-medium tracking-[0.16em] text-[#123b6d] uppercase">Shipping</h3>
                    <div className="mt-4 space-y-1 text-[15px] leading-7">
                        {invoice.shippingAddress.map((line) => (
                            <p key={line}>{line}</p>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-[13px] font-medium tracking-[0.16em] text-[#123b6d] uppercase">Billing</h3>
                    <div className="mt-4 space-y-1 text-[15px] leading-7">
                        {invoice.billingSameAsShipping ? (
                            <p>Same as shipping address</p>
                        ) : (
                            invoice.billingAddress.map((line) => <p key={line}>{line}</p>)
                        )}
                    </div>
                </div>
            </div>

            <div className="maz-invoice-items border-b border-[#d9dde2] py-8">
                <div className="maz-invoice-items-header hidden grid-cols-[1fr_100px_130px_130px] gap-4 border-b border-[#edf0f3] pb-4 text-[13px] font-medium tracking-[0.16em] text-[#123b6d] uppercase md:grid">
                    <span>Item</span>
                    <span className="text-center">Qty</span>
                    <span className="text-right">Unit</span>
                    <span className="text-right">Total</span>
                </div>
                <div className="divide-y divide-[#edf0f3]">
                    {invoice.items.map((item) => (
                        <div
                            key={item.title}
                            className="maz-invoice-item-row grid gap-3 py-5 text-[16px] md:grid-cols-[1fr_100px_130px_130px] md:gap-4"
                        >
                            <span>
                                <span className="block font-medium text-[#123b6d]">{item.title}</span>
                                {item.discountCents > 0 ? (
                                    <span className="mt-2 block text-[14px] leading-6 text-[#5c626d]">
                                        Original: {item.originalTotal}
                                        <br />
                                        Discount: -{item.discount}
                                    </span>
                                ) : null}
                            </span>
                            <span className="md:text-center">Qty: {item.quantity}</span>
                            <span className="md:text-right">{item.unitPrice}</span>
                            <span className="font-medium md:text-right">{item.total}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="maz-invoice-totals mt-8 w-full space-y-4 text-[17px]">
                <div className="flex justify-between gap-6">
                    <span>Subtotal</span>
                    <span>{invoice.subtotal}</span>
                </div>
                {invoice.discountCents > 0 ? (
                    <div className="flex justify-between gap-6 text-[#a0432f]">
                        <span>Bundle discount</span>
                        <span>-{invoice.discount}</span>
                    </div>
                ) : null}
                <div className="flex justify-between gap-6">
                    <span>Delivery ({invoice.deliveryLabel})</span>
                    <span>{invoice.delivery}</span>
                </div>
                <div className="flex justify-between gap-6">
                    <span>Payment</span>
                    <span>{invoice.paymentLabel}</span>
                </div>
                <div className="maz-invoice-total flex justify-between gap-6 border-t border-[#d9dde2] pt-5 text-[24px] font-medium text-[#123b6d]">
                    <span>Total</span>
                    <span>{invoice.total}</span>
                </div>
            </div>

            {invoice.notes ? (
                <div className="maz-invoice-notes mt-8 border-t border-[#d9dde2] pt-6">
                    <h3 className="text-[13px] font-medium tracking-[0.16em] text-[#123b6d] uppercase">Notes</h3>
                    <p className="mt-3 text-[15px] leading-7">{invoice.notes}</p>
                </div>
            ) : null}
        </section>
    );
}

function InvoicePrintDocument({ invoice }: { invoice: InvoiceDetails }) {
    if (typeof document === 'undefined') {
        return null;
    }

    return createPortal(
        <div className="maz-print-document" aria-hidden="true">
            <InvoicePanel invoice={invoice} />
        </div>,
        document.body,
    );
}

function SubmittedOrder({ invoice, successMessage }: { invoice: InvoiceDetails; successMessage?: string }) {
    return (
        <section className="mx-auto mt-20 max-w-[1100px]">
            <div className="maz-no-print border border-[#c9ded2] bg-[#f4fbf6] px-7 py-6 text-center text-[17px] leading-7 text-[#235334]">
                <p className="font-medium">{successMessage ?? 'Thank you. Your order has been submitted.'}</p>
                <p className="mt-2">
                    Order {invoice.number} was received. Total: {invoice.total}
                </p>
                <div className="mt-7 flex flex-col justify-center gap-4 sm:flex-row">
                    <Button
                        type="button"
                        onClick={() => printInvoice(invoice)}
                        className="h-[52px] rounded-none bg-[#123b6d] px-8 text-[13px] font-medium tracking-[0.18em] text-white hover:bg-[#0f315b]"
                    >
                        <Printer className="size-4" aria-hidden="true" />
                        PRINT INVOICE
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        className="h-[52px] rounded-none border-[#123b6d] px-8 text-[13px] font-medium tracking-[0.18em] text-[#123b6d] hover:bg-[#123b6d] hover:text-white"
                    >
                        <Link href="/#kit-options">CONTINUE SHOPPING</Link>
                    </Button>
                </div>
            </div>

            <div className="mt-10">
                <InvoicePanel invoice={invoice} />
            </div>
        </section>
    );
}

export function CartPage() {
    const { items, subtotalCents, discountCents, totalCents, updateQuantity, removeItem, clearCart } = useCart();
    const { deliverySettings, flash } = usePage<SharedData>().props;
    const [activeStep, setActiveStep] = useState<CheckoutStep>('items');
    const [draftOrderNumber, setDraftOrderNumber] = useState(createOrderNumber);
    const deliveryZones = useMemo(
        () => ({
            inside_tripoli: deliverySettings?.zones.inside_tripoli ?? defaultDeliveryZones.inside_tripoli,
            outside_tripoli: deliverySettings?.zones.outside_tripoli ?? defaultDeliveryZones.outside_tripoli,
        }),
        [deliverySettings],
    );
    const orderItems = useMemo(
        () =>
            items.map((item) => ({
                product_slug: item.productSlug,
                quantity: item.quantity,
            })),
        [items],
    );
    const { data, setData, post, processing, errors, reset } = useForm<CheckoutForm>(initialCheckoutForm);
    const selectedDeliveryZone = deliveryZones[data.delivery_zone] ?? deliveryZones.inside_tripoli;
    const deliveryCents = selectedDeliveryZone.priceCents;
    const deliveryLabel = selectedDeliveryZone.label;
    const fieldErrors = errors as Record<string, string | undefined>;
    const orderFlash = flash?.order;
    const canReviewOrder = isCustomerStepComplete(data);

    useEffect(() => {
        setData('items', orderItems);
    }, [orderItems, setData]);

    useEffect(() => {
        setData('order_number', draftOrderNumber);
    }, [draftOrderNumber, setData]);

    useEffect(() => {
        if (items.length === 0 && !orderFlash) {
            setActiveStep('items');
        }
    }, [items.length, orderFlash]);

    const updateShippingAddress = (field: keyof CheckoutAddress, value: string) => {
        setData('shipping_address', { ...data.shipping_address, [field]: value });
    };

    const updateBillingAddress = (field: keyof CheckoutAddress, value: string) => {
        setData('billing_address', { ...data.billing_address, [field]: value });
    };

    const reviewInvoice: InvoiceDetails = {
        number: draftOrderNumber,
        createdAt: new Date().toLocaleDateString('en-US'),
        customerName: data.customer.name || 'Customer name',
        customerEmail: data.customer.email,
        customerPhone: data.customer.phone ? lebanonPhoneDisplay(data.customer.phone) : 'Phone number',
        shippingAddress: addressLines(data.shipping_address),
        billingAddress: data.billing_same_as_shipping ? [] : addressLines(data.billing_address),
        billingSameAsShipping: data.billing_same_as_shipping,
        paymentLabel: paymentLabel(data.payment_method),
        items: items.map((item) => {
            const itemDiscountCents = lineDiscountCents(item);

            return {
                title: lineDisplayTitle(item),
                quantity: item.quantity,
                unitPrice: formatMoney(item.priceCents),
                originalTotal: formatMoney(lineOriginalTotalCents(item)),
                discount: formatMoney(itemDiscountCents),
                discountCents: itemDiscountCents,
                total: formatMoney(lineTotalCents(item)),
            };
        }),
        subtotal: formatMoney(subtotalCents),
        discount: formatMoney(discountCents),
        discountCents,
        delivery: formatMoney(deliveryCents),
        deliveryLabel,
        total: formatMoney(totalCents + deliveryCents),
        notes: data.notes,
    };

    const submittedInvoice = orderFlash
        ? ({
              number: orderFlash.number,
              createdAt: orderFlash.created_at,
              customerName: orderFlash.customer.name,
              customerEmail: orderFlash.customer.email,
              customerPhone: orderFlash.customer.phone,
              shippingAddress: orderFlash.shipping_address.lines,
              billingAddress: orderFlash.billing_address?.lines ?? [],
              billingSameAsShipping: orderFlash.billing_same_as_shipping,
              paymentLabel: orderFlash.payment_label,
              items: orderFlash.items.map((item) => ({
                  title: item.title,
                  quantity: item.quantity,
                  unitPrice: item.unit_price,
                  originalTotal: item.original_total,
                  discount: item.discount,
                  discountCents: item.discount_cents,
                  total: item.total,
              })),
              subtotal: orderFlash.subtotal,
              discount: orderFlash.discount,
              discountCents: orderFlash.discount_cents,
              delivery: orderFlash.delivery,
              deliveryLabel: orderFlash.delivery_label ?? 'Inside Tripoli',
              total: orderFlash.total,
              notes: orderFlash.notes ?? undefined,
          } satisfies InvoiceDetails)
        : null;

    const submitOrder: FormEventHandler = (event) => {
        event.preventDefault();

        if (items.length === 0 || activeStep !== 'review') {
            return;
        }

        post('/orders', {
            preserveScroll: true,
            onError: (serverErrors) => {
                const hasItemErrors = Object.keys(serverErrors).some((key) => key.startsWith('items'));

                setActiveStep(hasItemErrors ? 'items' : 'customer');
            },
            onSuccess: () => {
                clearCart();
                reset();
                setDraftOrderNumber(createOrderNumber());
                setActiveStep('items');
            },
        });
    };

    const printableInvoice = submittedInvoice ?? (activeStep === 'review' ? reviewInvoice : null);

    return (
        <ShopLayout>
            <Head title="Cart" />
            {printableInvoice ? <InvoicePrintDocument invoice={printableInvoice} /> : null}

            <main className="bg-white px-6 py-24 md:px-10 md:py-32">
                <div className="mx-auto max-w-[1500px]">
                    <div className="maz-no-print mx-auto max-w-[780px] text-center">
                        <h1 className="font-['Cormorant_Garamond'] text-[58px] leading-none font-medium text-[#123b6d] md:text-[76px]">
                            Cart & Checkout
                        </h1>
                        <p className="mt-7 text-[18px] leading-8 text-[#4a4f58]">Review your cart, complete your details, then confirm the order.</p>
                    </div>

                    {submittedInvoice ? (
                        <SubmittedOrder invoice={submittedInvoice} successMessage={flash?.success} />
                    ) : items.length === 0 ? (
                        <section className="maz-no-print mx-auto mt-20 max-w-[760px] border border-[#d9dde2] px-8 py-16 text-center">
                            <h2 className="font-['Cormorant_Garamond'] text-[42px] leading-none font-medium text-[#123b6d]">Your cart is empty</h2>
                            <p className="mt-6 text-[18px] leading-8 text-[#4a4f58]">Add a kit to start your order.</p>
                            <Button
                                asChild
                                className="mt-9 h-[56px] rounded-none bg-[#123b6d] px-9 text-[13px] font-medium tracking-[0.18em] text-white hover:bg-[#0f315b]"
                            >
                                <Link href="/#kit-options">SHOP KITS</Link>
                            </Button>
                        </section>
                    ) : (
                        <form onSubmit={submitOrder} className="maz-no-print mt-18">
                            <StepIndicator activeStep={activeStep} />

                            {activeStep === 'items' ? (
                                <section className="mx-auto mt-20 max-w-[1180px]">
                                    <div className="flex items-end justify-between gap-6 border-b border-[#d9dde2] pb-6">
                                        <div>
                                            <h2 className="font-['Cormorant_Garamond'] text-[42px] leading-none font-medium text-[#123b6d]">
                                                Phase 1: Items
                                            </h2>
                                            <p className="mt-4 text-[17px] leading-7 text-[#4a4f58]">Delivery is not included in this phase.</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={clearCart}
                                            className="text-[13px] font-medium tracking-[0.16em] text-[#123b6d] uppercase hover:text-[#0f315b]"
                                        >
                                            Clear cart
                                        </button>
                                    </div>

                                    <div className="divide-y divide-[#edf0f3]">
                                        {items.map((item) => {
                                            const itemDiscountCents = lineDiscountCents(item);
                                            const itemOriginalTotalCents = lineOriginalTotalCents(item);
                                            const itemTotalCents = lineTotalCents(item);

                                            return (
                                                <article key={item.productSlug} className="grid gap-6 py-8 sm:grid-cols-[150px_1fr]">
                                                    <div className="flex aspect-square items-center justify-center bg-[#f4f1ed] px-4">
                                                        <img
                                                            src={item.imageSrc}
                                                            alt={item.imageAlt}
                                                            decoding="async"
                                                            loading="lazy"
                                                            className="max-h-full max-w-full object-contain"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                                                        <div>
                                                            <h3 className="font-['Cormorant_Garamond'] text-[34px] leading-none font-medium text-[#123b6d]">
                                                                {lineDisplayTitle(item)}
                                                            </h3>
                                                            <p className="mt-4 text-[17px] tracking-[0.14em] text-[#123b6d]">
                                                                {formatMoney(item.priceCents)}
                                                            </p>
                                                            {itemDiscountCents > 0 ? (
                                                                <div className="mt-4 space-y-1 text-[15px] leading-6 text-[#5c626d]">
                                                                    <p>Original: {formatMoney(itemOriginalTotalCents)}</p>
                                                                    <p className="text-[#a0432f]">Discount: -{formatMoney(itemDiscountCents)}</p>
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-5">
                                                            <QuantityControl
                                                                quantity={item.quantity}
                                                                min={1}
                                                                onChange={(quantity) => updateQuantity(item.productSlug, quantity)}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeItem(item.productSlug)}
                                                                className="flex size-11 items-center justify-center border border-[#c9ced6] text-[#123b6d] transition-colors hover:border-[#123b6d] hover:bg-[#123b6d] hover:text-white"
                                                                aria-label={`Remove ${item.title}`}
                                                            >
                                                                <Trash2 className="size-5" aria-hidden="true" />
                                                            </button>
                                                            <div className="min-w-[120px] text-right">
                                                                <p className="text-[18px] font-medium text-[#404651]">
                                                                    {formatMoney(itemTotalCents)}
                                                                </p>
                                                                {itemDiscountCents > 0 ? (
                                                                    <p className="mt-1 text-[13px] tracking-[0.12em] text-[#123b6d] uppercase">
                                                                        Bundle total
                                                                    </p>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </article>
                                            );
                                        })}
                                    </div>
                                    <InputError message={fieldErrors.items} />

                                    <div className="mt-10 flex flex-col gap-6 border-t border-[#d9dde2] pt-8 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-[14px] font-medium tracking-[0.16em] text-[#123b6d] uppercase">Items subtotal</p>
                                            <p className="mt-2 text-[34px] font-medium text-[#123b6d]">{formatMoney(subtotalCents)}</p>
                                            {discountCents > 0 ? (
                                                <p className="mt-2 text-[17px] text-[#a0432f]">Bundle discount: -{formatMoney(discountCents)}</p>
                                            ) : null}
                                            <p className="mt-5 text-[15px] font-medium tracking-[0.16em] text-[#123b6d] uppercase">Cart total</p>
                                            <p className="mt-2 text-[42px] leading-none font-semibold text-[#123b6d]">{formatMoney(totalCents)}</p>
                                            <p className="mt-2 text-[15px] text-[#5c626d]">Delivery cost is selected in the shipping step.</p>
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={() => setActiveStep('customer')}
                                            className="h-[58px] rounded-none bg-[#123b6d] px-10 text-[13px] font-medium tracking-[0.18em] text-white hover:bg-[#0f315b]"
                                        >
                                            CONTINUE TO DETAILS
                                        </Button>
                                    </div>
                                </section>
                            ) : null}

                            {activeStep === 'customer' ? (
                                <section className="mx-auto mt-20 grid max-w-[1320px] gap-12 lg:grid-cols-[1fr_380px]">
                                    <div className="space-y-14">
                                        <section className="space-y-8">
                                            <h2 className="font-['Cormorant_Garamond'] text-[42px] leading-none font-medium text-[#123b6d]">
                                                Phase 2: Customer Information
                                            </h2>
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <Field
                                                    id="customer-name"
                                                    label="Name"
                                                    value={data.customer.name}
                                                    onChange={(value) => setData('customer', { ...data.customer, name: value })}
                                                    error={fieldErrors['customer.name']}
                                                    required
                                                    autoComplete="name"
                                                />
                                                <Field
                                                    id="customer-email"
                                                    label="Email"
                                                    type="email"
                                                    value={data.customer.email}
                                                    onChange={(value) => setData('customer', { ...data.customer, email: value })}
                                                    error={fieldErrors['customer.email']}
                                                    autoComplete="email"
                                                />
                                                <PhoneField
                                                    value={data.customer.phone}
                                                    onChange={(value) => setData('customer', { ...data.customer, phone: value })}
                                                    error={fieldErrors['customer.phone']}
                                                />
                                            </div>
                                        </section>

                                        <section className="space-y-8">
                                            <h2 className="font-['Cormorant_Garamond'] text-[42px] leading-none font-medium text-[#123b6d]">
                                                Shipping Address
                                            </h2>
                                            <AddressFields
                                                idPrefix="shipping_address"
                                                address={data.shipping_address}
                                                errors={fieldErrors}
                                                onChange={updateShippingAddress}
                                            />
                                            <DeliveryZoneSelector
                                                value={data.delivery_zone}
                                                zones={deliveryZones}
                                                error={fieldErrors.delivery_zone}
                                                onChange={(value) => setData('delivery_zone', value)}
                                            />
                                        </section>

                                        <section className="space-y-8">
                                            <div className="flex items-center gap-4">
                                                <Checkbox
                                                    id="billing-different"
                                                    checked={!data.billing_same_as_shipping}
                                                    onCheckedChange={(checked) => setData('billing_same_as_shipping', checked !== true)}
                                                    className="border-[#123b6d] data-[state=checked]:border-[#123b6d] data-[state=checked]:bg-[#123b6d]"
                                                />
                                                <Label htmlFor="billing-different" className="text-[18px] font-normal text-[#404651]">
                                                    Billing address is different from shipping address
                                                </Label>
                                            </div>

                                            {!data.billing_same_as_shipping ? (
                                                <AddressFields
                                                    idPrefix="billing_address"
                                                    address={data.billing_address}
                                                    errors={fieldErrors}
                                                    onChange={updateBillingAddress}
                                                />
                                            ) : null}
                                        </section>

                                        <section className="space-y-6">
                                            <h2 className="font-['Cormorant_Garamond'] text-[42px] leading-none font-medium text-[#123b6d]">
                                                Payment
                                                <RequiredMark />
                                            </h2>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                {paymentOptions.map((option) => {
                                                    const isSelected = data.payment_method === option.value;

                                                    return (
                                                        <button
                                                            key={option.value}
                                                            type="button"
                                                            onClick={() => setData('payment_method', option.value)}
                                                            className={[
                                                                'flex min-h-[140px] flex-col items-start border p-6 text-left transition-colors',
                                                                isSelected
                                                                    ? 'border-[#123b6d] bg-[#f8fbff]'
                                                                    : 'border-[#d9dde2] bg-white hover:border-[#123b6d]',
                                                            ].join(' ')}
                                                            aria-pressed={isSelected}
                                                        >
                                                            <span
                                                                className={[
                                                                    'mb-5 flex size-10 items-center justify-center border',
                                                                    isSelected
                                                                        ? 'border-[#123b6d] bg-[#123b6d] text-white'
                                                                        : 'border-[#c9ced6] text-[#123b6d]',
                                                                ].join(' ')}
                                                            >
                                                                <CreditCard className="size-5" aria-hidden="true" />
                                                            </span>
                                                            <span className="text-[18px] font-medium text-[#123b6d]">{option.title}</span>
                                                            <span className="mt-3 text-[15px] leading-6 text-[#5c626d]">{option.description}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <InputError message={fieldErrors.payment_method} />
                                        </section>

                                        <section className="space-y-4">
                                            <Label
                                                htmlFor="order-notes"
                                                className="text-[14px] font-medium tracking-[0.12em] text-[#123b6d] uppercase"
                                            >
                                                Delivery notes
                                            </Label>
                                            <textarea
                                                id="order-notes"
                                                value={data.notes}
                                                onChange={(event) => setData('notes', event.target.value)}
                                                className="min-h-[130px] w-full resize-y border border-[#c9ced6] bg-white px-4 py-4 text-[16px] text-[#404651] focus:border-[#123b6d] focus:outline-none"
                                            />
                                            <InputError message={fieldErrors.notes} />
                                        </section>
                                    </div>

                                    <aside className="h-fit border border-[#d9dde2] p-8 lg:sticky lg:top-10">
                                        <h2 className="font-['Cormorant_Garamond'] text-[38px] leading-none font-medium text-[#123b6d]">
                                            Phase Summary
                                        </h2>
                                        <div className="mt-8 space-y-5 border-b border-[#d9dde2] pb-8 text-[17px] text-[#404651]">
                                            <div className="flex justify-between gap-6">
                                                <span>Items</span>
                                                <span>{formatMoney(subtotalCents)}</span>
                                            </div>
                                            {discountCents > 0 ? (
                                                <div className="flex justify-between gap-6 text-[#a0432f]">
                                                    <span>Bundle discount</span>
                                                    <span>-{formatMoney(discountCents)}</span>
                                                </div>
                                            ) : null}
                                            <div className="flex justify-between gap-6">
                                                <span>Cart total</span>
                                                <span>{formatMoney(totalCents)}</span>
                                            </div>
                                            <div className="flex justify-between gap-6">
                                                <span>Delivery ({deliveryLabel})</span>
                                                <span>{formatMoney(deliveryCents)}</span>
                                            </div>
                                            <div className="flex justify-between gap-6">
                                                <span>Payment</span>
                                                <span>{paymentLabel(data.payment_method)}</span>
                                            </div>
                                        </div>
                                        <div className="mt-8 flex justify-between gap-6 text-[22px] font-medium text-[#123b6d]">
                                            <span>Total</span>
                                            <span>{formatMoney(totalCents + deliveryCents)}</span>
                                        </div>
                                        <div className="mt-8 flex flex-col gap-4">
                                            <Button
                                                type="button"
                                                onClick={() => setActiveStep('review')}
                                                disabled={!canReviewOrder}
                                                className="h-[58px] rounded-none bg-[#123b6d] text-[13px] font-medium tracking-[0.18em] text-white hover:bg-[#0f315b] disabled:cursor-not-allowed disabled:opacity-45"
                                            >
                                                REVIEW ORDER
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setActiveStep('items')}
                                                className="h-[52px] rounded-none border-[#123b6d] text-[13px] font-medium tracking-[0.18em] text-[#123b6d] hover:bg-[#123b6d] hover:text-white"
                                            >
                                                BACK TO CART
                                            </Button>
                                        </div>
                                        {!canReviewOrder ? (
                                            <p className="mt-6 text-[14px] leading-6 text-[#5c626d]">
                                                Complete customer, shipping, billing if needed, and payment details to continue.
                                            </p>
                                        ) : null}
                                    </aside>
                                </section>
                            ) : null}

                            {activeStep === 'review' ? (
                                <section className="mx-auto mt-20 grid max-w-[1320px] gap-12 lg:grid-cols-[1fr_410px]">
                                    <div>
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                            <div>
                                                <h2 className="font-['Cormorant_Garamond'] text-[42px] leading-none font-medium text-[#123b6d]">
                                                    Phase 3: Review Order
                                                </h2>
                                                <p className="mt-4 text-[17px] leading-7 text-[#4a4f58]">
                                                    Confirm the order details, print the invoice if needed, then submit.
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => printInvoice(reviewInvoice)}
                                                className="h-[52px] rounded-none border-[#123b6d] px-7 text-[13px] font-medium tracking-[0.18em] text-[#123b6d] hover:bg-[#123b6d] hover:text-white"
                                            >
                                                <Printer className="size-4" aria-hidden="true" />
                                                PRINT INVOICE
                                            </Button>
                                        </div>

                                        <div className="mt-10">
                                            <InvoicePanel invoice={reviewInvoice} />
                                        </div>
                                    </div>

                                    <aside className="h-fit border border-[#d9dde2] p-8 lg:sticky lg:top-10">
                                        <h2 className="font-['Cormorant_Garamond'] text-[38px] leading-none font-medium text-[#123b6d]">Submit</h2>
                                        <div className="mt-8 space-y-5 border-b border-[#d9dde2] pb-8 text-[18px] text-[#404651]">
                                            <div className="flex justify-between gap-6">
                                                <span>Subtotal</span>
                                                <span>{reviewInvoice.subtotal}</span>
                                            </div>
                                            {reviewInvoice.discountCents > 0 ? (
                                                <div className="flex justify-between gap-6 text-[#a0432f]">
                                                    <span>Bundle discount</span>
                                                    <span>-{reviewInvoice.discount}</span>
                                                </div>
                                            ) : null}
                                            <div className="flex justify-between gap-6">
                                                <span>Delivery ({reviewInvoice.deliveryLabel})</span>
                                                <span>{reviewInvoice.delivery}</span>
                                            </div>
                                            <div className="flex justify-between gap-6">
                                                <span>Payment</span>
                                                <span>{reviewInvoice.paymentLabel}</span>
                                            </div>
                                        </div>
                                        <div className="mt-8 flex justify-between gap-6 text-[24px] font-medium text-[#123b6d]">
                                            <span>Total</span>
                                            <span>{reviewInvoice.total}</span>
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="mt-10 h-[60px] w-full rounded-none bg-[#123b6d] text-[13px] font-medium tracking-[0.18em] text-white hover:bg-[#0f315b]"
                                        >
                                            {processing ? (
                                                <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
                                            ) : (
                                                <PackageCheck className="size-5" aria-hidden="true" />
                                            )}
                                            SUBMIT ORDER
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setActiveStep('customer')}
                                            className="mt-4 h-[52px] w-full rounded-none border-[#123b6d] text-[13px] font-medium tracking-[0.18em] text-[#123b6d] hover:bg-[#123b6d] hover:text-white"
                                        >
                                            EDIT DETAILS
                                        </Button>
                                    </aside>
                                </section>
                            ) : null}
                        </form>
                    )}
                </div>
            </main>
        </ShopLayout>
    );
}
