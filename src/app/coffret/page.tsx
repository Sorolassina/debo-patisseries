import { CoffretContent } from "@/app/coffret/CoffretContent";
import { getAccompanimentProducts } from "@/lib/supabase/products";

export default async function CoffretPage() {
  const upsells = await getAccompanimentProducts();

  return <CoffretContent upsells={upsells} />;
}
