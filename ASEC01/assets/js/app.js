
document.addEventListener("DOMContentLoaded", () => {
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav a").forEach(a => {
    if (a.getAttribute("href") === current) a.classList.add("active");
  });

  const search = document.querySelector("#tableSearch");
  if(search){
    search.addEventListener("input", () => {
      const keyword = search.value.trim().toLowerCase();
      document.querySelectorAll("[data-search-row]").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(keyword) ? "" : "none";
      });
    });
  }
});
