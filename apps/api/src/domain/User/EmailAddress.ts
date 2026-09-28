/**
 * Value Object wrapping a validated email address string.
 *
 * Deliberately conservative: besides requiring a basic `local@domain.tld`
 * shape, it explicitly rejects whitespace and quote characters so that a
 * validated `EmailAddress` can never carry a character that would let it
 * break out of an OData filter string (e.g. a single quote). This closes
 * the allowlist-bypass/OData filter injection risk on `emailAddress` at
 * the type level, instead of relying on each call site remembering to
 * validate/escape it.
 */
const EMAIL_PATTERN = /^[^\s@'"]+@[^\s@'"]+\.[^\s@'"]+$/;

export class EmailAddress {
  private constructor(private readonly value: string) {}

  /** Validates and normalizes (trims, lowercases) `value`; throws if malformed. */
  static create(value: string): EmailAddress {
    const normalized = value.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(normalized)) {
      throw new Error(`'${value}' is not a valid email address`);
    }
    return new EmailAddress(normalized);
  }

  equals(other: EmailAddress): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
