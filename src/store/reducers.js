import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    code: '',
    language: 'python',
    output: '',
    isRunning: false,
    error: null,
};

const editorSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        setCode: (state, action) => {
            state.code = action.payload;
        },
        setLanguage: (state, action) => {
            state.language = action.payload;
        },
        setOutput: (state, action) => {
            state.output = action.payload;
        },
        setIsRunning: (state, action) => {
            state.isRunning = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setCode, setLanguage, setOutput, setIsRunning, setError } = editorSlice.actions;
export const editorReducer = editorSlice.reducer; 