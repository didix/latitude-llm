const BASE_PATH = '/webhook'

export const WEBHOOK_ROUTES = {
  email: `${BASE_PATH}/email`,
  integration: `${BASE_PATH}/integration/:triggerUuid`,
}
