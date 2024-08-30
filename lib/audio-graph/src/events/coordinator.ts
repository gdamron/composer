export interface ControlEventEmitter {
  id: string;
}

export interface ControlEvent {
  name: string;
  source: ControlEventEmitter;
  data: { [key: string]: unknown };
}

export interface ControlEventReceiver {
  id: string;
  on: (event: ControlEvent) => void;
}

export interface ControlEventCoordinator {
  handlers: { [key: string]: ControlEventReceiver[] };
  subscribe: ({
    eventName,
    source,
    target,
  }: {
    eventName: string;
    source: ControlEventEmitter;
    target: ControlEventReceiver;
  }) => string;
  unsubscribe: ({
    eventId,
    target,
  }: {
    eventId: string;
    target: ControlEventReceiver;
  }) => void;
  emit: (event: ControlEvent) => void;
}

export const createControlEventCoordinator = (): ControlEventCoordinator => {
  const coordinator: ControlEventCoordinator = {
    handlers: {},
    subscribe({ eventName, source, target }) {
      const eventId = `${eventName}#${source.id}`;
      if (!this.handlers[eventId]) {
        this.handlers[eventId] = [];
      }

      this.handlers[eventId].push(target);

      return eventId;
    },
    unsubscribe({ eventId, target }) {
      const idx = this.handlers[eventId]?.findIndex((t) => t.id == target.id);
      if (idx >= 0) {
        this.handlers[eventId].splice(idx, 1);
      }
    },
    emit(event) {
      const { name, source } = event;
      const eventId = `${name}#${source.id}`;
      this.handlers[eventId]?.forEach((target) => target.on(event));
    },
  };

  return coordinator;
};
