const toTitleCase = (str) => {
    if (!str) return ""; // Return empty string if null or undefined
 
    return str
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

const decodeBasicEntities = (str) => {
    if (!str) return "";
    return String(str)
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
};

const stripHtmlTags = (input) => {
    if (input === null || input === undefined) return "";
    const withoutTags = String(input).replace(/<[^>]*>/g, "");
    return decodeBasicEntities(withoutTags).trim();
};

export { toTitleCase, stripHtmlTags };
 