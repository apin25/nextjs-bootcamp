import dynamic from "next/dynamic";
import Link from "next/link"; // Make sure you import Link from 'next/link'

const LayoutComponent = dynamic(() => import("@/layout"));

export default function Notes({ notes }) {
  console.log("notes data =>", notes);
  return (
    <>
      <LayoutComponent metaTitle="Notes">
        <div style={{ border: "1px solid grey", marginTop:"5px" }}>
          <Link href={`/notes/${notes.id}`}>
            <p>{notes.name}</p>
          </Link>
        </div>
      </LayoutComponent>
    </>
  );
}

export async function getServerSideProps() {
  const res = await fetch("https://api.github.com/repos/vercel/next.js");
  const notes = await res.json();
  return { props: { notes } };
}