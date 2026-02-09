// ========================================================
// DATA.JS - All site content lives here.
// Videos, documents, images, and personal notes.
// ========================================================

const SITE_DATA = {

    // ------ VIDEOS ------
    // All video files from the evidence archive
    videos: [
        { filename: "EFTA00123083.mp4", id: "EFTA00123083" },
        { filename: "EFTA01621016.mp4", id: "EFTA01621016" },
        { filename: "EFTA01621046.mp4", id: "EFTA01621046" },
        { filename: "EFTA01621057.mp4", id: "EFTA01621057" },
        { filename: "EFTA01621060.mp4", id: "EFTA01621060" },
        { filename: "EFTA01621062.mp4", id: "EFTA01621062" },
        { filename: "EFTA01621067.mp4", id: "EFTA01621067"},
        { filename: "EFTA01621080.mp4", id: "EFTA01621080" },
        { filename: "EFTA01621084.mp4", id: "EFTA01621084" },
        { filename: "EFTA01621086.mp4", id: "EFTA01621086" },
        { filename: "EFTA01621098.mp4", id: "EFTA01621098" },
        { filename: "EFTA01622052.mp4", id: "EFTA01622052" },
        { filename: "EFTA01622053.mp4", id: "EFTA01622053" },
        { filename: "EFTA01648514.mp4", id: "EFTA01648514" },
        { filename: "EFTA01648547.mp4", id: "EFTA01648547" },
        { filename: "EFTA01648622.mp4", id: "EFTA01648622" },
        { filename: "EFTA01648662.mp4", id: "EFTA01648662" },
    ],

    // ------ DOCUMENT CATEGORIES ------
    // Categories for organizing documents. Add new ones as needed.
    // Each category has an id, a display label, and an icon label.
    docCategories: [
        { id: "court-docs",   label: "Court Documents" },
        { id: "emails",       label: "E-mails" },
        { id: "reports",      label: "Reports" },
        { id: "financial",    label: "Financial Records" },
        { id: "other",        label: "Other" },
    ],

    // ------ DOCUMENTS (PDFs) ------
    // displayName: What visitors see (e.g. "Epstein and Elon e-mails")
    // filename:    The real government/evidence filename (never changes)
    // url:         Path to the actual file
    // category:    Must match a docCategories id above
    // persons:     Array of person names this document relates to (for filtering)
    documents: [
        {
            displayName: "EFTA00024813",
            filename: "EFTA00024813.pdf",
            url: "docs/court-documents/EFTA00024813.pdf",
            category: "court-docs",
            persons: ["Jeffrey Epstein"],
        },
        {
            displayName: "EFTA00144401",
            filename: "EFTA00144401.pdf",
            url: "docs/court-documents/EFTA00144401.pdf",
            category: "court-docs",
            persons: ["Jeffrey Epstein"],
        },
        {
            displayName: "EFTA00256291",
            filename: "EFTA00256291.pdf",
            url: "docs/court-documents/EFTA00256291.pdf",
            category: "court-docs",
            persons: ["Jeffrey Epstein"],
        },
        {
            displayName: "EFTA00527356",
            filename: "EFTA00527356.pdf",
            url: "docs/court-documents/EFTA00527356.pdf",
            category: "court-docs",
            persons: ["Jeffrey Epstein"],
        },
        {
            displayName: "EFTA01660651",
            filename: "EFTA01660651.pdf",
            url: "docs/court-documents/EFTA01660651.pdf",
            category: "court-docs",
            persons: ["Jeffrey Epstein"],
        },
        {
            displayName: "EFTA02215818",
            filename: "EFTA02215818.pdf",
            url: "docs/court-documents/EFTA02215818.pdf",
            category: "court-docs",
            persons: ["Jeffrey Epstein"],
        },
        {
            displayName: "EFTA02416106",
            filename: "EFTA02416106.pdf",
            url: "docs/court-documents/EFTA02416106.pdf",
            category: "court-docs",
            persons: ["Jeffrey Epstein"],
        },
        {
            displayName: "EFTA02588450",
            filename: "EFTA02588450.pdf",
            url: "docs/court-documents/EFTA02588450.pdf",
            category: "court-docs",
            persons: ["Jeffrey Epstein"],
        },
        {
            displayName: "Johnson v. Trump & Epstein Lawsuit",
            filename: "Johnson_TrumpEpstein_Lawsuit.pdf",
            url: "docs/court-documents/Johnson_TrumpEpstein_Lawsuit.pdf",
            category: "court-docs",
            persons: ["Jeffrey Epstein", "Donald Trump"],
        },
    ],

    // ------ IMAGES ------
    images: [
        {
            src: "images/EFTA00000466.webp",
            alt: "EFTA00000466",
            caption: "EFTA00000466",
        },
    ],

    // ------ NOTES ------
    // Add your personal notes here. Each note has a title and content.
    // You can use basic HTML in content if needed.
    notes: [
        // Example:
        // {
        //     title: "My note title",
        //     content: "What I noticed about this document..."
        // },
    ],

    // ------ VIDEO NOTES ------
    // Add notes for videos here. Each note has a videoId and content.
    videoNotes: [
        {
            videoId: "EFTA00123083",
            content: "This video shows the entrance to the facility at 10:23pm. Notice the security guard in the background."
        },
        {
            videoId: "EFTA01621067",
            content: "The legendary temple on Epstein's private island."
        },
        {
            videoId: "EFTA01622052",
            content: "Vidos from when Epstein was probebely in Sweaden. Notes the falg in the background."
        },
        {
            videoId: "EFTA01648547",
            content: "Video where it can be herd a woman beting a animal/child whit a basebalbat. It is also possible to herd a manely moan in the background."
        }
        // Example:
        // {
        //     videoId: "EFTA00123083",
        //     content: "This video shows..."
        // },
    ]
};
