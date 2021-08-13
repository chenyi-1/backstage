import request from "@/utils/request";

//GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export default {
  attrInfoList(category1Id, category2Id, category3Id) {
    return request.get(
      `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`
    );
  },

  // DELETE /admin/product/deleteAttr/{attrId}

  deleteAttr(attrId) {
    return request.delete(`/admin/product/deleteAttr/${attrId}`);
  },

  // POST /admin/product/saveAttrInfo
  addOrUpdate(attrInfo) {
    return request.post(`/admin/product/saveAttrInfo`, attrInfo);
  }
};
