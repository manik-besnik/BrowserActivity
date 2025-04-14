document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get("activityLogs", ({ activityLogs }) => {
      const container = document.getElementById("output");
  
      if (!activityLogs || Object.keys(activityLogs).length === 0) {
        container.textContent = "No data yet.";
        return;
      }
  
      container.innerHTML = '';
  
      for (const date in activityLogs) {
        const dateHeader = document.createElement("h2");
        dateHeader.textContent = date;
        container.appendChild(dateHeader);
  
        const dayLogs = activityLogs[date];
        for (const domain in dayLogs) {
          const domainHeader = document.createElement("h3");
          domainHeader.textContent = domain;
          container.appendChild(domainHeader);
  
          const list = document.createElement("ul");
          dayLogs[domain].forEach(entry => {
            const item = document.createElement("li");
            item.textContent = `${entry.url} - ${entry.timeSpent}s`;
            list.appendChild(item);
          });
  
          container.appendChild(list);
        }
      }
    });
  });
  