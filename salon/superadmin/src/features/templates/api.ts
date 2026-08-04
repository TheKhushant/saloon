import { api } from "@/lib/api";
import { withMockFallback } from "@/lib/mock/withFallback";
import {
  mockAssignTemplateToBranch,
  mockCreateTemplate,
  mockDeleteTemplateRecord,
  mockDuplicateTemplate,
  mockFetchTemplateList,
  mockRemoveTemplateAssignment,
  mockToggleTemplateFavorite,
  mockUpdateTemplateRecord,
} from "@/lib/mock/store";
import type { Template, TemplateAssignmentInput, TemplateInput } from "./types";

export async function fetchTemplates(branchId?: string): Promise<Template[]> {
  return withMockFallback(
    async () => {
      const { data } = await api.get<Template[]>("/admin/templates", { params: { branchId } });
      return data;
    },
    () => mockFetchTemplateList(branchId)
  );
}

export async function createTemplate(input: TemplateInput, createdBy: string): Promise<Template> {
  return withMockFallback(
    async () => {
      const { data } = await api.post<Template>("/admin/templates", { ...input, createdBy });
      return data;
    },
    () => mockCreateTemplate(input, createdBy)
  );
}

export async function updateTemplate(id: string, input: TemplateInput): Promise<Template> {
  return withMockFallback(
    async () => {
      const { data } = await api.patch<Template>(`/admin/templates/${id}`, input);
      return data;
    },
    () => mockUpdateTemplateRecord(id, input)
  );
}

export async function deleteTemplate(id: string): Promise<void> {
  return withMockFallback(
    async () => {
      await api.delete(`/admin/templates/${id}`);
    },
    () => mockDeleteTemplateRecord(id)
  );
}

export async function duplicateTemplate(id: string): Promise<Template> {
  return withMockFallback(
    async () => {
      const { data } = await api.post<Template>(`/admin/templates/${id}/duplicate`, {});
      return data;
    },
    () => mockDuplicateTemplate(id)
  );
}

export async function toggleTemplateFavorite(id: string): Promise<Template> {
  return withMockFallback(
    async () => {
      const { data } = await api.patch<Template>(`/admin/templates/${id}/favorite`, {});
      return data;
    },
    () => mockToggleTemplateFavorite(id)
  );
}

export async function assignTemplateToBranch(
  id: string,
  input: TemplateAssignmentInput
): Promise<Template> {
  return withMockFallback(
    async () => {
      const { data } = await api.post<Template>(`/admin/templates/${id}/assignments`, input);
      return data;
    },
    () => mockAssignTemplateToBranch(id, input)
  );
}

export async function removeTemplateAssignment(id: string, assignmentId: string): Promise<Template> {
  return withMockFallback(
    async () => {
      const { data } = await api.delete<Template>(
        `/admin/templates/${id}/assignments/${assignmentId}`
      );
      return data;
    },
    () => mockRemoveTemplateAssignment(id, assignmentId)
  );
}
