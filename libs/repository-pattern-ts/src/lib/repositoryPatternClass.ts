// assume it's always successful

import { DbSession, makeDbSession } from './dbSession';
import { User, UserId } from './types';

// repository is here to:
// - separate data access layer
// - couple data and methods
// TODO more global meaning of Repository patern in the context of event sourcing
export interface IRepository {
  get(userId: UserId): Promise<User>;
  set<T>(data: T): Promise<void>;
}


// we couple methods with "data"
// is it even data?
// it's a resource! a global one!
export class Repository implements IRepository {
  // check me that it's not a strawman
  private dbSession: DbSession;
  constructor() {
    // acquiring global resource here, mutating global state implicitly - is that what OOP teaches us?
    this.dbSession = makeDbSession();
  }
  // now, what get() has to do with this dbSession?
  // we lie to ourselves that get() has something to do with this specific session initialized in this specific class constructor
  // but if we lie to ourselves here won't it make it a habit and propagate to other parts of the system? (yes it does)
  // also, methods cluttered together; it's always a layer in a layered monolith
  get(userId: UserId): Promise<User> {
    return this.dbSession.get('select * from users where id = ' + userId/*we ignore injections for the sake of brevity*/);
  }
  set<T>(data: T): Promise<void> {
    return this.dbSession.exec('insert into users values (' + data + ')'/*we ignore injections for the sake of brevity*/);
  }
}

// this would remove coupling. get is a piece of logic to run on a resource/data, so why couple?
const get = (dbSession: DbSession) => (userId: UserId): Promise<User> =>
  dbSession.get('select * from users where id = ' + userId/*we ignore injections for the sake of brevity*/);
// ^ notice that we have dependency injection even on the lowest level now; this is a microcosm of the system that reflects its architectural macrocosm

/*
here,
- we introduce resource coupling between elements of the system that neither us nor business wants to be coupled with
- we introduce implicit resource leak
- we make dependency injection less strict than it can be
- in summary, we misuse OOP!
 */

/*
OOP is like a jedi sword. You have to use it once you took it out.
 */
