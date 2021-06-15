import request from "@/utils/request";

export function getCurrentUser(data) {
  return request("/getMDPBaseInfo", {
    method: "POST",
    data,
  });
}
