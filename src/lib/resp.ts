export function respData(data: any, init?: ResponseInit) {
  return respJson(0, 'ok', data ?? [], init);
}

export function respOk(init?: ResponseInit) {
  return respJson(0, 'ok', undefined, init);
}

export function respErr(message: string, init?: ResponseInit) {
  return respJson(-1, message, undefined, init);
}

export function respPage(items: any[], total: number) {
  return respJson(0, 'ok', { items, total });
}

export function respJson(
  code: number,
  message: string,
  data?: any,
  init?: ResponseInit
) {
  let json: Record<string, any> = {
    code: code,
    message: message,
  };
  if (data !== undefined) {
    json['data'] = data;
  }
  return Response.json(json, init);
}
