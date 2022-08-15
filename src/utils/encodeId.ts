export const encodeId = (id: string): string => encodeURI(id).replace(/%/g, '_');
