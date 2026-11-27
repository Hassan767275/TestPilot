import Header from "@/app/components/header";

export default async function Page(props: {
  params: Promise<{ test_id: string }>;
}) {
  const params = await props.params;
  const test_id = params.test_id

  const response = await fetch(`http://localhost:8000/api/tests/${test_id}/results`)

  return (
    <>
      <Header />
      <h1>{params.test_id}</h1>
    </>
  );
}
