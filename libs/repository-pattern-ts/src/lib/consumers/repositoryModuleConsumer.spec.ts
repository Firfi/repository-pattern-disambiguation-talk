import { UserId } from '../types'
import { runWithDI } from './repositoryModuleConsumer';

describe('repositoryClassConsumer', () => {
  it('should work', () => {
    const deps = {
      getDbSession: () => ({
        get: () => Promise.resolve({name: 'testName2', id: 'testId' as UserId}),
        exec: () => Promise.resolve(),
        close: () => Promise.resolve(),
      })
    }
    runWithDI(deps)().then((result) => {
      expect(result).toEqual('user of runWithDI of module consumer is testName2');
    });
  });
});
