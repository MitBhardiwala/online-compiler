import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { runCode } from '../store/actions';
import { getFileExtension } from '../services/utils/helpers';

export const useEditor = () => {
    const dispatch = useDispatch();
    const {
        code,
        language,
        output,
        isRunning,
        error
    } = useSelector(state => state.editor);

    const handleRunCode = useCallback((input = '') => {
        dispatch(runCode(code, language, input));
    }, [dispatch, code, language]);

    const getFileName = useCallback(() => {
        return `main.${getFileExtension(language)}`;
    }, [language]);

    return {
        code,
        language,
        output,
        isRunning,
        error,
        handleRunCode,
        getFileName,
    };
}; 