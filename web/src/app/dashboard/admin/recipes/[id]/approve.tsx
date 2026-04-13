'use client';

import { useMutation } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '~/components/ui/button';
import { Spinner } from '~/components/ui/spinner';
import { POST } from '~/lib/api';

type ApproveProps = {
  recipeDataId: number;
  visible: boolean;
};

export function Approve({ recipeDataId, visible: initialVisible }: ApproveProps) {
  const router = useRouter();

  const [visible, setVisible] = useState(initialVisible);

  const { isPending, mutate: approveRecipeData } = useMutation({
    mutationFn: (recipeDataId: number) => POST(`/api/recipe-data/${recipeDataId}/verify`),
    onError: () => {
      toast.error('Hiba történt a recept jóváhagyása során. Kérlek, próbáld újra később.');
    },
    onSuccess: () => {
      setVisible(false);
      router.refresh();
    },
  });

  if (!visible) return null;

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

      <Button disabled={isPending} onClick={() => approveRecipeData(recipeDataId)} size="sm">
        {isPending ? <Spinner /> : <CheckCircle className="size-4" />}
        <span>Recept jóváhagyása</span>
      </Button>
    </div>
  );
}
