import { randomUUID } from "node:crypto";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Value Object wrapping a UUID string. Validating the format at
 * construction time means every consumer that receives a `Uuid` instance
 * (including Infrastructure's Table Storage OData filters) can trust it
 * contains only hex digits and hyphens — never quotes or other characters
 * that could be used to break out of a filter string. This closes the
 * OData filter injection risk on `requestId`/`clientId` at the type level,
 * instead of relying on each call site remembering to validate/escape it.
 */
export class Uuid {
  private constructor(private readonly value: string) {}

  /** Validates `value` as a UUID; throws if it isn't well-formed. */
  static create(value: string): Uuid {
    if (!UUID_PATTERN.test(value)) {
      throw new Error(`'${value}' is not a valid UUID`);
    }
    return new Uuid(value.toLowerCase());
  }

  /** Generates a brand new random (v4) UUID. */
  static generate(): Uuid {
    return new Uuid(randomUUID());
  }

  equals(other: Uuid): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
