import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BudgetState {
    currentBudgetUuid: string | null;
}

const initialState: BudgetState = {
    currentBudgetUuid: null
}

const budgetSlice = createSlice({
    name: 'budget',
    initialState,
    reducers: {
        setCurrentBudgetUuid(state, action: PayloadAction<string>) {
            state.currentBudgetUuid = action.payload;
        },
        clearCurrentBudgetUuid(state) {
            state.currentBudgetUuid = null;
        },
    },
});


export const { setCurrentBudgetUuid, clearCurrentBudgetUuid } = budgetSlice.actions;

export default budgetSlice.reducer;
