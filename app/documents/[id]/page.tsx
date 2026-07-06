import { getDocumentById } from "@/lib/db";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function DocumentPage({ params }: Props) {
  const { id } = await params;
  const doc = await getDocumentById(id);

  if (!doc) {
    return <div>Document not found</div>;
  }

  return (
    <div>
      <h1>{doc.title}</h1>
      {/* Add your document viewer here */}
      <pre>{JSON.stringify(doc, null, 2)}</pre>
    </div>
  );
}
