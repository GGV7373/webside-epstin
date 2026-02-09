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
        { filename: "EFTA01621067.mp4", id: "EFTA01621067" },
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
        { id: "court-docs", label: "Court Documents" },
        { id: "emails", label: "E-mails" },
        { id: "reports", label: "Reports" },
        { id: "financial", label: "Financial Records" },
        { id: "other", label: "Other" },
    ],

    // ------ DOCUMENTS (PDFs) ------
    // displayName: What visitors see (e.g. "Epstein and Elon e-mails")
    // filename:    The real government/evidence filename (never changes)
    // url:         Path to the actual file
    // category:    Must match a docCategories id above
    // persons:     Array of person names this document relates to (for filtering)
    documents: [
        {
            displayName: "EFTA00144401",
            filename: "EFTA00144401.pdf",
            url: "docs/court-documents/EFTA00144401.pdf",
            category: "court-docs",
            persons: ["Jeffrey Epstein"],
        },
        {
            displayName: "Order Pizza?",
            filename: "EFTA00527356.pdf",
            url: "docs/other/EFTA00527356.pdf",
            category: "other",
            persons: ["Jeffrey Epstein"],
        },
        {
            displayName: "Abut what hapend whit Epstein.",
            filename: "EFTA01660651.pdf",
            url: "docs/court-documents/EFTA01660651.pdf",
            category: "court-docs",
            persons: ["Jeffrey Epstein", "Donald Trump", "Bill Clinton", "Ghislaine Maxwell"],
        },
        {
            displayName: "About pizza?",
            filename: "EFTA02215818.pdf",
            url: "docs/emails/EFTA02215818.pdf",
            category: "emails",
            persons: ["Jeffrey Epstein"],
        },
        {
            displayName: "Unknown sender to Jeffrey",
            filename: "EFTA02416106.pdf",
            url: "docs/emails/EFTA02416106.pdf",
            category: "emails",
            persons: ["Jeffrey Epstein"],
        },
        {
            displayName: "Jeffrey and Elon E-mails",
            filename: "EFTA02588450.pdf",
            url: "docs/emails/EFTA02588450.pdf",
            category: "emails",
            persons: ["Jeffrey Epstein", "Elon Musk"],
        },

        {
            displayName: "Crime coverups",
            filename: "EFTA00072617.pdf",
            url: "docs/court-documents/EFTA00072617.pdf",
            category: "emails",
        },
        {
            displayName: "Epstein sex slaves",
            filename: "EFTA00086877.pdf",
            url: "docs/court-documents/EFTA00086877.pdf",
            category: "court-docs",
            persons: ["Jeffery Epstein"]
        },
        {
            displayName: "Congress on Epstein",
            filename: "EFTA00175117.pdf",
            url: "docs/court-documents/EFTA00175117.pdf",
            category: "court-docs",
            persons: ["Jeffery Epstein"]
        },
        {
            displayName: "Israeli operation in dubai",
            filename: "EFTA00763787.pdf",
            url: "docs/court-documents/EFTA00763787.pdf",
            category: "emails",
            persons: ["Sultan Bin Sulayem, Jeffery Epstein"]
        },
        {
            displayName: "Beef jerky",
            filename: "EFTA00971523.pdf",
            url: "docs/court-documents/EFTA00971523.pdf",
            category: "emails",
            persons: ["Jeffery Epstein", "Eva unknown"]
        },
        {
            displayName: "Libyan dealings",
            filename: "EFTA01205723.pdf",
            url: "docs/court-documents/EFTA01205723.pdf",
            category: "emails",
            persons: ["Jeffery Epstein"]
        },
        {
            displayName: "Young woman, flight academy",
            filename: "EFTA01250248.pdf",
            url: "docs/court-documents/EFTA01250248.pdf",
            category: "emails",
            persons: ["Ghislaine Maxwell", "Jeffery Epstein", "Mark Iverson", "Bill Richardson"]
        },
        {
            displayName: "Palestinian media watch subscription letter",
            filename: "EFTA01897628.pdf",
            url: "docs/court-documents/EFTA01897628.pdf",
            category: "emails",
            persons: ["Palestinian Media Watch", "Jeffery Epstein"]
        },
        {
            displayName: "Naugthy french lessons",
            filename: "EFTA01965061.pdf",
            url: "docs/court-documents/EFTA01965061.pdf",
            category: "emails",
            persons: ["Jeffery Epstein"]
        },
        {
            displayName: "EFTA01995685",
            filename: "EFTA01995685.pdf",
            url: "docs/court-documents/EFTA01995685.pdf",
            category: "court-docs",
            persons: ["Anat Barak", "Jeffery Epstein", "Tali"]
        },
        {
            displayName: "Mossad operations inside iran",
            filename: "EFTA02404867.pdf",
            url: "docs/court-documents/EFTA02404867.pdf",
            category: "emails",
            persons: ["Terje Rod-Larsen", "Nicholas Noe"]
        },
        {
            displayName: "Trump lawsuit about rape, sex trafficking, and abuse",
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
        {

        }
    ],

    // ------ VIDEO NOTES ------
    // Add notes for videos here. Each note has a videoId and content.
    videoNotes: [
        {
            videoId: "EFTA00123083",
            content: "This video shows the entrance to the facility at 10:23pm. Notice the security guard in the background. <a href=\"../videos.html\">See all videos</a>"
        },
        {
            videoId: "EFTA01621067",
            content: "The legendary temple on Epstein's private island. <a href=\"../images/evidence/temple.jpg\">View temple image</a>"
        },
        {
            videoId: "EFTA01622052",
            content: "Video likely from when Epstein was probably in Sweden. Note the flag in the background. </a>"
        },
        {
            videoId: "EFTA01648547",
            content: "Video where a woman can be heard beating an animal or child with a baseball bat. It is also possible to hear a male moan in the background. "
        }
        // Example:
        // {
        //     videoId: "EFTA00123083",
        //     content: "This video shows..."
        // },
    ]
};
