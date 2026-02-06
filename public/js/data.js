// ========================================================
// DATA.JS - All site content lives here.
// To add content, just add a new object to the relevant array.
// ========================================================

const SITE_DATA = {

    // ------ SITE METADATA ------
    meta: {
        siteTitle: "The Epstein Files",
        siteSubtitle: "A Comprehensive Investigation",
        heroTagline: "Exposing the truth through documents, connections, and evidence.",
        footerText: "This site is for informational and educational purposes only."
    },

    // ------ TIMELINE ENTRIES ------
    // Add new entries by copying an object and filling in the fields.
    timeline: [
        {
            date: "1953",
            title: "Birth",
            description: "Jeffrey Edward Epstein born January 20, 1953 in Brooklyn, New York.",
            source: "",
            sourceLabel: ""
        },
        {
            date: "1976",
            title: "Teaching Career",
            description: "Placeholder: Begins teaching at Dalton School. Replace with real content.",
            source: "",
            sourceLabel: ""
        },
        {
            date: "1982",
            title: "Financial Career Begins",
            description: "Placeholder: Enters the financial industry. Replace with real content.",
            source: "",
            sourceLabel: ""
        },
        {
            date: "2005",
            title: "First Investigation",
            description: "Placeholder: Police begin investigating allegations. Replace with real content.",
            source: "",
            sourceLabel: ""
        },
        {
            date: "2008",
            title: "Plea Deal",
            description: "Placeholder: Controversial plea agreement reached. Replace with real content.",
            source: "",
            sourceLabel: ""
        },
        {
            date: "2019",
            title: "Arrest & Charges",
            description: "Placeholder: Arrested on federal charges. Replace with real content.",
            source: "",
            sourceLabel: ""
        },
        {
            date: "August 2019",
            title: "Death in Custody",
            description: "Placeholder: Found dead in Metropolitan Correctional Center. Replace with real content.",
            source: "",
            sourceLabel: ""
        },
        {
            date: "2023-2024",
            title: "Document Releases",
            description: "Placeholder: Court-ordered release of sealed documents. Replace with real content.",
            source: "",
            sourceLabel: ""
        },
        // ADD MORE TIMELINE ENTRIES HERE
    ],

    // ------ KEY FIGURES ------
    // Add a new figure by copying an object below.
    keyFigures: [
        {
            name: "Placeholder Person A",
            role: "Associate",
            description: "Placeholder description of this person's connection. Replace with real content.",
            image: "images/people/placeholder-person-1.jpg",
            sources: [
                { url: "#", label: "Source 1" }
            ]
        },
        {
            name: "Placeholder Person B",
            role: "Associate",
            description: "Placeholder description. Replace with real content.",
            image: "images/people/placeholder-person-1.jpg",
            sources: [
                { url: "#", label: "Source 1" }
            ]
        },
        {
            name: "Placeholder Person C",
            role: "Legal",
            description: "Placeholder description. Replace with real content.",
            image: "images/people/placeholder-person-1.jpg",
            sources: [
                { url: "#", label: "Source 1" }
            ]
        },
        // ADD MORE KEY FIGURES HERE
    ],

    // ------ DOCUMENTS ------
    // Add a new document: drop the file into public/docs/<category>/
    // then add an entry here.
    documents: [
        {
            title: "Placeholder Court Document",
            category: "court-documents",
            filename: "placeholder-1.pdf",
            url: "docs/court-documents/placeholder-1.pdf",
            date: "2024-01-01",
            description: "Placeholder: Replace with real court document description.",
            pages: 1
        },
        {
            title: "Placeholder Flight Log",
            category: "flight-logs",
            filename: "placeholder-2.pdf",
            url: "docs/flight-logs/placeholder-2.pdf",
            date: "2024-01-01",
            description: "Placeholder: Replace with real flight log description.",
            pages: 1
        },
        // ADD MORE DOCUMENTS HERE
    ],

    // ------ GALLERY IMAGES ------
    // Add a new image: drop the file into public/images/<category>/
    // then add an entry here.
    gallery: [
        {
            src: "images/people/placeholder-person-1.jpg",
            alt: "Placeholder person photo",
            caption: "Placeholder caption. Replace with real content.",
            category: "people"
        },
        {
            src: "images/locations/placeholder-location-1.jpg",
            alt: "Placeholder location photo",
            caption: "Placeholder caption. Replace with real content.",
            category: "locations"
        },
        {
            src: "images/screenshots/placeholder-screenshot-1.jpg",
            alt: "Placeholder screenshot",
            caption: "Placeholder caption. Replace with real content.",
            category: "screenshots"
        },
        // ADD MORE GALLERY IMAGES HERE
    ],

    // ------ EXTERNAL LINKS / RESOURCES ------
    // Types: "article", "video", "database", "legal"
    resources: [
        {
            title: "Placeholder News Article",
            url: "#",
            description: "Placeholder: Replace with a link to a real news article.",
            type: "article"
        },
        {
            title: "Placeholder Court Records Database",
            url: "#",
            description: "Placeholder: Replace with a link to a real legal database.",
            type: "legal"
        },
        {
            title: "Placeholder Documentary",
            url: "#",
            description: "Placeholder: Replace with a link to a real documentary or video.",
            type: "video"
        },
        {
            title: "Placeholder Public Records",
            url: "#",
            description: "Placeholder: Replace with a link to a real public records source.",
            type: "database"
        },
        // ADD MORE RESOURCES HERE
    ]
};
