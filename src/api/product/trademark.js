import request from "@/utils/request";

export default {
  deleteTradeMark(id) {
    return request.delete(`/admin/product/baseTrademark/remove/${id}`);
  },

  addOrUpdate(trademark) {
    if (trademark.id) {
      return request.put(`/admin/product/baseTrademark/update`, trademark);
    } else {
      return request.post(`/admin/product/baseTrademark/save`, trademark);
    }
  },

  getTradeMarkList(page, limit) {
    return request.get(`/admin/product/baseTrademark/${page}/${limit}`);
  },

  getTradeMarks() {
    return request.get(`/admin/product/baseTrademark/getTrademarkList`);
  }
};
