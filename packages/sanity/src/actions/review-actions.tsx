import { CheckmarkIcon } from "@sanity/icons/Checkmark";
import { CommentIcon } from "@sanity/icons/Comment";
import { TrashIcon } from "@sanity/icons/Trash";
import { Button, Flex, Stack, Text, TextArea } from "@sanity/ui";
import { useToast } from "@sanity/ui/toast";
import { useEffect, useState } from "react";
import { useClient, useDocumentOperation, type DocumentActionComponent } from "sanity";
import { DEFAULT_API_VERSION } from "@portfolio/content/client";

type CommentDocument = {
  _id: string;
  section?: string;
  filePath?: string;
  line?: number;
  commitSha?: string;
  lineText?: string;
  context?: string;
  author?: { name?: string };
  body?: string;
  parent?: { _ref: string };
};

export const ApproveCommentAction: DocumentActionComponent = (props) => {
  const { patch, publish } = useDocumentOperation(props.id, props.type);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    if (approving && !props.draft) setApproving(false);
  }, [approving, props.draft]);

  if (!props.draft) return null;

  return {
    label: approving ? "Approving…" : props.published ? "Publish changes" : "Approve",
    icon: CheckmarkIcon,
    tone: "positive",
    disabled: Boolean(publish.disabled) || approving,
    onHandle: () => {
      setApproving(true);
      patch.execute([{ unset: ["submitterHash"] }]);
      publish.execute();
    },
  };
};
ApproveCommentAction.action = "publish";

export const RejectCommentAction: DocumentActionComponent = (props) => {
  const { del } = useDocumentOperation(props.id, props.type);
  const [confirming, setConfirming] = useState(false);

  if (!props.draft || props.published) return null;

  return {
    label: "Reject",
    icon: TrashIcon,
    tone: "critical",
    disabled: Boolean(del.disabled),
    onHandle: () => setConfirming(true),
    dialog: confirming && {
      type: "confirm",
      tone: "critical",
      message: "Reject this comment? It will be deleted and can't be restored.",
      confirmButtonText: "Reject",
      onCancel: () => setConfirming(false),
      onConfirm: () => {
        del.execute();
        setConfirming(false);
      },
    },
  };
};

export const ReplyCommentAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion: DEFAULT_API_VERSION });
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const root = props.published as CommentDocument | null;
  if (!root || root.parent) return null;

  async function send() {
    if (!root || !body.trim()) return;
    setSending(true);
    try {
      const name = await client.fetch<string | null>(`*[_type == "settings"][0].name`);
      await client.create({
        _type: "reviewComment",
        section: root.section,
        filePath: root.filePath,
        line: root.line,
        commitSha: root.commitSha,
        lineText: root.lineText,
        context: root.context,
        author: { name: name ?? "Author" },
        body: body.trim(),
        isOwner: true,
        parent: { _type: "reference", _ref: root._id, _weak: true },
      });
      toast.push({ status: "success", title: "Reply published" });
      setBody("");
      setOpen(false);
    } catch (error) {
      toast.push({
        status: "error",
        title: "The reply couldn't be published",
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setSending(false);
    }
  }

  return {
    label: "Reply",
    icon: CommentIcon,
    onHandle: () => setOpen(true),
    dialog: open && {
      type: "dialog",
      header: `Reply to ${root.author?.name ?? "this comment"}`,
      width: "medium",
      onClose: () => setOpen(false),
      content: (
        <Stack gap={4}>
          {root.body && (
            <Text size={1} muted>
              {root.body}
            </Text>
          )}
          <TextArea
            rows={6}
            value={body}
            autoFocus
            placeholder="Your reply is published right away and marked as Author."
            onChange={(event) => setBody(event.currentTarget.value)}
          />
          <Flex justify="flex-end" gap={2}>
            <Button mode="ghost" text="Cancel" onClick={() => setOpen(false)} />
            <Button
              tone="primary"
              text="Publish reply"
              loading={sending}
              disabled={!body.trim() || sending}
              onClick={send}
            />
          </Flex>
        </Stack>
      ),
    },
  };
};
