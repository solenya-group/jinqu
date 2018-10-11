import { Expression } from "jokenizer";

export type Ctor<T> = new (...args) => T;

export type Func1<T1, T2 = any> = ((p1: T1) => T2) | string;
export type Func2<T1, T2, T3 = any> = ((p1: T1, p2: T2) => T3) | string;
export type Predicate<T> = Func1<T, boolean>;

export interface IGrouping<T, TKey> extends Array<T> {
    key: TKey;
}

export type WrappedResult<T, TAttachedInfo> = { value: T } & TAttachedInfo;
export type Result<T, TAttachedInfo> = Object extends TAttachedInfo ? T : WrappedResult<T, TAttachedInfo>;

export interface IQueryProvider {
    createQuery(parts?: IQueryPart[]): IQueryBase;
    execute<TResult = any[]>(parts: IQueryPart[]): TResult;
    executeAsync<TResult = any[]>(parts: IQueryPart[]): PromiseLike<TResult>;
    executeAsyncIterator<TResult = any>(parts: IQueryPart[]): AsyncIterator<TResult>;
}

export interface IPartArgument {
    readonly func: Function;
    readonly exp: Expression;
    readonly literal;
    readonly scopes: any[];
}

export interface IQueryPart {
    readonly type: string;
    readonly args: IPartArgument[];
    readonly scopes: any[];
}

export interface IQueryBase {
    readonly provider: IQueryProvider;
    readonly parts: IQueryPart[];
}

export interface InlineCountInfo {
    $inlineCount?: number;
}

interface IQueryDuplicates<T, TAttachedInfo = Object> {
    concat(other: Array<T>): IQuery<T, TAttachedInfo>;
    join<TOther, TResult = any, TKey = any>(other: Array<TOther>, thisKey: Func1<T, TKey>, otherKey: Func1<TOther, TKey>,
        selector: Func2<T, TOther, TResult>, ...scopes): IQuery<TResult, TAttachedInfo>;
    reverse(): IQuery<T, TAttachedInfo>;
}

export interface IQuerySafe<T, TAttachedInfo = Object> extends IQueryBase, Iterable<T>, AsyncIterable<T> {
    aggregate<TAccumulate = number>(func: Func2<TAccumulate, T, TAccumulate>, seed?: TAccumulate, ...scopes): Result<TAccumulate, TAttachedInfo>;
    aggregateAsync<TAccumulate = number>(func: Func2<TAccumulate, T, TAccumulate>, seed?: TAccumulate, ...scopes): PromiseLike<Result<TAccumulate, TAttachedInfo>>;
    all(predicate: Predicate<T>, ...scopes): Result<boolean, TAttachedInfo>;
    allAsync(predicate: Predicate<T>, ...scopes): PromiseLike<Result<boolean, TAttachedInfo>>;
    any(predicate?: Predicate<T>, ...scopes): Result<boolean, TAttachedInfo>;
    anyAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<Result<boolean, TAttachedInfo>>;
    average(selector?: Func1<T, number>, ...scopes): Result<number, TAttachedInfo>;
    averageAsync(selector?: Func1<T, number>, ...scopes): PromiseLike<Result<number, TAttachedInfo>>;
    cast<TResult>(type: Ctor<TResult>): IQuery<TResult, TAttachedInfo>;
    contains(item: T, comparer?: Func2<T, T, boolean>, ...scopes): Result<boolean, TAttachedInfo>;
    containsAsync(item: T, comparer?: Func2<T, T, boolean>, ...scopes): PromiseLike<Result<boolean, TAttachedInfo>>;
    count(predicate?: Predicate<T>, ...scopes): Result<number, TAttachedInfo>;
    countAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<Result<number, TAttachedInfo>>;
    defaultIfEmpty(defaultValue?: T): IQuery<T, TAttachedInfo>;
    distinct(comparer?: Func2<T, T, boolean>, ...scopes): IQuery<T, TAttachedInfo>;
    elementAt(index: number): Result<T, TAttachedInfo>;
    elementAtAsync(index: number): PromiseLike<Result<T, TAttachedInfo>>;
    elementAtOrDefault(index: number): Result<T, TAttachedInfo>;
    elementAtOrDefaultAsync(index: number): PromiseLike<Result<T, TAttachedInfo>>;
    except(other: Array<T>, comparer?: Func2<T, T, boolean>, ...scopes): IQuery<T, TAttachedInfo>;
    first(predicate?: Predicate<T>, ...scopes): Result<T, TAttachedInfo>;
    firstAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<Result<T, TAttachedInfo>>;
    firstOrDefault(predicate?: Predicate<T>, ...scopes): Result<T, TAttachedInfo>;
    firstOrDefaultAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<Result<T, TAttachedInfo>>;
    groupBy<TResult = IGrouping<TKey, T>, TKey = any>(keySelector: Func1<T, TKey>, 
        elementSelector?: Func2<TKey, Array<T>, TResult>, ...scopes): IQuery<TResult, TAttachedInfo>;
    groupJoin<TOther, TKey = any, TResult = any>(other: Array<TOther>, thisKey: Func1<T, TKey>, otherKey: Func1<TOther, TKey>,
        selector: Func2<T, Array<TOther>, TResult>, ...scopes): IQuery<TResult, TAttachedInfo>;
    inlineCount(value?: boolean): IQuery<T, TAttachedInfo>;
    intersect(other: Array<T>, comparer?: Func2<T, T, boolean>, ...scopes): IQuery<T, TAttachedInfo>;
    last(predicate?: Predicate<T>, ...scopes): Result<T, TAttachedInfo>;
    lastAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<Result<T, TAttachedInfo>>;
    lastOrDefault(predicate?: Predicate<T>, ...scopes): Result<T, TAttachedInfo>;
    lastOrDefaultAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<Result<T, TAttachedInfo>>;
    max<TResult = T>(selector?: Func1<T, TResult>, ...scopes): Result<TResult, TAttachedInfo>;
    maxAsync<TResult = T>(selector?: Func1<T, TResult>, ...scopes): PromiseLike<Result<TResult, TAttachedInfo>>;
    min<TResult = T>(selector?: Func1<T, TResult>, ...scopes): Result<TResult, TAttachedInfo>;
    minAsync<TResult = T>(selector?: Func1<T, TResult>, ...scopes): PromiseLike<Result<TResult, TAttachedInfo>>;
    ofType<TResult extends T>(type: Ctor<TResult>): IQuery<TResult, TAttachedInfo>;
    orderBy(keySelector: Func1<T>, ...scopes): IOrderedQuery<T, TAttachedInfo>;
    orderByDescending(keySelector: Func1<T>, ...scopes): IOrderedQuery<T, TAttachedInfo>;
    select<TResult = any>(selector: Func1<T, TResult>, ...scopes): IQuery<TResult, TAttachedInfo>;
    selectMany<TResult>(selector: Func1<T, Array<TResult>>, ...scopes): IQuery<TResult, TAttachedInfo>;
    sequenceEqual(other: Array<T>, comparer?: Func2<T, T, boolean>, ...scopes): Result<boolean, TAttachedInfo>;
    sequenceEqualAsync(other: Array<T>, comparer?: Func2<T, T, boolean>, ...scopes): PromiseLike<Result<boolean, TAttachedInfo>>;
    single(predicate?: Predicate<T>, ...scopes): Result<T, TAttachedInfo>;
    singleAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<Result<T, TAttachedInfo>>;
    singleOrDefault(predicate?: Predicate<T>, ...scopes): Result<T, TAttachedInfo>;
    singleOrDefaultAsync(predicate?: Predicate<T>, ...scopes): PromiseLike<Result<T, TAttachedInfo>>;
    skip(count: number): IQuery<T, TAttachedInfo>;
    skipWhile(predicate: Predicate<T>, ...scopes): IQuery<T, TAttachedInfo>;
    sum(selector?: Func1<T, number>, ...scopes): Result<number, TAttachedInfo>;
    sumAsync(selector?: Func1<T, number>, ...scopes): PromiseLike<Result<number, TAttachedInfo>>;
    take(count: number): IQuery<T, TAttachedInfo>;
    takeWhile(predicate: Predicate<T>, ...scopes): IQuery<T, TAttachedInfo>;
    union(other: Array<T>, comparer?: Func2<T, T, boolean>, ...scopes): IQuery<T, TAttachedInfo>;
    where(predicate: Predicate<T>, ...scopes): IQuery<T, TAttachedInfo>;
    zip<TOther, TResult = any>(other: Array<TOther>, selector: Func2<T, TOther, TResult>, ...scopes): IQuery<TResult, TAttachedInfo>;

    toArray(): Result<Array<T>, TAttachedInfo> & InlineCountInfo;
    toArrayAsync(): PromiseLike<Result<Array<T>, TAttachedInfo> & InlineCountInfo>;
}

export type IQuery<T, TAttachedInfo = Object> = IQuerySafe<T, TAttachedInfo> & IQueryDuplicates<T, TAttachedInfo>;

export interface IOrderedQuery<T, TAttachedInfo = Object> extends IQuery<T, TAttachedInfo> {
    thenBy(selector: Func1<T>, ...scopes): IOrderedQuery<T, TAttachedInfo>;
    thenByDescending(keySelector: Func1<T>, ...scopes): IOrderedQuery<T, TAttachedInfo>;
}
