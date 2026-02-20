'use client';

import { useMutation } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '~/components/ui/button';
import { POST } from '~/lib/api';

export function Approve({ recipeDataId }: { recipeDataId: number }) {
  const router = useRouter();

  const { isPending: isApproving, mutate: approveRecipeData } = useMutation({
    mutationFn: (recipeDataId: number) => POST(`/api/recipe-data/${recipeDataId}/verify`),
    onError: () => {
      toast.error('Hiba történt a recept jóváhagyása során. Kérlek, próbáld újra később.');
    },
    onSuccess: () => router.refresh(),
  });

  return (
    <div className="bg-accent/30 flex items-center justify-between gap-4 rounded-lg border px-4 py-3">
      <div className="flex items-center gap-3">
        <AlertTriangle className="text-accent-foreground size-5" />

        <div className="text-sm">
          <p className="font-medium">Ez a recept még nincs jóváhagyva</p>
          <p className="text-muted-foreground">
            Amíg nem kerül jóváhagyásra, nem jelenik meg a nyilvános felületeken.
          </p>
        </div>
      </div>

      <Button disabled={isApproving} onClick={() => approveRecipeData(recipeDataId)} size="sm">
        <CheckCircle className="size-4" />
        <span>Recept jóváhagyása</span>
      </Button>
    </div>
  );
}
