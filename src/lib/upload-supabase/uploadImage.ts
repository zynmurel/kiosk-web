import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
// Initialize Supabase client
const supabaseUrl = 'https://brtsckbiqiwmrqcjqmfm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJydHNja2JpcWl3bXJxY2pxbWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEwMjkxNzYsImV4cCI6MjAzNjYwNTE3Nn0.WY1vRPLeAd7XH5EkD_8KemcKJXvG_-LznucJHxkIgGw';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadImage(file:File) {
  const filePath = `products/${uuidv4()}`; 

  const { data, error } = await supabase.storage
    .from('alvas') 
    .upload(filePath, file);
  console.log(data)
  if (error) {
    console.error('Error uploading file:', error.message);
    throw error;
  }

  const { data:{publicUrl} } = supabase.storage
    .from('alvas') 
    .getPublicUrl(filePath);

  if (!publicUrl) {
    console.error('Error generating public URL:', "error");
    throw new Error("Error");
  }

  console.log('Public URL:', publicUrl);

  return publicUrl; 
}
