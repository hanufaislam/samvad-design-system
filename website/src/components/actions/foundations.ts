// Compatibility export: theme/role bindings now live in the generated token CSS.
export const actionFoundationStyle='';
export const buttonVariants = ['primary','secondary','ghost','destructive'] as const;
export const actionSizes = ['small','medium','large'] as const;
export type ButtonVariant = typeof buttonVariants[number];
export type ActionSize = typeof actionSizes[number];
