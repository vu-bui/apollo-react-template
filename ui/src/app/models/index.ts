export * from '../../../../src/api/models';
export interface StyleState<S extends (...args: any[]) => any> {
  classes: { [k in keyof ReturnType<S>]: string; };
}
