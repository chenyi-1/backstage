import request from "@/utils/request";

export function login(data) {
  // /admin/acl/index/login
  return request({
    url: "/admin/acl/index/login",
    method: "post",
    data: data
  });
}

export function getInfo(token) {
  //GET /admin/acl/index/info
  return request({
    url: "/admin/acl/index/info",
    method: "get",
    params: { token }
  });
}

export function logout() {
  //POST /admin/acl/index/logout
  return request({
    url: "/admin/acl/index/logout",
    method: "post"
  });
}
