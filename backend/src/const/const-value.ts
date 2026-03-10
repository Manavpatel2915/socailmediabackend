export const defaultValues = {
  DEFAULT_LIMIT: 2,
  DEFAULT_OFFSET: 0,
}

export const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
]

export const EXCHANGE = "broadcast_logs"

export type ExchangeType = "direct" | "fanout" | "topic" | "headers";

export const EXCHANGE_TYPE: ExchangeType = "direct"

export type QueueName = "SchedulePost" | "notification" | "userDetails";

export const queueArray: QueueName[] = ["SchedulePost", "notification", "userDetails"];