export async function submitContact(payload: { name: string; email: string; message: string }) {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return response.json();
}

export async function checkHealth() {
  const response = await fetch("/api/health");
  return response.json();
}