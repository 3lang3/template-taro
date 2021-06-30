export interface Page {
  _page: {
    page: number
    pageSize: number
    totalCount: number
    totalPage: number
  }
}

export interface MessageState {
  message: {
    list: any[]
  }
}
