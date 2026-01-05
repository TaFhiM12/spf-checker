const btn = document.getElementById("checkBtn");
const domainInput = document.getElementById("domain");
const result = document.getElementById("result");
const loading = document.getElementById("loading");

btn.addEventListener("click", checkSPF);

async function checkSPF() {
  const domain = domainInput.value.trim();

  result.textContent = "";
  loading.textContent = "";

  if (!domain) {
    result.innerHTML = "<span class='error'>Enter a domain name</span>";
    return;
  }

  loading.textContent = "Checking SPF...";

  try {
    const res = await fetch(
      `https://dns.google/resolve?name=${domain}&type=TXT`
    );
    const data = await res.json();

    loading.textContent = "";

    if (!data.Answer) {
      result.innerHTML = "<span class='error'>No TXT records found</span>";
      return;
    }

    const spf = data.Answer
      .map(r => r.data.replace(/"/g, ""))
      .filter(r => r.toLowerCase().startsWith("v=spf1"));

    if (spf.length === 0) {
      result.innerHTML = "<span class='error'>No SPF record found</span>";
      return;
    }

    result.textContent = spf.join("\n\n");

  } catch {
    loading.textContent = "";
    result.innerHTML = "<span class='error'>Something went wrong</span>";
  }
}
