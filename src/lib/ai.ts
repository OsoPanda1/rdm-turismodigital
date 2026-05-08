export async function askIsabella(message: string) {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/isabella-chat`, {
    method: "POST",
    headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  })
  return response.text()
}
