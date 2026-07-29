"use client"; // trigger hmr

import React, { useState, useEffect } from "react";
import { AdminDataTable, Column } from "@/components/admin/admin-data-table";
import { AdminModal } from "@/components/admin/admin-modal";
import { Edit2, Trash2, Eye, FileCheck, FileEdit } from "lucide-react";
import { getAdminBlogs, createAdminBlog, updateAdminBlog, deleteAdminBlog } from "@/lib/api/admin-api";

interface BlogArticle {
  id: string;
  title: string;
  category: string;
  author: string;
  readTime: string;
  status: "published" | "draft";
  publishedAt: string;
}

const initialArticles: BlogArticle[] = [
  { id: "1", title: "Micro-Frontend Architectures with Next.js 15 & React 19", category: "Architecture", author: "Dr. Aris Thorne", readTime: "8 min read", status: "published", publishedAt: "Jul 18, 2026" },
  { id: "2", title: "Optimizing High-Throughput Mongo Atlas Sharding", category: "Database", author: "Elena Rostova", readTime: "12 min read", status: "published", publishedAt: "Jul 12, 2026" },
  { id: "3", title: "Building Enterprise RAG Pipelines with PyTorch & Pinecone", category: "AI Engineering", author: "Dr. Aris Thorne", readTime: "10 min read", status: "published", publishedAt: "Jul 05, 2026" },
  { id: "4", title: "Zero-Trust Cloud Security Architecture for Kubernetes", category: "Security", author: "Marcus Vance", readTime: "6 min read", status: "draft", publishedAt: "Draft" },
];

export default function BlogCMSPage() {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await getAdminBlogs();
      setArticles(data.map((item: any) => ({
        id: item._id,
        title: item.title,
        category: item.category,
        author: item.author,
        readTime: "5 min read", // Can calculate from content length if needed
        status: item.isPublished ? "published" : "draft",
        publishedAt: new Date(item.publishedAt || item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      })));
    } catch (error) {
      console.error("Failed to fetch blogs", error);
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    title: "",
    category: "Architecture",
    author: "Dr. Aris Thorne",
    readTime: "5 min read",
    status: "published" as "published" | "draft",
  });

  const handleOpenModal = (article?: BlogArticle) => {
    if (article) {
      setEditingArticle(article);
      setFormData({
        title: article.title,
        category: article.category,
        author: article.author,
        readTime: article.readTime,
        status: article.status,
      });
    } else {
      setEditingArticle(null);
      setFormData({ title: "", category: "Architecture", author: "Dr. Aris Thorne", readTime: "5 min read", status: "published" });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        category: formData.category,
        author: formData.author,
        isPublished: formData.status === "published",
        summary: "Default summary generated...",
        content: "Draft content..."
      };

      if (editingArticle) {
        await updateAdminBlog({ id: editingArticle.id, ...payload });
      } else {
        await createAdminBlog(payload);
      }
      setIsModalOpen(false);
      fetchBlogs();
    } catch (error) {
      console.error("Failed to save blog", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      try {
        await deleteAdminBlog(id);
        fetchBlogs();
      } catch (error) {
        console.error("Failed to delete blog", error);
      }
    }
  };

  const columns: Column<BlogArticle>[] = [
    { header: "Article Title", accessorKey: "title" },
    {
      header: "Category",
      cell: (row) => (
        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
          {row.category}
        </span>
      ),
    },
    { header: "Author", accessorKey: "author" },
    { header: "Read Time", accessorKey: "readTime" },
    {
      header: "Status",
      cell: (row) => (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${row.status === "published" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
          {row.status}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button onClick={() => handleOpenModal(row)} className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => handleDelete(row.id)} className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <AdminDataTable
        title="Blog Articles CMS"
        description="Publish, schedule, and edit technical insights and engineering articles."
        columns={columns}
        data={articles}
        searchPlaceholder="Search articles..."
        onAddNew={() => handleOpenModal()}
        addNewLabel="Write Article"
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingArticle ? "Edit Article" : "Write New Article"}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Article Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Author</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Publishing Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 font-bold">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20">
              Save Article
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
