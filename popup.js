document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get("activityLogs", ({ activityLogs }) => {
    const container = document.getElementById("output");

    if (!activityLogs || Object.keys(activityLogs).length === 0) {
      container.textContent = "No data yet.";
      return;
    }

    container.innerHTML = '';

    // Sort dates in descending order
    const sortedDates = Object.keys(activityLogs).sort((a, b) => b.localeCompare(a));
    const today = new Date().toISOString().split('T')[0];

    for (const date of sortedDates) {
      const dateHeader = document.createElement("h2");
      dateHeader.textContent = date;
      container.appendChild(dateHeader);

      const dayLogs = activityLogs[date];

      for (const domain in dayLogs) {
        const entries = dayLogs[domain];

        // Calculate total time for the domain
        const totalTime = entries.reduce((sum, entry) => sum + entry.timeSpent, 0);

        // Create domain summary container
        const domainContainer = document.createElement("div");
        domainContainer.style.marginBottom = "4px";

        // Create clickable domain header
        const domainHeader = document.createElement("h3");
        domainHeader.innerHTML = `<span style="cursor:pointer; color:#007bff;">${domain}</span> <span style="color:#666;">Time: ${totalTime}s</span>`;

        // Create detail list and set to hidden by default
        const detailList = document.createElement("ul");
        detailList.style.display = "none";
        detailList.style.marginLeft = "20px";

        entries.forEach(entry => {
          const item = document.createElement("li");
          item.textContent = `${entry.url} - ${entry.timeSpent}s`;
          detailList.appendChild(item);
        });

        // Toggle logic for showing details
        domainHeader.addEventListener("click", () => {
          detailList.style.display = detailList.style.display === "none" ? "block" : "none";
        });

        // Optional: auto-expand today's domains
        // if (date === today) detailList.style.display = "block";

        domainContainer.appendChild(domainHeader);
        domainContainer.appendChild(detailList);
        container.appendChild(domainContainer);
      }
    }
  });
});
