// we don't care about injections and errors here

import { DbSession, makeDbSession } from './dbSession';
import { User, UserId } from './types';
import { Option, some, none, isSome } from 'fp-ts/Option'

const get_ = (dbSession: Pick<DbSession, 'get'>) => (userId: UserId): Promise<User> =>
  dbSession.get('select * from users where id = ' + userId) as Promise<User>;

const set_ = (dbSession: Pick<DbSession, 'exec'>) => <T>(data: T): Promise<void> =>
  dbSession.exec('insert into users values (' + data + ')');

export interface DbSessionProvider<Session extends DbSession = DbSession> {
  getDbSession(): Session;
}

// you have an implicit layer ("it goes away" picture) of resource management
// here we explicitly tell how we manage resources, not relying on new()
// here we create a singleton with IIFE and make sure it conforms to interface with satisfies
export const SingularDbSessionProvider = (() => {
  let dbSession: Option<DbSession> = none;
  const getDbSession = (): DbSession => {
    if (isSome(dbSession)) return dbSession.value;
    dbSession = some(makeDbSession());
    return getDbSession();
  };
  return { getDbSession };
})() satisfies DbSessionProvider;

// see? it's another concern; it's a **hidden layer** of your layered architecture
export const InfiniteDbSessionProvider = (() => {
  const getDbSession = (): DbSession => makeDbSession();
  return { getDbSession };
})() satisfies DbSessionProvider;

// the "repository" layer as well, to protect the caller from the "session" term
export const makeGet = (provider: DbSessionProvider) => get_(provider.getDbSession());
// it is dryable, but we don't go into it
export const makeSet = (provider: DbSessionProvider) => set_(provider.getDbSession());

export const get = makeGet(SingularDbSessionProvider);
export const set = makeSet(InfiniteDbSessionProvider/*if we wish so*/);

// ^ it is harder to write and read! because
// it makes you think about inconvenient things that were made externalities before

// we are programmers, we have to face inconvenient questions and answer them,
// not swipe them under the rug (hoping a BOOM won't happen) (it'll happen)
