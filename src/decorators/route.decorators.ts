import 'reflect-metadata';

/**
 * HTTP method decorators for controller methods
 */

export function Controller(basePath: string = '/') {
  return function (target: any) {
    Reflect.defineMetadata('controller:basePath', basePath, target);
  };
}

export function Get(path: string = '/') {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata('route:method', 'GET', target, propertyKey);
    Reflect.defineMetadata('route:path', path, target, propertyKey);
  };
}

export function Post(path: string = '/') {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata('route:method', 'POST', target, propertyKey);
    Reflect.defineMetadata('route:path', path, target, propertyKey);
  };
}

export function Put(path: string = '/') {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata('route:method', 'PUT', target, propertyKey);
    Reflect.defineMetadata('route:path', path, target, propertyKey);
  };
}

export function Patch(path: string = '/') {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata('route:method', 'PATCH', target, propertyKey);
    Reflect.defineMetadata('route:path', path, target, propertyKey);
  };
}

export function Delete(path: string = '/') {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata('route:method', 'DELETE', target, propertyKey);
    Reflect.defineMetadata('route:path', path, target, propertyKey);
  };
}

export function Options(path: string = '/') {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata('route:method', 'OPTIONS', target, propertyKey);
    Reflect.defineMetadata('route:path', path, target, propertyKey);
  };
}

export function Head(path: string = '/') {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata('route:method', 'HEAD', target, propertyKey);
    Reflect.defineMetadata('route:path', path, target, propertyKey);
  };
}
