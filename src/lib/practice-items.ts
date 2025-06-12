import { supabase } from '@/components/supabaseClient'
import { Database } from '@/types/supabase'

export type PracticeItem = Database["public"]["Tables"]["practice_items"]["Row"]
export type NewPracticeItem = Database["public"]["Tables"]["practice_items"]["Insert"]

export async function fetchPracticeItems(userId: string) {
  const { data, error } = await supabase
    .from("practice_items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching practice items:", error)
    throw error
  }

  return data
}

export async function addPracticeItem(item: NewPracticeItem) {
  const { data, error } = await supabase
    .from("practice_items")
    .insert(item)
    .select()
    .single()

  if (error) {
    console.error("Error adding practice item:", error)
    throw error
  }

  return data
}

export async function deletePracticeItem(id: string) {
  const { error } = await supabase
    .from("practice_items")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting practice item:", error)
    throw error
  }
} 