export const formatOutput = (output, error) => {
    if (error) {
        return `${output}\nErrors:\n${error}`;
    }
    return output;
}; 