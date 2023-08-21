type SecuredEnvExtractor<T> = {
  required(is?: boolean): SecuredEnvExtractor<T>,
  default(value: T): SecuredEnvExtractor<T>,
  get(): T,
}

abstract class EnvExtractor<T> {
  protected isRequired = false
  protected defaultValue?: T

  constructor(protected readonly name: string) {
  }

  required(): SecuredEnvExtractor<T> {
    this.isRequired = true
    return this as SecuredEnvExtractor<T>
  }

  default(value: T): SecuredEnvExtractor<T> {
    this.defaultValue = value
    return this as SecuredEnvExtractor<T>
  }

  protected abstract transformValue(value: string): T

  get() {
    const value = process.env[this.name]
    if (typeof value === 'undefined') {
      if (typeof this.defaultValue !== 'undefined') {
        return this.defaultValue
      } else {
        if (this.isRequired) {
          throw new Error(`Required env ${this.name} is not set`)
        } else {
          return
        }
      }
    }
    return this.transformValue(value)
  }
}

class StringEnv extends EnvExtractor<string> {
  protected transformValue(value: string): string {
    return value
  }
}

class NumberEnv extends EnvExtractor<number> {
  protected transformValue(value: string): number {
    const numberValue = Number(value)
    if (isNaN(numberValue)) {
      throw new Error(`Env ${this.name} is not a number`)
    }
    return numberValue
  }
}

class BooleanEnv extends EnvExtractor<boolean> {
  protected transformValue(value: string): boolean {
    return value !== '0' && value !== 'false'
  }
}

class JsonEnv<T extends unknown> extends EnvExtractor<T> {
  protected transformValue(value: string): T {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(value)
  }
}

export class Env {
  // eslint-disable-next-line id-blacklist
  static string(name: string) {
    return new StringEnv(name)
  }

  // eslint-disable-next-line id-blacklist
  static number(name: string) {
    return new NumberEnv(name)
  }

  // eslint-disable-next-line id-blacklist
  static boolean(name: string) {
    return new BooleanEnv(name)
  }

  static json<T>(name: string) {
    return new JsonEnv<T>(name)
  }

}
