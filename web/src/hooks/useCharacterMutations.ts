import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCharacterName, deleteCharacter } from '../services/characters';

export function useUpdateCharacterName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => updateCharacterName(id, name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['characters'] }),
  });
}

export function useDeleteCharacter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCharacter,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['characters'] }),
  });
}
