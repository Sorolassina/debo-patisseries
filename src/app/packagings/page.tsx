import { PackagingsContent } from "@/app/packagings/PackagingsContent";
import { getActivePackagings } from "@/lib/supabase/packagings";

export default async function PackagingsPage() {
  const packagings = await getActivePackagings();
  return <PackagingsContent packagings={packagings} />;
}
