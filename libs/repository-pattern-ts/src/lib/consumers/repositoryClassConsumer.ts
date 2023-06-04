import { IRepository, Repository } from '../repositoryPatternClass';
import { UserId } from '@repository-pattern-disambiguation/repository-pattern-ts';

export const run = async () => {
  const repository = new Repository();
  return runWithDI(repository)();
}

export const runWithDI = (repository: IRepository) => async () => {
  const userId = 'id' as UserId;
  // some business logic here and whatnot, that causes calls to repository
  const user = await repository.get(userId);
  return `user of runWithDI of repository class is ${user.name}`;
}

// better
export const runWithDIPicked = (repository: Pick<IRepository, 'get'>) => async () => {
  const user = await repository.get('id' as UserId);
  return `user of runWithDI or repository class is ${user.name}`;
}
