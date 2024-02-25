import { Tune } from "@/types";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { useParams } from "react-router-dom";

import { ref as tunesRef } from "@/hooks/useTunes";

export const useTune = (tune?: Tune) => {
  let { tuneId } = useParams();
  tuneId = tune?.id || tuneId;

  const [snapshot, loading, error] = useDocument(
    !tuneId || tuneId === "new" ? null : doc(tunesRef, tuneId),
  );

  return [
    !snapshot ? undefined : ({ ...snapshot?.data(), id: snapshot?.id } as Tune),
    loading,
    error,
  ] as const;
};

export const useUpdateTune = (tune?: Tune) => {
  const [currentTune] = useTune(tune);
  const tuneId = tune?.id || currentTune?.id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = async (data: Partial<Tune>) => {
    setLoading(true);
    setError(null);

    if (!tuneId && !data.id) throw new Error("Tune is not selected");

    return setDoc(doc(tunesRef, tuneId || data.id), data, { merge: true })
      .catch((error) => {
        setError(error);
      })
      .finally(() => setLoading(false));
  };

  return [update, loading, error] as const;
};
