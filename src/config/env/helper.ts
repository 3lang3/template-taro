export const makeUpApi = (...args): string => {
  return `https://${args.join('.')}`;
};
