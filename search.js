(() => {
    "use strict";

    const MAX_SUGGESTIONS = 8;
    const DATA_FILE = "tools.json";
    const SEARCH_CONTAINER_ID = "ai-search-container";

    const container = document.getElementById(SEARCH_CONTAINER_ID);
    if (!container) {
        return;
    }

    const input = container.querySelector("#ai-tool-search-input");
    const suggestionsList = container.querySelector("#ai-search-suggestions");
    const status = container.querySelector("#ai-search-status");

    if (!input || !suggestionsList || !status) {
        return;
    }

    let toolsIndex = [];
    let debounceTimer = null;

    function normalizeText(value) {
        return String(value || "").toLowerCase().trim();
    }

    function updateStatus(message) {
        status.textContent = message;
    }

    function buildIndex(rawTools) {
        if (!Array.isArray(rawTools)) {
            return [];
        }

        const indexed = [];

        for (let i = 0; i < rawTools.length; i += 1) {
            const tool = rawTools[i];

            if (!tool || typeof tool.name !== "string" || typeof tool.url !== "string") {
                continue;
            }

            const name = tool.name.trim();
            const url = tool.url.trim();
            const category = typeof tool.category === "string" ? tool.category.trim() : "";
            const description = typeof tool.description === "string" ? tool.description.trim() : "";

            if (!name || !url) {
                continue;
            }

            indexed.push({
                name,
                url,
                category,
                description,
                searchText: normalizeText([name, category, description].filter(Boolean).join(" "))
            });
        }

        return indexed;
    }

    function highlightText(text, query) {
        const fragment = document.createDocumentFragment();
        const source = String(text || "");
        const normalizedSource = source.toLowerCase();
        const normalizedQuery = normalizeText(query);

        if (!normalizedQuery) {
            fragment.appendChild(document.createTextNode(source));
            return fragment;
        }

        let cursor = 0;
        let index = normalizedSource.indexOf(normalizedQuery, cursor);

        while (index !== -1) {
            if (index > cursor) {
                fragment.appendChild(document.createTextNode(source.slice(cursor, index)));
            }

            const mark = document.createElement("mark");
            mark.textContent = source.slice(index, index + normalizedQuery.length);
            fragment.appendChild(mark);

            cursor = index + normalizedQuery.length;
            index = normalizedSource.indexOf(normalizedQuery, cursor);
        }

        if (cursor < source.length) {
            fragment.appendChild(document.createTextNode(source.slice(cursor)));
        }

        return fragment;
    }

    function clearSuggestions() {
        suggestionsList.innerHTML = "";
        suggestionsList.hidden = true;
    }

    function renderSuggestions(matches, query) {
        clearSuggestions();

        if (!query || matches.length === 0) {
            return;
        }

        const fragment = document.createDocumentFragment();

        for (let i = 0; i < matches.length; i += 1) {
            const tool = matches[i];
            const item = document.createElement("li");
            item.className = "ai-search-suggestion-item";
            item.setAttribute("role", "option");

            const link = document.createElement("a");
            link.className = "ai-search-suggestion-link";
            link.href = tool.url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            const name = document.createElement("span");
            name.className = "ai-search-suggestion-name";
            name.appendChild(highlightText(tool.name, query));
            link.appendChild(name);

            if (tool.category) {
                const meta = document.createElement("span");
                meta.className = "ai-search-suggestion-meta";
                meta.appendChild(highlightText(tool.category, query));
                link.appendChild(meta);
            }

            item.appendChild(link);
            fragment.appendChild(item);
        }

        suggestionsList.appendChild(fragment);
        suggestionsList.hidden = false;
    }

    function findMatches(query) {
        const normalizedQuery = normalizeText(query);
        if (!normalizedQuery) {
            return [];
        }

        const matches = [];

        for (let i = 0; i < toolsIndex.length && matches.length < MAX_SUGGESTIONS; i += 1) {
            if (toolsIndex[i].searchText.includes(normalizedQuery)) {
                matches.push(toolsIndex[i]);
            }
        }

        return matches;
    }

    function handleSearchInput() {
        const trimmedQuery = input.value.trim();

        if (!trimmedQuery) {
            clearSuggestions();
            if (toolsIndex.length > 0) {
                updateStatus("Loaded " + toolsIndex.length + " tools. Start typing to search.");
            }
            return;
        }

        const matches = findMatches(trimmedQuery);
        renderSuggestions(matches, trimmedQuery);

        if (matches.length === 0) {
            updateStatus("No tools found for \"" + trimmedQuery + "\".");
        } else {
            updateStatus("Showing " + matches.length + " result(s).");
        }
    }

    async function loadToolsData() {
        updateStatus("Loading tools...");

        try {
            const response = await fetch(DATA_FILE);
            if (!response.ok) {
                throw new Error("Failed to fetch " + DATA_FILE + " (" + response.status + ")");
            }

            const data = await response.json();
            const tools = Array.isArray(data)
                ? data
                : data && Array.isArray(data.tools)
                    ? data.tools
                    : [];

            toolsIndex = buildIndex(tools);

            if (toolsIndex.length === 0) {
                updateStatus("No tools found in tools.json.");
                return;
            }

            updateStatus("Loaded " + toolsIndex.length + " tools. Start typing to search.");
        } catch (error) {
            console.error("AI search load error:", error);
            updateStatus("Unable to load tools.json. Check path and JSON format.");
        }
    }

    input.addEventListener("input", () => {
        window.clearTimeout(debounceTimer);
        debounceTimer = window.setTimeout(handleSearchInput, 45);
    });

    input.addEventListener("focus", () => {
        if (input.value.trim()) {
            handleSearchInput();
        }
    });

    input.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            clearSuggestions();
            input.blur();
        }
    });

    document.addEventListener("click", (event) => {
        if (!container.contains(event.target)) {
            clearSuggestions();
        }
    });

    loadToolsData();
})();
