
// Mock Supabase Client for Local Testing
export const createClient = () => {
    return {
        auth: {
            getSession: async () => {
                return {
                    data: {
                        session: {
                            access_token: 'mock-token',
                            user: { id: 'mock-user-id', email: 'test@example.com' },
                        },
                    },
                };
            },
        },
        storage: {
            from: (bucket: string) => ({
                upload: async (path: string, file: File) => {
                    console.log(`[Mock Supabase] Uploading ${file.name} to ${bucket}/${path}`);
                    // Simulate network delay
                    await new Promise((resolve) => setTimeout(resolve, 500));
                    return { data: { path }, error: null };
                },
                getPublicUrl: (path: string) => {
                    // Return a placeholder image or try to create a blob url if possible (but tricky here without state)
                    // For now return a generic placeholder
                    return {
                        data: { publicUrl: 'https://via.placeholder.com/800x400.png?text=Uploaded+Image' },
                    };
                },
            }),
        },
    };
};
