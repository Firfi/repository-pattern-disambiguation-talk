import { runWithDI } from './repositoryClassConsumer';
import { IRepository } from '../repositoryPatternClass';
import { UserId } from '../types';

describe('repositoryClassConsumer', () => {
  it('should work', () => {
    const mockRepository: IRepository = {
      get() {
        return Promise.resolve({name: 'testName', id: 'testId' as UserId});
      },
      // clumsy, we don't need it; what if many methods?
      // then we mock() ofc but mock() is dynamic and how do we check mock WHAT?
      // runWithDIPicked would fix this
      set<T>(data: T): Promise<void> {
        return Promise.resolve(undefined);
      }
    }
    runWithDI(mockRepository)().then((result) => {
      expect(result).toEqual('user of runWithDI of repository class is testName');
    });
  });
});
