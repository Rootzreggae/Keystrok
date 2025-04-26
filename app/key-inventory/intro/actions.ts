"use server"

export async function submitIntroComplete() {
  // In a real app, this would store the preference in a database
  // For now, we'll rely on localStorage in the client component
  return { success: true }
}
