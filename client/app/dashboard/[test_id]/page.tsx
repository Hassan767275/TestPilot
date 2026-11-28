import Header from "@/app/components/header";
import { notFound } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ test_id: string }>;
}) {
  const params = await props.params;
  const test_id = params.test_id

  const response = await fetch(`http://localhost:8000/api/tests/${test_id}/results`)

  if (response.status === 404 || response.status === 400) {
      notFound()
  }
  if (!response.ok) {
    throw new Error("Unable to retrieve findings")
  }

  const findings = await response.json()

  console.log(findings)

  return (
    <>
      <Header />
      <h1>{params.test_id}</h1>
    </>
  );
}
