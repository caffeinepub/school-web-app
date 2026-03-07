import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Student, Teacher } from "../backend.d";
import { useActor } from "./useActor";

export function useAllTeachers() {
  const { actor, isFetching } = useActor();
  return useQuery<Teacher[]>({
    queryKey: ["teachers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTeachers();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAllStudents() {
  const { actor, isFetching } = useActor();
  return useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStudents();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSeedData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.seedData();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}
