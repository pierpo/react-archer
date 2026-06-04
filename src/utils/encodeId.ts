export const encodeId = (id: string): string => encodeURI(id).replace(/%/g, '_').replace(/:/g, '_');
