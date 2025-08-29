// Replace supabase client: this project has migrated to Firebase.
// Any import of this file should be removed. Temporary shim to prevent build-time missing module errors.
export function createClient() {
	throw new Error('Supabase has been removed. Use Firestore via lib/firebase/client instead.')
}
export const supabase = undefined as unknown as never
