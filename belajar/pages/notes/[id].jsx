import dynamic from "next/dynamic";
const LayoutComponent = dynamic(() => import("@/layout"));

export default function DetailNotes({ notes }) {
  console.log("data detail notes =>", notes);
  return (
    <LayoutComponent metaTitle="DetailNotes">
      <div>
        <p>
          title: {notes.name}
        </p>
        <p>
            fullname: {notes.full_name}
        </p>
      </div>
    </LayoutComponent>
  );
}

export async function getStaticPaths() {
  const res = await fetch("https://api.github.com/repos/vercel/next.js");
  const repo = await res.json();

  const paths = [{ params: { id: repo.id.toString() } }];

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps() {
  const res = await fetch("https://api.github.com/repos/vercel/next.js");
  const repo = await res.json();
  return { props: { notes: { data: repo } } };
}