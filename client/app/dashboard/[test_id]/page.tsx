import Header from "@/app/components/header";
import { notFound } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ test_id: string }>;
}) {
  const params = await props.params;
  const id = params.test_id;

  const response = await fetch(`http://localhost:8000/api/tests/${id}/results`);

  if (response.status === 404 || response.status === 400) {
    notFound();
  }
  if (!response.ok) {
    throw new Error("Unable to retrieve findings");
  }

  const result = await response.json();
  const { test_id, severity, title, report } = result.findings;

  return (
    <>
      <Header />
      <h1>`{title} ID: {test_id}`</h1>
      <p>{severity}</p>
      <p>{report}</p>
    </>
  );
}
