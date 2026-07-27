import AdminPostForm from "@/components/AdminPostForm";

export default function NewPostPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-8 font-display text-5xl uppercase">New Post</h1>
      <AdminPostForm />
    </section>
  );
}
