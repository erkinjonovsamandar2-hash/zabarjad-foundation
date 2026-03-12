import { createClient } from "@supabase/supabase-js";

const url = "https://ovlqfgjdmbvstqibrqrl.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92bHFmZ2pkbWJ2c3RxaWJycXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NTMxMDMsImV4cCI6MjA4NzEyOTEwM30.1uN1tvS3oWaGLCJr8fVJqEAEr7HdarS3aD-6RKMV7gs";

console.log("Checking raw Fetch API first...");
fetch(`${url}/rest/v1/books?select=*`, {
    headers: {
        apikey: key,
        Authorization: `Bearer ${key}`
    }
})
    .then(raw => {
        console.log("Raw Fetch Status:", raw.status);
        return raw.json();
    })
    .then(data => console.log("Raw Fetch Data:", data.length, "items"))
    .catch(err => console.log("Raw Fetch Failed:", err.message));

console.log("Checking Supabase JS Client...");
const supabase = createClient(url, key);
supabase.from("books").select("*")
    .then(({ data, error }) => {
        console.log("Supabase JS Error:", error);
        console.log("Supabase JS Data:", data?.length, "items");
    })
    .catch(err => console.log("Supabase JS Threw:", err.message));
