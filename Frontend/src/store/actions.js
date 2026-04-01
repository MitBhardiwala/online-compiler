import { setCode, setLanguage, setOutput, setIsRunning, setError } from './reducers';
import { executeCode } from '../services/api';

export const runCode = (code, language, input) => async (dispatch) => {
    dispatch(setIsRunning(true));
    dispatch(setError(null));

    try {
        const result = await executeCode(language, code, input);
        dispatch(setOutput(result.output));
        if (result.error) {
            dispatch(setError(result.error));
        }
    } catch (error) {
        dispatch(setError(error.message));
    } finally {
        dispatch(setIsRunning(false));
    }
}; 