import { Uuid } from "../shared/Uuid";

/**
 * Action a SwitchRequest instructs the edge device to perform.
 * Defined locally in Domain (not imported from `shared-types`) so that
 * Domain has zero dependency on the wire-contract package shared with the
 * client/edge. Kept as a string union (not a fixed literal) to allow future
 * variants (e.g. a long-press) without a breaking change.
 */
export type SwitchAction = "press";

/** Lifecycle status of a SwitchRequest, owned by the Domain layer. */
export type SwitchRequestStatus = "pending" | "done" | "failed";

/**
 * Properties needed to reconstruct a SwitchRequest from persistence.
 */
export interface SwitchRequestProps {
  requestId: Uuid;
  executorId: Uuid;
  action: SwitchAction;
  status: SwitchRequestStatus;
  issuedAt: Date;
  updatedAt: Date;
}

/**
 * SwitchRequest is the core domain entity representing a single instruction
 * to physically press the switch, and its lifecycle from `pending` through
 * to `done`/`failed` (see ADR.md 3.7, 3.8, 3.9).
 *
 * This class has no dependency on any framework, infrastructure, or the
 * `shared-types` wire-contract package (no Azure SDKs, no HTTP types, no
 * Queue/API DTOs) so it can be unit tested and reasoned about in isolation,
 * per the Onion Architecture's Domain layer rules. Translating a
 * SwitchRequest to/from external representations (e.g. the Queue message)
 * is the Application layer's responsibility, not Domain's.
 */
export class SwitchRequest {
  private constructor(private props: SwitchRequestProps) {}

  /** Creates a brand new SwitchRequest in the `pending` state. */
  static create(
    action: SwitchAction,
    executorId: Uuid,
    now: Date = new Date()
  ): SwitchRequest {
    return new SwitchRequest({
      requestId: Uuid.generate(),
      executorId,
      action,
      status: "pending",
      issuedAt: now,
      updatedAt: now,
    });
  }

  /** Reconstructs a SwitchRequest from persisted data (e.g. Table Storage). */
  static reconstruct(props: SwitchRequestProps): SwitchRequest {
    return new SwitchRequest({ ...props });
  }

  get requestId(): Uuid {
    return this.props.requestId;
  }

  /** Which family member (User) issued this request — for history/auditing. */
  get executorId(): Uuid {
    return this.props.executorId;
  }

  get action(): SwitchAction {
    return this.props.action;
  }

  get status(): SwitchRequestStatus {
    return this.props.status;
  }

  get issuedAt(): Date {
    return this.props.issuedAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  /** Marks the request as successfully completed by the edge device. */
  markDone(now: Date = new Date()): void {
    this.transitionTo("done", now);
  }

  /** Marks the request as failed (e.g. servo error reported by the edge device). */
  markFailed(now: Date = new Date()): void {
    this.transitionTo("failed", now);
  }

  private transitionTo(status: SwitchRequestStatus, now: Date): void {
    if (this.props.status !== "pending") {
      throw new Error(
        `Cannot transition SwitchRequest ${this.props.requestId} from '${this.props.status}' to '${status}': only 'pending' requests can be finalized.`
      );
    }

    this.props.status = status;
    this.props.updatedAt = now;
  }

  /** Returns a plain snapshot of the entity's state, e.g. for persistence/DTO mapping. */
  toProps(): SwitchRequestProps {
    return { ...this.props };
  }
}

