export const isValidURL = (url) => {
    try {
        new URL(url);
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    } catch (_) {
        return false;
    }
};