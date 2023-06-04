import { get, DbSessionProvider, makeGet } from '../repositoryPatternModule';
import { UserId } from '../types';

export const run = async () => {
  // this is new Repository(), effectively
  const user = await get('id' as UserId);
  return `user in run in module consumer is ${user.name}`;
};

export const runWithDI = (deps: Pick<DbSessionProvider, 'getDbSession'>) => async () => {
  const userId = 'id' as UserId;
  // some business logic here and whatnot, that causes calls to repository
  const user = await makeGet(deps)(userId);
  return `user of runWithDI of module consumer is ${user.name}`;
}
