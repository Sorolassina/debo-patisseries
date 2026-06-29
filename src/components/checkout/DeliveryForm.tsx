"use client";

import type { CustomerDetails } from "@/lib/customer/types";

const inputClass =
  "w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 font-body text-body-md focus:border-primary focus:outline-none";

interface DeliveryFormProps {
  values: Partial<CustomerDetails>;
  onChange: (patch: Partial<CustomerDetails>) => void;
  idPrefix?: string;
}

export function DeliveryForm({ values, onChange, idPrefix = "delivery" }: DeliveryFormProps) {
  return (
    <div className="space-y-4 rounded-card border border-outline-variant/40 bg-surface-container-low p-5">
      <div>
        <h2 className="font-display text-headline-sm text-secondary">Livraison</h2>
        <p className="mt-1 font-body text-label-sm text-on-surface-variant">
          Ces informations permettent de préparer et livrer votre commande.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={`${idPrefix}-name`} className="mb-1 block font-body text-label-md text-secondary">
            Nom complet *
          </label>
          <input
            id={`${idPrefix}-name`}
            required
            value={values.fullName ?? ""}
            onChange={(e) => onChange({ fullName: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor={`${idPrefix}-email`} className="mb-1 block font-body text-label-md text-secondary">
            Email *
          </label>
          <input
            id={`${idPrefix}-email`}
            type="email"
            required
            value={values.email ?? ""}
            onChange={(e) => onChange({ email: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor={`${idPrefix}-phone`} className="mb-1 block font-body text-label-md text-secondary">
            Téléphone *
          </label>
          <input
            id={`${idPrefix}-phone`}
            type="tel"
            required
            placeholder="+225 07 XX XX XX XX"
            value={values.phone ?? ""}
            onChange={(e) => onChange({ phone: e.target.value })}
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${idPrefix}-address`} className="mb-1 block font-body text-label-md text-secondary">
            Adresse de livraison *
          </label>
          <input
            id={`${idPrefix}-address`}
            required
            placeholder="Quartier, rue, repères..."
            value={values.address ?? ""}
            onChange={(e) => onChange({ address: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor={`${idPrefix}-city`} className="mb-1 block font-body text-label-md text-secondary">
            Ville
          </label>
          <input
            id={`${idPrefix}-city`}
            value={values.city ?? "Abidjan"}
            onChange={(e) => onChange({ city: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor={`${idPrefix}-notes`} className="mb-1 block font-body text-label-md text-secondary">
            Instructions livraison
          </label>
          <input
            id={`${idPrefix}-notes`}
            placeholder="Digicode, étage, créneau..."
            value={values.notes ?? ""}
            onChange={(e) => onChange({ notes: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}
