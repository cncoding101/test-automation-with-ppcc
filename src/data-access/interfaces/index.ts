interface IConnection<T> {
  connect(): Promise<T>;
  close(): Promise<void>;
  createMany(table: string, data: Record<string, any>[]): Promise<void>;
  removeAll(): Promise<void>;
  dumpDB(): Promise<void>;
  reset(): Promise<void>;
}

export { IConnection };
