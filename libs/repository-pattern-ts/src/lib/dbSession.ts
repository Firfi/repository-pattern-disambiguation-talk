


let connections = 0; // in db

export type DbSession = {
  get: (sql: string) => Promise<any/*assume the lib is lame*/>;
  exec: (sql: string) => Promise<void>;
  close: () => Promise<void>;
}

// new DbSession() equivalent; not a class to handle private fields better on type level (TS just not good for it)
// but why we'd need a class anyways
export const makeDbSession = (): DbSession => {
  console.log('Imma dbsession Imma takin resources');
  connections++;
  let active: boolean = false;
  const onlyOpen = <Fn extends (...args: any[]) => any>(fn: Fn) =>
    async (...args: Parameters<Fn>) => {
      if (!active) {
        throw new Error('dbSession is closed');
      }
      return fn(...args);
    }
  const get = onlyOpen(async (sql: string): Promise<any/*assume the lib is lame*/> => {
    console.log('imma querying sql', sql);
    return {id: 'userId', name: 'Name'};
  });
  const exec = onlyOpen(async (sql: string): Promise<void> => {
    console.log('imma writing sql', sql);
  });
  const close = async () => {
    console.log('Imma closing dbsession');
    active = false;
    connections--;
  };
  return { get, exec, close }
}
