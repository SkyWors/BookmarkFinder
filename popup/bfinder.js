chrome.bookmarks.getTree(function(bookmarks) {
	var bookmarklist = [];

    function processBookmarks(bookmarks) {
        for (let bookmark of bookmarks) {
            if (bookmark.url) {
                bookmarklist.push({
                    title: bookmark.title,
                    url: bookmark.url
                });
            }
            if (bookmark.children) {
                processBookmarks(bookmark.children);
            }
        }
    }

    if (!chrome.runtime.lastError) {
        processBookmarks(bookmarks);

		bookmarklist.forEach(function (bookmark) {
			if (bookmark.title != "") {
				let element = document.createElement("a");
				element.setAttribute("id", "item");
				element.href = bookmark.url;
				element.setAttribute("target", "_blank");
				element.title = bookmark.title;

				let title = document.createElement("a");
				title.textContent = bookmark.title + "\n";

				let url = new URL(chrome.runtime.getURL("/_favicon/"));
				url.searchParams.set("pageUrl", bookmark.url);
				url.searchParams.set("size", 64);

				let icon = document.createElement("img");
				icon.src = url;

				element.append(icon);
				element.append(title);

				document.getElementById("list").append(element);
			}
		})

		var listItems = document.querySelectorAll('#item');
		var visibleItems = []
		visibleItems.push(listItems[0]);

		if (Object.keys(listItems).length === 0) {
			document.body.textContent = "";
			let text = document.createElement("a");
			text.textContent = "There is currently no bookmark here.";
			document.body.append(text);
		} else {
			document.getElementById("search").addEventListener("input", function (event) {
				var searchTerm = event.target.value.toLowerCase();

				listItems.forEach(function (item) {
					var itemText = item.textContent.toLowerCase();

					if (itemText.includes(searchTerm)) {
						item.style.display = "flex";
					} else {
						item.style.display = "none";
					}
				});

				visibleItems = Array.from(listItems).filter(function(item) {
					return window.getComputedStyle(item).display === "flex";
				});

				if (Object.keys(visibleItems).length === 0) {
					if (!document.querySelector("#nobookmark")) {
						let text = document.createElement("a");
						text.textContent = "No bookmark were found.";
						text.id = "nobookmark";
						document.body.append(text);
					}
				} else {
					document.getElementById("nobookmark").remove();
				}
			});

			document.addEventListener('keydown', function (event) {
				if (event.key === "Enter") {
					window.open(visibleItems[0].href);
				}
			})
		}
    }
});
