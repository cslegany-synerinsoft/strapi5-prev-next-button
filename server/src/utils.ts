import type { Modules } from '@strapi/types';

export const transformEntry = (
  entry: Modules.Documents.Result<any> | Modules.Documents.Result<any>[] | null | undefined,
  mainField: string
) => {
  if (!entry || !entry?.[0]) return null;

  const { ...rest } = entry[0];
  return { id: rest.id, documentId: rest.documentId, label: rest[mainField] };
}