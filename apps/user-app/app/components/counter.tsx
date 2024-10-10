"use client"
import React, { useState } from 'react'

import { useAppSelector, useAppDispatch } from '@repo/store/hooks'

import { decrement, increment } from '@repo/store/src/counter/counterSlice'

export function Counter() {
  // The `state` arg is correctly typed as `RootState` already
  const count = useAppSelector((state) => state.counter.value)
  const dispatch = useAppDispatch()
  return (
    <div>
      <div>
        <button onClick={() => dispatch(decrement())}>-</button>
        <span>{count}</span>
        <button onClick={() => dispatch(increment())}>+</button>
      </div>
    </div>
  );
}
  