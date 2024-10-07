import dynamic from "next/dynamic";
const LayoutComponent = dynamic(() => import("@/layout"));

export default function DetailNotes({ notes }) {
  console.log("data detail notes =>", notes);
  return (
    <LayoutComponent metaTitle="DetailNotes">
      <div>
        <p>title: {notes.data.title}</p>
        <p>desc: {notes.data.description}</p>
        <p>update at: {notes.data.updated_at}</p>
      </div>
    </LayoutComponent>
  );
}

export async function getStaticPaths() {
  const res = await fetch("https://service.pace-unv.cloud/api/notes");
  const notes = await res.json();

  const paths = notes.data.map((item) => ({
    params: {
      id: item.id,
    },
  }))

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const { id } = context.params;
  const res = await fetch(`https://service.pace-unv.cloud/api/notes/${id}`);
  const notes = await res.json();
  return { props: { notes }, revalidate:10 };
}