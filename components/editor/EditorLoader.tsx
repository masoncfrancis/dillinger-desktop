"use client";

import dynamic from "next/dynamic";
import { EditorSkeleton } from "@/components/ui/Skeleton";

const EditorContainer = dynamic(
  () =>
    import("@/components/editor/EditorContainer").then(
      (module) => module.EditorContainer
    ),
  {
    ssr: false,
    loading: () => <EditorSkeleton />,
  }
);

export function EditorLoader() {
  return <EditorContainer />;
}
