import { useEffect, useState } from "react";
import { useClient, useFormValue, type StringInputProps } from "sanity";
import { DEFAULT_API_VERSION } from "@portfolio/content/client";

const takenSectionsQuery = `*[_type == "reviewSection" && defined(section) && !(_id in [$id, $draft])].section`;

export function UniqueSectionInput(props: StringInputProps) {
  const client = useClient({ apiVersion: DEFAULT_API_VERSION });
  const documentId = (useFormValue(["_id"]) as string | undefined)?.replace(/^drafts\./, "");
  const [taken, setTaken] = useState<string[]>([]);

  useEffect(() => {
    if (!documentId) return;
    let active = true;
    client
      .fetch<string[]>(takenSectionsQuery, { id: documentId, draft: `drafts.${documentId}` })
      .then((sections) => active && setTaken(sections))
      .catch(() => active && setTaken([]));
    return () => {
      active = false;
    };
  }, [client, documentId]);

  const options = props.schemaType.options;
  const list = (options?.list ?? []).filter((item) => {
    const value = typeof item === "string" ? item : item.value;
    return value === props.value || !taken.includes(value ?? "");
  }) as typeof options extends { list?: infer L } ? L : never;

  return props.renderDefault({
    ...props,
    schemaType: { ...props.schemaType, options: { ...options, list } },
  });
}
