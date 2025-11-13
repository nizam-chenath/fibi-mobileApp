const toTitleCase = (str) => {
    if (!str) return ""; // Return empty string if null or undefined
 
    return str
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};
export { toTitleCase };
 