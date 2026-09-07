import { api } from "@/lib/api";
import { withMockFallback } from "@/lib/mock/withFallback";
import { withId } from "@/lib/normalizeId";
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

// Backend enum name -> this app's Title Case category label.
const CATEGORY_FROM_BACKEND: Record<string, Template["category"]> = {
  MODERN: "Modern",
  CLASSIC: "Classic",
  LUXURY: "Luxury",
  INDUSTRIAL: "Industrial",
  MINIMALIST: "Minimalist",
  PREMIUM: "Premium",
};

// Backend `status`/`category` come back as Java enum names ("ACTIVE",
// "MODERN"); this app's UI uses lowercase status and Title Case category.
// Backend ids are `id`, this app's types use `_id` (top-level and on each
// assignment) - only applied to data from the REAL API.
function normalizeTemplate(template: Template): Template {
  return withId({
    ...template,
    status: (String(template.status).toLowerCase() as Template["status"]),
    category: CATEGORY_FROM_BACKEND[String(template.category)] ?? template.category,
    images: template.images ?? [],
    themeColors: template.themeColors ?? [],
    furniture: template.furniture ?? [],
    tags: template.tags ?? [],
    costBreakdown: template.costBreakdown ?? [],
    assignments: (template.assignments ?? []).map((a) => withId({
      ...a,
      status: (String(a.status).toLowerCase() as Template["assignments"][number]["status"]),
    })),
  });
}

export async function fetchTemplates(branchId?: string): Promise<Template[]> {
  return withMockFallback(
    async () => {
      const { data } = await api.get<Template[]>("/admin/templates", { params: { branchId } });
      return data.map(normalizeTemplate);
    },
    () => mockFetchTemplateList(branchId)
  );
}

export async function createTemplate(input: TemplateInput, createdBy: string): Promise<Template> {
  return withMockFallback(
    async () => {
      const { data } = await api.post<Template>("/admin/templates", { ...input, createdBy });
      return normalizeTemplate(data);
    },
    () => mockCreateTemplate(input, createdBy)
  );
}

export async function updateTemplate(id: string, input: TemplateInput): Promise<Template> {
  return withMockFallback(
    async () => {
      const { data } = await api.patch<Template>(`/admin/templates/${id}`, input);
      return normalizeTemplate(data);
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
      return normalizeTemplate(data);
    },
    () => mockDuplicateTemplate(id)
  );
}

export async function toggleTemplateFavorite(id: string): Promise<Template> {
  return withMockFallback(
    async () => {
      const { data } = await api.patch<Template>(`/admin/templates/${id}/favorite`, {});
      return normalizeTemplate(data);
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
      return normalizeTemplate(data);
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
      return normalizeTemplate(data);
    },
    () => mockRemoveTemplateAssignment(id, assignmentId)
  );
}