import Header from "@/app/components/header";

export default async function Page(props: { params: Promise<{ test_id: string }> }) {
    const params = await props.params
    console.log(params.test_id)
  return (
    <>
      <Header />
      <h1>Dashboard page</h1>
    </>
  );
}
