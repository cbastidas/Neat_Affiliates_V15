import React, { useEffect, useState } from "react";
import { supabase } from './lib/supabaseClient';

const NewsImageEditor: React.FC = () => {
  const [newsImages, setNewsImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [newFile, setNewFile] = useState<File | null>(null);

  // Load all news images
  const loadNews = async () => {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setNewsImages(data || []);
  };

  useEffect(() => {
    loadNews();
  }, []);

  // Upload file to bucket
  const uploadImage = async () => {
    if (!newFile) return;

    try {
      setUploading(true);
      const fileExt = newFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("news-images")
        .upload(fileName, newFile);

      if (uploadError) throw uploadError;

      const { data: publicURLData } = supabase.storage
        .from("news-images")
        .getPublicUrl(fileName);

      const imageUrl = publicURLData?.publicUrl;

      const { error: insertError } = await supabase.from("news").insert([
        {
          image_url: imageUrl,
          visible: false,
        },
      ]);

      if (insertError) throw insertError;

      setNewFile(null);
      loadNews();
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  // Delete image
  const deleteImage = async (id: string, url: string) => {
    const fileName = url.split("/").pop();

    await supabase.storage.from("news-images").remove([fileName || ""]);

    await supabase.from("news").delete().eq("id", id);

    loadNews();
  };

  // Replace image
  const replaceImage = async (id: string, oldUrl: string, file: File) => {
    const oldFileName = oldUrl.split("/").pop();
    const newExt = file.name.split(".").pop();
    const newFileName = `${Date.now()}.${newExt}`;

    // Remove old image
    await supabase.storage.from("news-images").remove([oldFileName || ""]);

    // Upload new image
    await supabase.storage
      .from("news-images")
      .upload(newFileName, file);

    const { data } = supabase.storage
      .from("news-images")
      .getPublicUrl(newFileName);

    const publicUrl = data?.publicUrl;

    // Update record
    await supabase.from("news").update({ image_url: publicUrl }).eq("id", id);

    loadNews();
  };

  // Toggle visibility
  const toggleVisibility = async (id: string, current: boolean) => {
    await supabase.from("news").update({ visible: !current }).eq("id", id);
    loadNews();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: 600 }}>News Image Manager</h2>
      <p style={{ marginBottom: 20 }}>Upload, edit or hide news images.</p>

      {/* Upload new image */}
      <div
        style={{
          padding: 20,
          background: "#fafafa",
          borderRadius: 12,
          marginBottom: 30,
          border: "1px solid #e5e5e5",
        }}
      >
        <h3 style={{ fontWeight: 600, marginBottom: 10 }}>Add News Image</h3>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewFile(e.target.files?.[0] || null)}
          style={{
            marginBottom: 10,
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: 8,
            width: "100%",
          }}
        />

        <button
          onClick={uploadImage}
          disabled={uploading || !newFile}
          style={{
            background: "#6D00DC",
            color: "white",
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
          }}
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
      </div>

      {/* List images */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {newsImages.map((item) => (
          <div
            key={item.id}
            style={{
              padding: 20,
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #ddd",
            }}
          >
            <img
              src={item.image_url}
              alt="news"
              style={{
                width: "100%",
                maxHeight: 300,
                objectFit: "cover",
                borderRadius: 8,
                marginBottom: 10,
              }}
            />

            {/* Visibility toggle */}
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="checkbox"
                checked={item.visible}
                onChange={() => toggleVisibility(item.id, item.visible)}
              />
              Visible on website
            </label>

            {/* Replace image */}
            <div style={{ marginTop: 10 }}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  replaceImage(
                    item.id,
                    item.image_url,
                    e.target.files?.[0] || new File([], "")
                  )
                }
              />
            </div>

            {/* Delete */}
            <button
              onClick={() => deleteImage(item.id, item.image_url)}
              style={{
                marginTop: 15,
                background: "#ff3b3b",
                padding: "8px 18px",
                borderRadius: 6,
                border: "none",
                color: "white",
                cursor: "pointer",
              }}
            >
              Delete Image
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsImageEditor;
