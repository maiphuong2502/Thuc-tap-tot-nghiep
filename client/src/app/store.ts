import { configureStore } from "@reduxjs/toolkit"

export const store = configureStore({
  reducer: {
    // reducers của bạn
  }
})

// ✅ THÊM 2 DÒNG NÀY
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch