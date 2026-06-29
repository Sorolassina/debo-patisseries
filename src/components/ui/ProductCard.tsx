import Image from "next/image";
import { formatPrice } from "@/lib/utils/format";

interface ProductCardProps {
  name: string;
  priceCents: number;
  imageUrl: string;
  imageAlt: string;
}

export function ProductCard({ name, priceCents, imageUrl, imageAlt }: ProductCardProps) {
  return (
    <div className="flex flex-col items-center rounded-card border border-outline-variant/30 bg-surface p-4 text-center shadow-sm transition-shadow duration-300 hover:shadow-xl">
      <div className="mb-4 h-32 w-32 overflow-hidden rounded-full border-2 border-primary-fixed-dim">
        <Image
          src={imageUrl}
          alt={imageAlt}
          width={128}
          height={128}
          className="h-full w-full object-cover"
        />
      </div>
      <h4 className="mb-1 font-body text-label-md text-on-surface">{name}</h4>
      <p className="font-body text-label-sm text-primary">
        {formatPrice(priceCents)}
      </p>
    </div>
  );
}
