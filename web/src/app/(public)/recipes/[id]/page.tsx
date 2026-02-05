export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <div>id: {id}</div>;
}
