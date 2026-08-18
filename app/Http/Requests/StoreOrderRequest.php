<?php

namespace App\Http\Requests;

use App\Models\DeliverySetting;
use App\Support\ShopProductCatalog;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $customer = $this->input('customer', []);

        if (is_array($customer) && array_key_exists('phone', $customer)) {
            $phone = preg_replace('/\D+/', '', (string) $customer['phone']);

            if (str_starts_with($phone, '961') && strlen($phone) === 11) {
                $phone = substr($phone, 3);
            }

            $customer['phone'] = $phone;
            $this->merge(['customer' => $customer]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $billingAddressRequired = Rule::requiredIf(fn (): bool => ! $this->boolean('billing_same_as_shipping'));

        return [
            'order_number' => ['nullable', 'string', 'max:24', 'regex:/^MAZ-\d{6}-[A-Z0-9]{6}$/', Rule::unique('orders', 'order_number')],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_slug' => ['required', 'string', Rule::in(array_keys(ShopProductCatalog::products()))],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:20'],
            'delivery_zone' => ['required', Rule::in(array_keys(DeliverySetting::zoneOptions()))],
            'customer.name' => ['required', 'string', 'max:255'],
            'customer.email' => ['nullable', 'email', 'max:255'],
            'customer.phone' => ['required', 'digits:8'],
            'shipping_address.full_name' => ['required', 'string', 'max:255'],
            'shipping_address.line_one' => ['required', 'string', 'max:255'],
            'shipping_address.line_two' => ['nullable', 'string', 'max:255'],
            'shipping_address.city' => ['required', 'string', 'max:120'],
            'shipping_address.region' => ['required', 'string', 'max:120'],
            'shipping_address.country' => ['required', Rule::in(['Lebanon'])],
            'billing_same_as_shipping' => ['required', 'boolean'],
            'billing_address.full_name' => [$billingAddressRequired, 'nullable', 'string', 'max:255'],
            'billing_address.line_one' => [$billingAddressRequired, 'nullable', 'string', 'max:255'],
            'billing_address.line_two' => ['nullable', 'string', 'max:255'],
            'billing_address.city' => [$billingAddressRequired, 'nullable', 'string', 'max:120'],
            'billing_address.region' => [$billingAddressRequired, 'nullable', 'string', 'max:120'],
            'billing_address.country' => [$billingAddressRequired, 'nullable', Rule::in(['Lebanon'])],
            'payment_method' => ['required', Rule::in(['cash_on_delivery'])],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
